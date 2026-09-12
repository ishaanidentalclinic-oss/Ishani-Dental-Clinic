import { NextRequest } from "next/server";
import { connectDB } from "@/lib/server/db";
import { Contact } from "@/lib/server/models";
import { ok, created, withErrorHandler, requireAuth, parseBody, getQuery, FRONT_DESK_ROLES } from "@/lib/server/response";
import { AppError, escapeRegex } from "@/lib/server/utils";
import { HTTP_STATUS } from "@/lib/server/constants";

// GET /api/contacts — admin list
// POST /api/contacts — public create
export const GET = withErrorHandler(async (req: NextRequest) => {
  await connectDB();
  requireAuth(req, FRONT_DESK_ROLES);

  const query = getQuery(req);
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 10));
  const sort = query.sort === "oldest" ? 1 : -1;
  const skip = (page - 1) * limit;

  const filter: Record<string, unknown> = {};
  if (query.status) filter.status = query.status;
  if (query.search) {
    const regex = new RegExp(escapeRegex(query.search), "i");
    filter.$or = [{ name: regex }, { email: regex }, { subject: regex }];
  }

  const [contacts, totalRecords] = await Promise.all([
    Contact.find(filter).sort({ createdAt: sort }).skip(skip).limit(limit).lean(),
    Contact.countDocuments(filter),
  ]);

  return ok({ contacts, meta: { totalRecords, currentPage: page, totalPages: Math.max(Math.ceil(totalRecords / limit), 1), pageSize: limit } }, "Enquiries retrieved successfully");
});

export const POST = withErrorHandler(async (req: NextRequest) => {
  await connectDB();
  const data = await parseBody(req);

  if (!data.name || !data.email || !data.message) {
    throw new AppError("Name, email, and message are required", HTTP_STATUS.BAD_REQUEST);
  }

  const contact = await Contact.create(data);
  return created(contact, "Thanks for reaching out — we'll get back to you shortly.");
});
