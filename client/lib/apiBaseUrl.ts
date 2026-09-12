/**
 * Single source of truth for the API base URL.
 * - In Next.js route handlers (server-side) → relative /api path works fine
 * - In browser (client components) → same relative /api path works since
 *   everything is now served from the same Next.js origin, no CORS needed.
 * - NEXT_PUBLIC_API_URL can still override for local dev pointing at a
 *   separate server, but the default now points at the built-in API routes.
 */
function getApiBaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (typeof window !== "undefined") {
    return envUrl || "/api";
  }

  if (envUrl && envUrl.startsWith("http")) {
    return envUrl;
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

  return `${siteUrl.replace(/\/$/, "")}/api`;
}

export const API_BASE_URL = getApiBaseUrl();

