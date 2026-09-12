import { NextRequest } from "next/server";
import { connectDB } from "@/lib/server/db";
import { Blog } from "@/lib/server/models";
import { created, withErrorHandler, requireAuth, parseBody, ADMIN_ROLES } from "@/lib/server/response";
import { AppError, slugify } from "@/lib/server/utils";
import { BLOG_STATUS, HTTP_STATUS } from "@/lib/server/constants";

// POST /api/blogs/admin — Create a blog
export const POST = withErrorHandler(async (req: NextRequest) => {
  await connectDB();
  requireAuth(req, ADMIN_ROLES);

  const data = await parseBody(req);
  if (!data.title || !data.excerpt || !data.category || !data.author) {
    throw new AppError("title, excerpt, category, and author are required", HTTP_STATUS.BAD_REQUEST);
  }

  const baseSlug = slugify(String(data.slug || data.title));
  let slug = baseSlug;
  let suffix = 1;
  while (await Blog.exists({ slug })) {
    suffix++;
    slug = `${baseSlug}-${suffix}`;
  }

  const publishedAt = data.status === BLOG_STATUS.PUBLISHED ? new Date() : null;
  const blog = await Blog.create({ ...data, slug, publishedAt });
  return created(blog, "Blog created successfully");
});
