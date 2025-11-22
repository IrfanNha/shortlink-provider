/**
 * Professional Rate Limiter with Sliding Window Algorithm
 * 
 * Features:
 * - Per-IP rate limiting
 * - Sliding window for accurate rate limiting
 * - Automatic cleanup of old entries
 * - Configurable limits per endpoint
 * - Thread-safe (for single-instance deployments)
 */

export interface RateLimitConfig {
    windowMs: number; // Time window in milliseconds
    maxRequests: number; // Maximum requests allowed in the window
}

export interface RateLimitResult {
    allowed: boolean;
    limit: number;
    remaining: number;
    resetTime: number; // Unix timestamp when the window resets
}

interface RequestLog {
    timestamps: number[]; // Array of request timestamps
    lastCleanup: number; // Last time we cleaned up old timestamps
}

/**
 * In-memory rate limiter using sliding window algorithm
 * 
 * For production with multiple instances, consider using Redis
 */
export class RateLimiter {
    private requests = new Map<string, RequestLog>();
    private cleanupInterval: NodeJS.Timeout | null = null;
    private readonly CLEANUP_INTERVAL_MS = 60 * 60 * 1000; // Cleanup every hour

    constructor() {
        // Start automatic cleanup
        this.startCleanup();
    }

    /**
     * Check if a request from an IP is allowed
     */
    check(identifier: string, config: RateLimitConfig): RateLimitResult {
        const now = Date.now();
        const windowStart = now - config.windowMs;

        // Get or create request log for this identifier
        let log = this.requests.get(identifier);
        if (!log) {
            log = { timestamps: [], lastCleanup: now };
            this.requests.set(identifier, log);
        }

        // Remove timestamps outside the current window (sliding window)
        log.timestamps = log.timestamps.filter((timestamp) => timestamp > windowStart);

        // Check if limit is exceeded
        const requestCount = log.timestamps.length;
        const allowed = requestCount < config.maxRequests;

        if (allowed) {
            // Add current request timestamp
            log.timestamps.push(now);
        }

        // Calculate remaining requests
        const remaining = Math.max(0, config.maxRequests - (requestCount + (allowed ? 1 : 0)));

        // Calculate reset time (end of current window)
        const oldestTimestamp = log.timestamps[0] || now;
        const resetTime = oldestTimestamp + config.windowMs;

        log.lastCleanup = now;

        return {
            allowed,
            limit: config.maxRequests,
            remaining,
            resetTime,
        };
    }

    /**
     * Reset rate limit for a specific identifier
     * Useful for testing or manual overrides
     */
    reset(identifier: string): void {
        this.requests.delete(identifier);
    }

    /**
     * Clear all rate limit data
     */
    resetAll(): void {
        this.requests.clear();
    }

    /**
     * Start automatic cleanup of old entries
     */
    private startCleanup(): void {
        this.cleanupInterval = setInterval(() => {
            this.cleanup();
        }, this.CLEANUP_INTERVAL_MS);
    }

    /**
     * Clean up old entries to prevent memory leaks
     * Removes entries that haven't been accessed in the last hour
     */
    private cleanup(): void {
        const now = Date.now();
        const staleThreshold = now - this.CLEANUP_INTERVAL_MS;

        for (const [identifier, log] of this.requests.entries()) {
            if (log.lastCleanup < staleThreshold) {
                this.requests.delete(identifier);
            }
        }

        console.log(`[RateLimiter] Cleanup completed. Active IPs: ${this.requests.size}`);
    }

    /**
     * Stop the cleanup interval (call when shutting down)
     */
    destroy(): void {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
            this.cleanupInterval = null;
        }
    }

    /**
     * Get statistics about current rate limiting state
     */
    getStats(): { activeIdentifiers: number; totalRequests: number } {
        let totalRequests = 0;
        for (const log of this.requests.values()) {
            totalRequests += log.timestamps.length;
        }

        return {
            activeIdentifiers: this.requests.size,
            totalRequests,
        };
    }
}

/**
 * Rate limit configurations for different endpoints
 */
export const RATE_LIMITS = {
    // Stricter limit for write operations
    shorten: {
        windowMs: 60 * 1000, // 1 minute
        maxRequests: 5, // 5 requests per minute
    },
    // Standard limit for read operations
    stats: {
        windowMs: 60 * 1000, // 1 minute
        maxRequests: 10, // 10 requests per minute
    },
    // Standard limit for update operations
    click: {
        windowMs: 60 * 1000, // 1 minute
        maxRequests: 10, // 10 requests per minute
    },
} as const;

// Global rate limiter instance
// For serverless environments, this will be per-instance
export const rateLimiter = new RateLimiter();
