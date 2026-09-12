"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { StaggerGroup, StaggerItem } from "@/components/ui/StaggerGroup";
import { BlogCard } from "@/components/shared/BlogCard";
import type { PublicBlog } from "@/types/blog";

export function BlogsGrid({ blogs }: { blogs: PublicBlog[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return blogs;
    return blogs.filter(
      (post) =>
        post.title.toLowerCase().includes(normalized) ||
        post.excerpt.toLowerCase().includes(normalized) ||
        post.category.toLowerCase().includes(normalized),
    );
  }, [blogs, query]);

  return (
    <div>
      <div className="mx-auto max-w-md">
        <div className="relative">
          <Search
            size={18}
            className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-ink-700"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search articles..."
            aria-label="Search articles"
            className="w-full rounded-pill border border-black/10 bg-white py-3 pr-4 pl-11 text-sm text-ink-900 placeholder:text-ink-700/50 focus:border-primary-600 focus:ring-2 focus:ring-primary-600/20 focus:outline-none"
          />
        </div>
      </div>

      {filtered.length > 0 ? (
        <StaggerGroup className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post) => (
            <StaggerItem key={post._id} className="h-full">
              <BlogCard post={post} />
            </StaggerItem>
          ))}
        </StaggerGroup>
      ) : (
        <p className="mt-12 text-center text-ink-700">
          No articles found for &ldquo;{query}&rdquo;.
        </p>
      )}
    </div>
  );
}
