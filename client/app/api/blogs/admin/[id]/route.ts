import { NextRequest } from "next/server";
import { connectDB } from "@/lib/server/db";
import { Blog } from "@/lib/server/models";
import { ok, withErrorHandler, requireAuth, parseBody, ADMIN_ROLES } from "@/lib/server/response";
import { AppError, slugify } from "@/lib/server/utils";
import { ADMIN_ROLE, BLOG_STATUS, HTTP_STATUS } from "@/lib/server/constants";
import mongoose from "mongoose";

function assertValidObjectId(id: string) {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new AppError("Invalid ID", HTTP_STATUS.BAD_REQUEST);
}

// GET /api/blogs/admin/[id]
export const GET = withErrorHandler(async (req: NextRequest, ctx) => {
  await connectDB();
  requireAuth(req, ADMIN_ROLES);
  const { id } = await ctx.params;
  assertValidObjectId(id);

  const blog = await Blog.findById(id).lean();
  if (!blog) throw new AppError("Blog not found", HTTP_STATUS.NOT_FOUND);
  return ok(blog, "Blog retrieved successfully");
});

// PATCH /api/blogs/admin/[id]
export const PATCH = withErrorHandler(async (req: NextRequest, ctx) => {
  await connectDB();
  requireAuth(req, ADMIN_ROLES);
  const { id } = await ctx.params;
  assertValidObjectId(id);

  const updates = (await parseBody(req)) as Record<string, unknown>;

  if (updates.slug) {
    const nextSlug = slugify(String(updates.slug));
    const existing = await Blog.findOne({ slug: nextSlug, _id: { $ne: id } });
    if (existing) throw new AppError("That slug is already in use", HTTP_STATUS.CONFLICT);
    updates.slug = nextSlug;
  }

  if (updates.status === BLOG_STATUS.PUBLISHED) {
    const current = await Blog.findById(id).lean();
    if (current && (current as any).status !== BLOG_STATUS.PUBLISHED) {
      updates.publishedAt = new Date();
    }
  }

  const blog = await Blog.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
  if (!blog) throw new AppError("Blog not found", HTTP_STATUS.NOT_FOUND);
  return ok(blog, "Blog updated successfully");
});

// DELETE /api/blogs/admin/[id]
export const DELETE = withErrorHandler(async (req: NextRequest, ctx) => {
  await connectDB();
  requireAuth(req, [ADMIN_ROLE.SUPER_ADMIN]);
  const { id } = await ctx.params;
  assertValidObjectId(id);

  const blog = await Blog.findByIdAndDelete(id);
  if (!blog) throw new AppError("Blog not found", HTTP_STATUS.NOT_FOUND);
  return ok(null, "Blog deleted successfully");
});
