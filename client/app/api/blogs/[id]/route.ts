import { NextRequest } from "next/server";
import { connectDB } from "@/lib/server/db";
import { Blog } from "@/lib/server/models";
import { ok, withErrorHandler } from "@/lib/server/response";
import { AppError } from "@/lib/server/utils";
import { BLOG_STATUS, HTTP_STATUS } from "@/lib/server/constants";
import mongoose from "mongoose";

// GET /api/blogs/[id] — Public get by slug or ObjectId
export const GET = withErrorHandler(async (_req: NextRequest, ctx) => {
  await connectDB();
  const { id } = await ctx.params;

  let blog = await Blog.findOne({ slug: id, status: BLOG_STATUS.PUBLISHED }).lean();

  if (!blog && mongoose.Types.ObjectId.isValid(id)) {
    blog = await Blog.findOne({ _id: id, status: BLOG_STATUS.PUBLISHED }).lean();
  }

  if (!blog) {
    throw new AppError("Blog not found", HTTP_STATUS.NOT_FOUND);
  }

  return ok(blog, "Blog retrieved successfully");
});
