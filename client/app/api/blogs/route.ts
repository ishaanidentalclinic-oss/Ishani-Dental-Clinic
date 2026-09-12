import { NextRequest } from "next/server";
import { connectDB } from "@/lib/server/db";
import { Blog } from "@/lib/server/models";
import { ok, withErrorHandler, getQuery } from "@/lib/server/response";
import { escapeRegex } from "@/lib/server/utils";
import { BLOG_STATUS } from "@/lib/server/constants";

// GET /api/blogs — Public list of published blogs
export const GET = withErrorHandler(async (req: NextRequest) => {
  await connectDB();
  const query = getQuery(req);

  const filter: Record<string, unknown> = {
    status: BLOG_STATUS.PUBLISHED,
  };

  if (query.category) {
    filter.category = query.category;
  }
  if (query.featured === "true") {
    filter.featured = true;
  }
  if (query.search) {
    const regex = new RegExp(escapeRegex(query.search), "i");
    filter.$or = [{ title: regex }, { excerpt: regex }, { category: regex }];
  }

  const blogs = await Blog.find(filter).sort({ publishedAt: -1, createdAt: -1 }).lean();
  return ok(blogs, "Blogs retrieved successfully");
});
