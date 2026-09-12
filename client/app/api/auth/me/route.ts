import { NextRequest } from "next/server";
import { connectDB } from "@/lib/server/db";
import { Admin } from "@/lib/server/models";
import { ok, withErrorHandler, requireAuth } from "@/lib/server/response";
import { AppError } from "@/lib/server/utils";
import { HTTP_STATUS } from "@/lib/server/constants";

// GET /api/auth/me
export const GET = withErrorHandler(async (req: NextRequest) => {
  await connectDB();
  const auth = requireAuth(req);

  const admin = await Admin.findById(auth.id).lean();
  if (!admin) throw new AppError("Admin not found", HTTP_STATUS.NOT_FOUND);

  const { passwordHash: _, ...publicAdmin } = admin as Record<string, unknown>;
  return ok({ admin: publicAdmin }, "Admin profile retrieved");
});
