// Note: MOCKAPI_URL is intentionally NOT exported here
// to prevent exposure to the browser. Use server-side API routes instead.

export const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
