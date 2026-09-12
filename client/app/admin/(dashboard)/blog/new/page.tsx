"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BlogForm } from "@/components/admin/BlogForm";

export default function NewBlogPostPage() {
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
        <h1 className="text-2xl font-semibold text-ink-900">New Post</h1>
        <p className="text-sm text-ink-700">Write and publish a new blog article.</p>
      </div>

      <div className="mt-6">
        <BlogForm />
      </div>
    </div>
  );
}
