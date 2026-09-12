import { NextRequest } from "next/server";
import { connectDB } from "@/lib/server/db";
import { Treatment } from "@/lib/server/models";
import { ok, withErrorHandler, requireAuth, getQuery, ADMIN_ROLES } from "@/lib/server/response";
import { escapeRegex } from "@/lib/server/utils";

// GET /api/treatments/admin/list — Paginated admin list
export const GET = withErrorHandler(async (req: NextRequest) => {
  await connectDB();
  requireAuth(req, ADMIN_ROLES);

  const query = getQuery(req);
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 10));
  const skip = (page - 1) * limit;
  const sortSpec =
    query.sort === "newest"
      ? { createdAt: -1 }
      : query.sort === "oldest"
        ? { createdAt: 1 }
        : { displayOrder: 1 };

  const filter: Record<string, unknown> = {};
  if (query.status) filter.status = query.status;
  if (query.search) {
    const regex = new RegExp(escapeRegex(query.search), "i");
    filter.$or = [{ name: regex }, { shortDescription: regex }];
  }

  const [treatments, totalRecords] = await Promise.all([
    Treatment.find(filter).sort(sortSpec as any).skip(skip).limit(limit).lean(),
    Treatment.countDocuments(filter),
  ]);

  return ok(
    {
      treatments,
      meta: {
        totalRecords,
        currentPage: page,
        totalPages: Math.max(Math.ceil(totalRecords / limit), 1),
        pageSize: limit,
      },
    },
    "Treatments retrieved successfully",
  );
});
