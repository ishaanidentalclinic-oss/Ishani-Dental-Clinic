"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/Card";
import { BlogForm } from "@/components/admin/BlogForm";
import { getBlog } from "@/lib/adminBlogs";
import { ApiError } from "@/lib/adminApi";
import type { AdminBlog } from "@/types/admin";

export default function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const [blog, setBlog] = useState<AdminBlog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let ignore = false;

    getBlog(id)
      .then((data) => {
        if (ignore) return;
        setBlog(data);
      })
      .catch((err) => {
        if (ignore) return;
        setNotFound(true);
        toast.error(err instanceof ApiError ? err.message : "Failed to load blog post");
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [id]);

  return (
    <div>
      <Link
        href="/admin/blog"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-700 hover:text-primary-800"
      >
        <ArrowLeft size={16} />
        Back to Blog
      </Link>

      <div className="mt-3">
        <h1 className="text-2xl font-semibold text-ink-900">Edit Post</h1>
        <p className="text-sm text-ink-700">Update this article&apos;s content and settings.</p>
      </div>

      <div className="mt-6">
        {isLoading ? (
          <Card className="space-y-3 p-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-10 animate-pulse rounded-lg bg-black/[0.04]" />
            ))}
          </Card>
        ) : notFound || !blog ? (
          <Card className="p-6 text-sm text-ink-700">This blog post could not be found.</Card>
        ) : (
          <BlogForm blog={blog} />
        )}
      </div>
    </div>
  );
}
