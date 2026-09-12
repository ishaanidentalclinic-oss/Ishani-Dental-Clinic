import { NextRequest } from "next/server";
import { connectDB } from "@/lib/server/db";
import { Admin, RefreshToken } from "@/lib/server/models";
import { comparePassword, hashPassword } from "@/lib/server/password";
import { ok, withErrorHandler, requireAuth, parseBody } from "@/lib/server/response";
import { AppError } from "@/lib/server/utils";
import { HTTP_STATUS } from "@/lib/server/constants";

// POST /api/auth/change-password
export const POST = withErrorHandler(async (req: NextRequest) => {
  await connectDB();
  const auth = requireAuth(req);
  const { currentPassword, newPassword } = await parseBody(req);

  if (!currentPassword || !newPassword) {
    throw new AppError("Current password and new password are required", HTTP_STATUS.BAD_REQUEST);
  }

  const admin = await (Admin as any).findById(auth.id).select("+passwordHash");
  if (!admin) throw new AppError("Admin not found", HTTP_STATUS.NOT_FOUND);

  const passwordMatches = await comparePassword(String(currentPassword), admin.passwordHash);
  if (!passwordMatches) throw new AppError("Current password is incorrect", HTTP_STATUS.UNAUTHORIZED);

  admin.passwordHash = await hashPassword(String(newPassword));
  await admin.save();

  // Revoke all sessions so stolen old passwords can't keep alive elsewhere
  await RefreshToken.deleteMany({ admin: admin._id });

  return ok(null, "Password changed successfully");
});
