"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FileText, Plus, Search, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { listBlogs, deleteBlog } from "@/lib/adminBlogs";
import { ApiError } from "@/lib/adminApi";
import { BLOG_STATUS_VALUES, type BlogStatus } from "@/constants/adminBlogStatus";
import type { AdminBlog, PaginationMeta } from "@/types/admin";

const PAGE_SIZE = 10;

const STATUS_CLASSES: Record<BlogStatus, string> = {
  draft: "bg-amber-50 text-amber-700",
  published: "bg-primary-50 text-primary-700",
};

export default function AdminBlogListPage() {
  const { admin } = useAdminAuth();
  const canDelete = admin?.role === "super_admin";

  const [blogs, setBlogs] = useState<AdminBlog[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);

  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<"newest" | "oldest">("newest");
  const [statusFilter, setStatusFilter] = useState<BlogStatus | "">("");
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebouncedValue(searchInput);

  const [deleteTarget, setDeleteTarget] = useState<AdminBlog | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);

  function updateSort(value: "newest" | "oldest") {
    setSort(value);
    setPage(1);
  }
  function updateStatusFilter(value: BlogStatus | "") {
    setStatusFilter(value);
    setPage(1);
  }
  function updateSearchInput(value: string) {
    setSearchInput(value);
    setPage(1);
  }

  const currentQueryKey = JSON.stringify({ page, sort, statusFilter, debouncedSearch, reloadToken });
  const [resolvedQueryKey, setResolvedQueryKey] = useState<string | null>(null);
  const isLoading = resolvedQueryKey !== currentQueryKey;

  useEffect(() => {
    let ignore = false;

    listBlogs({
      page,
      limit: PAGE_SIZE,
      sort,
      status: statusFilter || undefined,
      search: debouncedSearch || undefined,
    })
      .then((data) => {
        if (ignore) return;
        setBlogs(data.blogs);
        setMeta(data.meta);
      })
      .catch((err) => {
        if (ignore) return;
        toast.error(err instanceof ApiError ? err.message : "Failed to load blogs");
      })
      .finally(() => {
        if (!ignore) setResolvedQueryKey(currentQueryKey);
      });

    return () => {
      ignore = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- currentQueryKey is derived from the same deps listed here
  }, [page, sort, statusFilter, debouncedSearch, reloadToken]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteBlog(deleteTarget._id);
      toast.success("Blog deleted");
      setDeleteTarget(null);
      if (blogs.length === 1 && page > 1) {
        setPage((p) => p - 1);
      } else {
        setReloadToken((t) => t + 1);
      }
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to delete blog");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink-900">Blog</h1>
          <p className="text-sm text-ink-700">Create, edit, and publish articles.</p>
        </div>
        <Button href="/admin/blog/new" className="w-fit">
          <Plus size={16} />
          New Post
        </Button>
      </div>

      <Card className="mt-6 flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={16} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-ink-700/50" />
          <input
            type="search"
            value={searchInput}
            onChange={(event) => updateSearchInput(event.target.value)}
            placeholder="Search by title, excerpt, or category..."
            className="w-full rounded-lg border border-black/10 bg-white py-2.5 pr-4 pl-10 text-sm text-ink-900 placeholder:text-ink-700/50 focus:border-primary-600 focus:ring-2 focus:ring-primary-600/20 focus:outline-none"
          />
        </div>

        <Select
          value={statusFilter}
          onChange={(event) => updateStatusFilter(event.target.value as BlogStatus | "")}
          className="sm:w-44"
        >
          <option value="">All statuses</option>
          {BLOG_STATUS_VALUES.map((status) => (
            <option key={status} value={status}>
              {status === "draft" ? "Draft" : "Published"}
            </option>
          ))}
        </Select>

        <Select
          value={sort}
          onChange={(event) => updateSort(event.target.value as "newest" | "oldest")}
          className="sm:w-40"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </Select>
      </Card>

      <Card className="mt-4 overflow-hidden p-0">
        {isLoading ? (
          <div className="space-y-3 p-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-14 animate-pulse rounded-lg bg-black/[0.04]" />
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
            <FileText size={28} className="text-ink-700/40" />
            <p className="text-sm text-ink-700">No blog posts match your filters.</p>
          </div>
        ) : (
          <>
            {/* Mobile card list */}
            <div className="divide-y divide-black/5 sm:hidden">
              {blogs.map((blog, index) => (
                <motion.div
                  key={blog._id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: index * 0.03 }}
                  className="p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        {blog.featured && <Star size={14} className="shrink-0 text-amber-500" />}
                        <p className="font-medium text-ink-900">{blog.title}</p>
                      </div>
                      <p className="text-xs text-ink-700">/{blog.slug}</p>
                    </div>
                    <span
                      className={`inline-flex shrink-0 items-center rounded-pill px-3 py-1 text-xs font-medium ${STATUS_CLASSES[blog.status]}`}
                    >
                      {blog.status === "draft" ? "Draft" : "Published"}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge tone="neutral">{blog.category}</Badge>
                    <p className="text-xs text-ink-700">
                      Updated{" "}
                      {new Date(blog.updatedAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="mt-3 flex items-center gap-1">
                    <Link
                      href={`/admin/blog/${blog._id}`}
                      className="flex h-10 items-center rounded-full px-3.5 text-xs font-medium text-primary-700 hover:bg-primary-50"
                    >
                      Edit
                    </Link>
                    {canDelete && (
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(blog)}
                        aria-label="Delete blog post"
                        title="Delete"
                        className="flex h-10 w-10 items-center justify-center rounded-full text-red-600 hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Desktop table */}
            <div className="hidden overflow-x-auto sm:block">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead>
                  <tr className="border-b border-black/5 text-xs font-semibold tracking-wide text-ink-700 uppercase">
                    <th className="px-5 py-3">Title</th>
                    <th className="px-5 py-3">Category</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Updated</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {blogs.map((blog, index) => (
                    <motion.tr
                      key={blog._id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, delay: index * 0.03 }}
                      className="border-b border-black/5 last:border-0 hover:bg-sage-50/60"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          {blog.featured && <Star size={14} className="shrink-0 text-amber-500" />}
                          <p className="font-medium text-ink-900">{blog.title}</p>
                        </div>
                        <p className="text-xs text-ink-700">/{blog.slug}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge tone="neutral">{blog.category}</Badge>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center rounded-pill px-3 py-1 text-xs font-medium ${STATUS_CLASSES[blog.status]}`}
                        >
                          {blog.status === "draft" ? "Draft" : "Published"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-ink-700">
                        {new Date(blog.updatedAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/admin/blog/${blog._id}`}
                            className="rounded-full px-3.5 py-1.5 text-xs font-medium text-primary-700 hover:bg-primary-50"
                          >
                            Edit
                          </Link>
                          {canDelete && (
                            <button
                              type="button"
                              onClick={() => setDeleteTarget(blog)}
                              aria-label="Delete blog post"
                              title="Delete"
                              className="flex h-8 w-8 items-center justify-center rounded-full text-red-600 hover:bg-red-50"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </Card>

      {meta && meta.totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm text-ink-700">
          <p>
            Page {meta.currentPage} of {meta.totalPages} · {meta.totalRecords} total
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-full border border-black/10 px-4 py-1.5 font-medium text-ink-900 transition-colors hover:border-primary-300 disabled:pointer-events-none disabled:opacity-40"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={page >= meta.totalPages}
              onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
              className="rounded-full border border-black/10 px-4 py-1.5 font-medium text-ink-900 transition-colors hover:border-primary-300 disabled:pointer-events-none disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete this blog post?"
        description={`This will permanently delete "${deleteTarget?.title ?? "this post"}". This cannot be undone.`}
        confirmLabel="Delete"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
