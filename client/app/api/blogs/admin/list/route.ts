import { NextRequest } from "next/server";
import { connectDB } from "@/lib/server/db";
import { Blog } from "@/lib/server/models";
import { ok, withErrorHandler, requireAuth, getQuery, ADMIN_ROLES } from "@/lib/server/response";
import { escapeRegex } from "@/lib/server/utils";

// GET /api/blogs/admin/list — Paginated admin list
export const GET = withErrorHandler(async (req: NextRequest) => {
  await connectDB();
  requireAuth(req, ADMIN_ROLES);

  const query = getQuery(req);
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 10));
  const skip = (page - 1) * limit;
  const sort = query.sort === "oldest" ? 1 : -1;

  const filter: Record<string, unknown> = {};
  if (query.status) filter.status = query.status;
  if (query.category) filter.category = query.category;
  if (query.featured === "true") filter.featured = true;
  if (query.search) {
    const regex = new RegExp(escapeRegex(query.search), "i");
    filter.$or = [{ title: regex }, { excerpt: regex }, { category: regex }];
  }

  const [blogs, totalRecords] = await Promise.all([
    Blog.find(filter).sort({ createdAt: sort }).skip(skip).limit(limit).lean(),
    Blog.countDocuments(filter),
  ]);

  return ok(
    {
      blogs,
      meta: {
        totalRecords,
        currentPage: page,
        totalPages: Math.max(Math.ceil(totalRecords / limit), 1),
        pageSize: limit,
      },
    },
    "Blogs retrieved successfully",
  );
});
