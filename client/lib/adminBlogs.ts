import { apiFetch } from "@/lib/adminApi";
import type { AdminBlog, BlogSection, PaginationMeta } from "@/types/admin";
import type { BlogStatus } from "@/constants/adminBlogStatus";

export interface ListBlogsParams {
  page?: number;
  limit?: number;
  sort?: "newest" | "oldest";
  status?: BlogStatus;
  category?: string;
  featured?: boolean;
  search?: string;
}

export interface BlogPayload {
  title: string;
  slug?: string;
  excerpt: string;
  coverImage: string;
  category: string;
  author: string;
  readTime: string;
  sections: BlogSection[];
  status: BlogStatus;
  featured: boolean;
  seo: {
    metaTitle: string;
    metaDescription: string;
  };
}

function buildQuery(params: ListBlogsParams) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") query.set(key, String(value));
  });
  const qs = query.toString();
  return qs ? `?${qs}` : "";
}

export async function listBlogs(params: ListBlogsParams) {
  return apiFetch<{ blogs: AdminBlog[]; meta: PaginationMeta }>(
    `/blogs/admin/list${buildQuery(params)}`,
  );
}

export async function getBlog(id: string) {
  return apiFetch<AdminBlog>(`/blogs/admin/${id}`);
}

export async function createBlog(payload: BlogPayload) {
  return apiFetch<AdminBlog>(`/blogs/admin`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateBlog(id: string, payload: Partial<BlogPayload>) {
  return apiFetch<AdminBlog>(`/blogs/admin/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function deleteBlog(id: string) {
  return apiFetch<null>(`/blogs/admin/${id}`, { method: "DELETE" });
}
