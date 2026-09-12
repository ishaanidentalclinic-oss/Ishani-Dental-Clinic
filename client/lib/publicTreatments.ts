import type { PublicTreatment } from "@/types/treatment";
import { API_BASE_URL } from "./apiBaseUrl";

/**
 * Public, unauthenticated reads of the Treatment CMS — published treatments
 * only. Used to hydrate the Treatments page, homepage cards, the shared
 * treatment modal, and individual treatment pages. Failures resolve to an
 * empty result rather than throwing, so a cold/offline API degrades to an
 * empty section instead of crashing the page.
 */
export async function fetchPublicTreatments(): Promise<PublicTreatment[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/treatments`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return [];
    const json = await res.json().catch(() => null);
    return (json?.data as PublicTreatment[]) ?? [];
  } catch {
    return [];
  }
}

export async function fetchPublicTreatmentBySlug(slug: string): Promise<PublicTreatment | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/treatments/${slug}`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const json = await res.json().catch(() => null);
    return (json?.data as PublicTreatment) ?? null;
  } catch {
    return null;
  }
}
