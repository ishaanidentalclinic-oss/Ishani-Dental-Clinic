"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Star } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { BlogSectionsEditor } from "@/components/admin/BlogSectionsEditor";
import { BlogPreviewModal } from "@/components/admin/BlogPreviewModal";
import { DropdownWithOther } from "@/components/admin/DropdownWithOther";
import { MEDIA_FOLDER } from "@/lib/adminMedia";
import { createBlog, updateBlog, type BlogPayload } from "@/lib/adminBlogs";
import { ApiError } from "@/lib/adminApi";
import type { AdminBlog, BlogSection } from "@/types/admin";

interface BlogFormProps {
  blog?: AdminBlog;
}

const BLOG_CATEGORY_OPTIONS = [
  "Treatment",
  "Oral Health",
  "Cosmetic",
  "Orthodontics",
  "Pediatric",
  "Nutrition",
  "Patient Guide",
];

const BLOG_AUTHOR_OPTIONS = [
  "Dr. Raghavendra S Medikeri",
  "Dr. Manjushri W",
  "Ishaani Dental Team",
];

function toFormState(blog?: AdminBlog) {
  return {
    title: blog?.title ?? "",
    slug: blog?.slug ?? "",
    excerpt: blog?.excerpt ?? "",
    coverImage: blog?.coverImage ?? "",
    category: blog?.category ?? "",
    author: blog?.author ?? "",
    readTime: blog?.readTime ?? "",
    sections: blog?.sections?.length ? blog.sections : ([] as BlogSection[]),
    featured: blog?.featured ?? false,
    metaTitle: blog?.seo?.metaTitle ?? "",
    metaDescription: blog?.seo?.metaDescription ?? "",
  };
}

export function BlogForm({ blog }: BlogFormProps) {
  const router = useRouter();
  const isEditing = Boolean(blog);

  const [form, setForm] = useState(toFormState(blog));
  const [isSaving, setIsSaving] = useState<"draft" | "published" | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  function patch(fields: Partial<typeof form>) {
    setForm((current) => ({ ...current, ...fields }));
  }

  function buildPayload(status: "draft" | "published"): BlogPayload {
    return {
      title: form.title.trim(),
      slug: form.slug.trim() || undefined,
      excerpt: form.excerpt.trim(),
      coverImage: form.coverImage,
      category: form.category.trim(),
      author: form.author.trim(),
      readTime: form.readTime.trim(),
      sections: form.sections,
      featured: form.featured,
      status,
      seo: {
        metaTitle: form.metaTitle.trim(),
        metaDescription: form.metaDescription.trim(),
      },
    };
  }

  async function handleSave(status: "draft" | "published") {
    if (!form.title.trim() || !form.excerpt.trim() || !form.category.trim() || !form.author.trim()) {
      toast.error("Please fill in title, excerpt, category, and author before saving.");
      return;
    }

    setIsSaving(status);
    try {
      const payload = buildPayload(status);
      if (isEditing && blog) {
        await updateBlog(blog._id, payload);
        toast.success(status === "published" ? "Blog published" : "Blog saved as draft");
      } else {
        await createBlog(payload);
        toast.success(status === "published" ? "Blog published" : "Blog saved as draft");
      }
      router.push("/admin/blog");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to save blog");
    } finally {
      setIsSaving(null);
    }
  }

  return (
    <div className="space-y-6">
      <Card className="space-y-5 p-5 sm:p-6">
        <h2 className="text-sm font-semibold tracking-wide text-ink-700 uppercase">
          Post details
        </h2>

        <FormField label="Title" htmlFor="title">
          <Input
            id="title"
            value={form.title}
            onChange={(event) => patch({ title: event.target.value })}
            placeholder="e.g. Invisalign vs Braces: Which Is Right for You?"
          />
        </FormField>

        <FormField label="Slug (optional — auto-generated from title if left blank)" htmlFor="slug">
          <Input
            id="slug"
            value={form.slug}
            onChange={(event) => patch({ slug: event.target.value })}
            placeholder="invisalign-vs-braces"
          />
        </FormField>

        <FormField label="Excerpt" htmlFor="excerpt">
          <Textarea
            id="excerpt"
            rows={3}
            value={form.excerpt}
            onChange={(event) => patch({ excerpt: event.target.value })}
            placeholder="A short summary shown in blog listing cards..."
          />
        </FormField>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <FormField label="Category" htmlFor="category">
            <DropdownWithOther
              id="category"
              value={form.category}
              options={BLOG_CATEGORY_OPTIONS}
              onChange={(category) => patch({ category })}
              placeholder="Select a category"
              otherPlaceholder="e.g. Patient Guide"
            />
          </FormField>
          <FormField label="Author" htmlFor="author">
            <DropdownWithOther
              id="author"
              value={form.author}
              options={BLOG_AUTHOR_OPTIONS}
              onChange={(author) => patch({ author })}
              placeholder="Select an author"
              otherPlaceholder="e.g. Dr. Jane Doe"
            />
          </FormField>
          <FormField label="Read time" htmlFor="readTime">
            <Input
              id="readTime"
              value={form.readTime}
              onChange={(event) => patch({ readTime: event.target.value })}
              placeholder="5 min read"
            />
          </FormField>
        </div>

        <ImageUploader
          value={form.coverImage}
          onChange={(url) => patch({ coverImage: url })}
          folder={MEDIA_FOLDER.BLOGS}
          label="Cover image"
        />

        <label className="flex cursor-pointer items-center gap-2 text-sm text-ink-900">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(event) => patch({ featured: event.target.checked })}
            className="h-4 w-4 rounded border-black/20 text-primary-700 focus:ring-primary-600/30"
          />
          <Star size={14} className="text-amber-500" />
          Feature this post
        </label>
      </Card>

      <Card className="space-y-4 p-5 sm:p-6">
        <h2 className="text-sm font-semibold tracking-wide text-ink-700 uppercase">
          Content sections
        </h2>
        <BlogSectionsEditor
          sections={form.sections}
          onChange={(sections) => patch({ sections })}
        />
      </Card>

      <Card className="space-y-4 p-5 sm:p-6">
        <h2 className="text-sm font-semibold tracking-wide text-ink-700 uppercase">SEO</h2>
        <FormField label="Meta title" htmlFor="metaTitle">
          <Input
            id="metaTitle"
            value={form.metaTitle}
            onChange={(event) => patch({ metaTitle: event.target.value })}
            maxLength={70}
            placeholder="Shown as the page title in search results"
          />
        </FormField>
        <FormField label="Meta description" htmlFor="metaDescription">
          <Textarea
            id="metaDescription"
            rows={2}
            value={form.metaDescription}
            onChange={(event) => patch({ metaDescription: event.target.value })}
            maxLength={160}
            placeholder="Shown as the page description in search results"
          />
        </FormField>
      </Card>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={() => setShowPreview(true)}>
          Preview
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={isSaving !== null}
          onClick={() => handleSave("draft")}
        >
          {isSaving === "draft" ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Saving…
            </>
          ) : (
            "Save as Draft"
          )}
        </Button>
        <Button type="button" disabled={isSaving !== null} onClick={() => handleSave("published")}>
          {isSaving === "published" ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Publishing…
            </>
          ) : (
            "Publish"
          )}
        </Button>
      </div>

      <BlogPreviewModal
        open={showPreview}
        onClose={() => setShowPreview(false)}
        blog={{
          title: form.title,
          category: form.category,
          author: form.author,
          readTime: form.readTime,
          coverImage: form.coverImage,
          sections: form.sections,
        }}
      />
    </div>
  );
}
