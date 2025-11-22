import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { rateLimiter, RATE_LIMITS, type RateLimitConfig } from '@/lib/rate-limiter';

const API_ROUTES = ['/api/shorten', '/api/click', '/api/stats'];

const REQUIRED_HEADER = 'x-requested-with';
const REQUIRED_HEADER_VALUE = 'XMLHttpRequest';

function getClientIp(request: NextRequest): string {
    const forwardedFor = request.headers.get('x-forwarded-for');
    if (forwardedFor) {
        return forwardedFor.split(',')[0].trim();
    }

    const realIp = request.headers.get('x-real-ip');
    if (realIp) {
        return realIp.trim();
    }

    const cfIp = request.headers.get('cf-connecting-ip');
    if (cfIp) {
        return cfIp.trim();
    }

    return 'unknown';
}

/**
 * Get rate limit config for a specific API route
 */
function getRateLimitConfig(pathname: string): RateLimitConfig {
    if (pathname.startsWith('/api/shorten')) {
        return RATE_LIMITS.shorten;
    }
    if (pathname.startsWith('/api/stats')) {
        return RATE_LIMITS.stats;
    }
    if (pathname.startsWith('/api/click')) {
        return RATE_LIMITS.click;
    }
    return RATE_LIMITS.stats;
}

/**
 * Check if request is from allowed origin
 */
function isAllowedOrigin(request: NextRequest): boolean {
    const origin = request.headers.get('origin');
    const host = request.headers.get('host');

    if (origin) {
        const originUrl = new URL(origin);
        return originUrl.host === host;
    }

    const referer = request.headers.get('referer');
    if (referer) {
        const refererUrl = new URL(referer);
        return refererUrl.host === host;
    }

    return false;
}

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const isApiRoute = API_ROUTES.some((route) => pathname.startsWith(route));

    if (isApiRoute) {
        //RATE LIMITING (applies to ALL requests including API key)
        const clientIp = getClientIp(request);
        const rateLimitConfig = getRateLimitConfig(pathname);
        const rateLimitResult = rateLimiter.check(clientIp, rateLimitConfig);

        if (!rateLimitResult.allowed) {
            console.warn(`[RateLimit] IP ${clientIp} exceeded limit for ${pathname}`, {
                limit: rateLimitResult.limit,
                resetTime: new Date(rateLimitResult.resetTime).toISOString(),
            });
        }

        //API KEY BYPASS (for server-to-server & testing)
        const apiKey = request.headers.get('x-api-key');
        const internalApiKey = process.env.INTERNAL_API_KEY;

        if (apiKey && internalApiKey && apiKey === internalApiKey) {
            if (!rateLimitResult.allowed) {
                return NextResponse.json(
                    {
                        error: 'Too Many Requests',
                        message: `Rate limit exceeded. Try again in ${Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)} seconds.`,
                        retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000),
                    },
                    {
                        status: 429,
                        headers: {
                            'Content-Type': 'application/json',
                            'X-RateLimit-Limit': rateLimitResult.limit.toString(),
                            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
                            'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
                            'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString(),
                        }
                    }
                );
            }

            const response = NextResponse.next();

            response.headers.set('X-Content-Type-Options', 'nosniff');
            response.headers.set('X-Frame-Options', 'DENY');
            response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
            response.headers.set('X-RateLimit-Limit', rateLimitResult.limit.toString());
            response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
            response.headers.set('X-RateLimit-Reset', rateLimitResult.resetTime.toString());

            return response;
        }

        //RATE LIMIT CHECK (before other validations)
        if (!rateLimitResult.allowed) {
            return NextResponse.json(
                {
                    error: 'Too Many Requests',
                    message: `Rate limit exceeded. Try again in ${Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)} seconds.`,
                    retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000),
                },
                {
                    status: 429,
                    headers: {
                        'Content-Type': 'application/json',
                        'X-RateLimit-Limit': rateLimitResult.limit.toString(),
                        'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
                        'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
                        'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString(),
                    }
                }
            );
        }

        //AJAX HEADER CHECK (for browser security)
        const customHeader = request.headers.get(REQUIRED_HEADER);
        if (customHeader !== REQUIRED_HEADER_VALUE) {
            return NextResponse.json(
                {
                    error: 'Forbidden',
                    message: 'Direct API access is not allowed. Use the application interface or provide a valid API key.'
                },
                {
                    status: 403,
                    headers: {
                        'Content-Type': 'application/json',
                        'X-RateLimit-Limit': rateLimitResult.limit.toString(),
                        'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
                        'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
                    }
                }
            );
        }

        //ORIGIN VALIDATION (prevent cross-site attacks)
        if (!isAllowedOrigin(request)) {
            return NextResponse.json(
                {
                    error: 'Forbidden',
                    message: 'Invalid origin. Cross-origin requests are not allowed.'
                },
                {
                    status: 403,
                    headers: {
                        'Content-Type': 'application/json',
                        'X-RateLimit-Limit': rateLimitResult.limit.toString(),
                        'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
                        'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
                    }
                }
            );
        }


        const response = NextResponse.next();

        const origin = request.headers.get('origin');
        if (origin) {
            response.headers.set('Access-Control-Allow-Origin', origin);
            response.headers.set('Access-Control-Allow-Credentials', 'true');
        }

        response.headers.set('X-Content-Type-Options', 'nosniff');
        response.headers.set('X-Frame-Options', 'DENY');
        response.headers.set('X-XSS-Protection', '1; mode=block');
        response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

        response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');

        response.headers.set('X-RateLimit-Limit', rateLimitResult.limit.toString());
        response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
        response.headers.set('X-RateLimit-Reset', rateLimitResult.resetTime.toString());

        return response;
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/api/:path*',
    ],
};
