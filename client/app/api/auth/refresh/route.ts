import { NextRequest } from "next/server";
import { connectDB } from "@/lib/server/db";
import { RefreshToken, Admin } from "@/lib/server/models";
import { hashToken, parseDurationToMs, AppError } from "@/lib/server/utils";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  buildAccessTokenCookie,
  buildRefreshTokenCookie,
  REFRESH_TOKEN_COOKIE,
  JWT_CONFIG,
} from "@/lib/server/auth";
import { ok, withErrorHandler } from "@/lib/server/response";
import { HTTP_STATUS } from "@/lib/server/constants";

function toPublicAdmin(admin: { _id: unknown; name: string; email: string; role: string; lastLoginAt?: Date | null }) {
  return { id: admin._id, name: admin.name, email: admin.email, role: admin.role, lastLoginAt: admin.lastLoginAt };
}

// POST /api/auth/refresh
export const POST = withErrorHandler(async (req: NextRequest) => {
  await connectDB();

  const incomingRefreshToken = req.cookies.get(REFRESH_TOKEN_COOKIE)?.value;
  if (!incomingRefreshToken) {
    throw new AppError("No refresh token provided", HTTP_STATUS.UNAUTHORIZED);
  }

  let payload: { sub: string };
  try {
    payload = verifyRefreshToken(incomingRefreshToken);
  } catch {
    throw new AppError("Invalid or expired session — please log in again", HTTP_STATUS.UNAUTHORIZED);
  }

  const tokenHash = hashToken(incomingRefreshToken);
  const stored = await RefreshToken.findOne({ tokenHash });
  if (!stored) throw new AppError("Invalid or expired session — please log in again", HTTP_STATUS.UNAUTHORIZED);

  const admin = await Admin.findById(payload.sub);
  if (!admin || !(admin as any).isActive) {
    await RefreshToken.deleteOne({ _id: (stored as any)._id });
    throw new AppError("Invalid or expired session — please log in again", HTTP_STATUS.UNAUTHORIZED);
  }

  await RefreshToken.deleteOne({ _id: (stored as any)._id });

  const refreshExpiresIn = (stored as any).rememberMe ? JWT_CONFIG.refreshExpiresInLong : JWT_CONFIG.refreshExpiresIn;
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  const userAgent = req.headers.get("user-agent") || "";

  const newAccessToken = signAccessToken({ adminId: String((admin as any)._id), role: (admin as any).role });
  const newRefreshToken = signRefreshToken({ adminId: String((admin as any)._id) }, refreshExpiresIn);

  await RefreshToken.create({
    admin: (admin as any)._id,
    tokenHash: hashToken(newRefreshToken),
    expiresAt: new Date(Date.now() + parseDurationToMs(refreshExpiresIn)),
    rememberMe: (stored as any).rememberMe,
    createdByIp: ip,
    userAgent,
  });

  const response = ok({ admin: toPublicAdmin(admin as any) }, "Session refreshed");
  response.cookies.set(buildAccessTokenCookie(newAccessToken));
  response.cookies.set(buildRefreshTokenCookie(newRefreshToken, refreshExpiresIn));

  return response;
});
