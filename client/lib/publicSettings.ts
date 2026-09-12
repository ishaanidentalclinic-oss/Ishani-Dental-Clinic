import type { SiteSettings } from "@/types/admin";
import { API_BASE_URL } from "./apiBaseUrl";

/**
 * Public, unauthenticated read of the site settings singleton. Used to hydrate
 * live contact/footer content on the public site, with callers falling back
 * to the static SITE constants if this fails (offline API, cold start, etc.).
 */
export async function fetchPublicSiteSettings(): Promise<SiteSettings | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/settings`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const json = await res.json().catch(() => null);
    return (json?.data as SiteSettings) ?? null;
  } catch {
    return null;
  }
}
