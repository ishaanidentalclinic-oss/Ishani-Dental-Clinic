import type { PublicBlog } from "@/types/blog";
import { API_BASE_URL } from "./apiBaseUrl";

/**
 * Public, unauthenticated reads of the Blog CMS — published posts only.
 * Used to hydrate the Blogs page, homepage marquee, and individual article
 * pages. Failures resolve to an empty result rather than throwing, so a
 * cold/offline API degrades to an empty section instead of crashing the page.
 */
export async function fetchPublicBlogs(): Promise<PublicBlog[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/blogs`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return [];
    const json = await res.json().catch(() => null);
    return (json?.data as PublicBlog[]) ?? [];
  } catch {
    return [];
  }
}

export async function fetchPublicBlogBySlug(slug: string): Promise<PublicBlog | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/blogs/${slug}`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const json = await res.json().catch(() => null);
    return (json?.data as PublicBlog) ?? null;
  } catch {
    return null;
  }
}
