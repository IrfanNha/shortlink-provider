/**
 * API Proxy Protection
 * 
 * This module provides security for API requests to prevent direct browser access
 * to external APIs (MockAPI). Only server-side requests are allowed.
 */

const ALLOWED_ROUTES = [
    '/api/shorten',
    '/api/click',
    '/api/stats',
] as const;

type AllowedRoute = typeof ALLOWED_ROUTES[number];

/**
 * Get the internal API secret used for server-side authentication
 */
function getInternalApiSecret(): string {
    const secret = process.env.INTERNAL_API_SECRET;
    if (!secret) {
        throw new Error(
            'INTERNAL_API_SECRET is not set. Please add it to your .env.local file.'
        );
    }
    return secret;
}

/**
 * Validates that the request is coming from an allowed server-side route
 * @param route - The route path making the request
 * @returns true if the route is allowed
 */
export function isAllowedRoute(route: string): boolean {
    return ALLOWED_ROUTES.includes(route as AllowedRoute);
}

/**
 * Validates that the request has proper proxy access credentials
 * This should be called by API routes to ensure they're being called server-side
 * @param request - The incoming request object
 * @returns true if the request is valid
 */
export function validateProxyAccess(request: Request): boolean {
    try {
        const apiSecret = request.headers.get('x-internal-api-secret');
        const internalSecret = getInternalApiSecret();

        return apiSecret === internalSecret;
    } catch {
        return false;
    }
}

/**
 * Creates headers for server-side proxy requests to external APIs
 * Adds the internal API secret for authentication
 * @param additionalHeaders - Additional headers to include in the request
 * @returns Headers object with proxy authentication
 */
export function createProxyHeaders(
    additionalHeaders?: HeadersInit
): Headers {
    const headers = new Headers(additionalHeaders);

    // Add internal API secret for server-side authentication
    headers.set('x-internal-api-secret', getInternalApiSecret());

    return headers;
}

/**
 * Validates if the current environment is server-side
 * @returns true if running on server
 */
export function isServerSide(): boolean {
    return typeof window === 'undefined';
}

/**
 * Ensures that a function can only be executed server-side
 * Throws an error if called from client-side
 */
export function ensureServerSide(functionName: string): void {
    if (!isServerSide()) {
        throw new Error(
            `${functionName} can only be called from server-side. Direct API access from browser is not allowed.`
        );
    }
}

/**
 * Creates a standardized error response for unauthorized access
 */
export function createUnauthorizedResponse(): Response {
    return new Response(
        JSON.stringify({
            error: 'Unauthorized',
            message: 'Direct API access is not allowed. Please use the provided API routes.',
        }),
        {
            status: 401,
            headers: {
                'Content-Type': 'application/json',
            },
        }
    );
}

/**
 * Creates a standardized error response for forbidden routes
 */
export function createForbiddenResponse(route: string): Response {
    return new Response(
        JSON.stringify({
            error: 'Forbidden',
            message: `Access to route ${route} is not allowed.`,
        }),
        {
            status: 403,
            headers: {
                'Content-Type': 'application/json',
            },
        }
    );
}
