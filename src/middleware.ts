import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js Middleware for API Route Protection
 * 
 * This middleware adds security with flexibility:
 * 1. API Key bypass - for server-to-server & testing (curl/Postman)
 * 2. AJAX header check - for browser security
 * 3. Origin validation - prevents cross-origin attacks
 */

const API_ROUTES = ['/api/shorten', '/api/click', '/api/stats'];

// Custom header that must be present in browser API requests
const REQUIRED_HEADER = 'x-requested-with';
const REQUIRED_HEADER_VALUE = 'XMLHttpRequest';

/**
 * Check if request is from allowed origin
 */
function isAllowedOrigin(request: NextRequest): boolean {
    const origin = request.headers.get('origin');
    const host = request.headers.get('host');

    // Allow same-origin requests
    if (origin) {
        const originUrl = new URL(origin);
        return originUrl.host === host;
    }

    // If no origin header, check referer
    const referer = request.headers.get('referer');
    if (referer) {
        const refererUrl = new URL(referer);
        return refererUrl.host === host;
    }

    // Block if neither origin nor referer is present (direct browser access)
    return false;
}

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check if this is an API route
    const isApiRoute = API_ROUTES.some((route) => pathname.startsWith(route));

    if (isApiRoute) {
        // ============================================
        // 1. API KEY BYPASS (for server-to-server & testing)
        // ============================================
        const apiKey = request.headers.get('x-api-key');
        const internalApiKey = process.env.INTERNAL_API_KEY;

        if (apiKey && internalApiKey && apiKey === internalApiKey) {
            // Valid API key - bypass all other checks
            const response = NextResponse.next();

            // Add security headers even for API key requests
            response.headers.set('X-Content-Type-Options', 'nosniff');
            response.headers.set('X-Frame-Options', 'DENY');
            response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');

            return response;
        }

        // ============================================
        // 2. AJAX HEADER CHECK (for browser security)
        // ============================================
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
                    }
                }
            );
        }

        // ============================================
        // 3. ORIGIN VALIDATION (prevent cross-site attacks)
        // ============================================
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
                    }
                }
            );
        }

        // Create response with security headers
        const response = NextResponse.next();

        // Add CORS headers - only allow same origin
        const origin = request.headers.get('origin');
        if (origin) {
            response.headers.set('Access-Control-Allow-Origin', origin);
            response.headers.set('Access-Control-Allow-Credentials', 'true');
        }

        // Add security headers
        response.headers.set('X-Content-Type-Options', 'nosniff');
        response.headers.set('X-Frame-Options', 'DENY');
        response.headers.set('X-XSS-Protection', '1; mode=block');
        response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

        // Prevent caching of API responses
        response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');

        return response;
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/api/:path*',
    ],
};
