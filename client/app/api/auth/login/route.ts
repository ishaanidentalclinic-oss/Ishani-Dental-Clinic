import { NextRequest } from "next/server";
import { connectDB } from "@/lib/server/db";
import { Admin, RefreshToken } from "@/lib/server/models";
import { comparePassword } from "@/lib/server/password";
import { hashToken, parseDurationToMs, AppError } from "@/lib/server/utils";
import {
  signAccessToken,
  signRefreshToken,
  buildAccessTokenCookie,
  buildRefreshTokenCookie,
  JWT_CONFIG,
} from "@/lib/server/auth";
import { ok, withErrorHandler, parseBody } from "@/lib/server/response";
import { HTTP_STATUS } from "@/lib/server/constants";

function toPublicAdmin(admin: { _id: unknown; name: string; email: string; role: string; lastLoginAt?: Date | null }) {
  return { id: admin._id, name: admin.name, email: admin.email, role: admin.role, lastLoginAt: admin.lastLoginAt };
}

async function issueTokens(
  admin: { _id: unknown; role: string },
  rememberMe: boolean,
  ip: string,
  userAgent: string,
) {
  const refreshExpiresIn = rememberMe ? JWT_CONFIG.refreshExpiresInLong : JWT_CONFIG.refreshExpiresIn;
  const accessToken = signAccessToken({ adminId: String(admin._id), role: admin.role });
  const refreshToken = signRefreshToken({ adminId: String(admin._id) }, refreshExpiresIn);

  await RefreshToken.create({
    admin: admin._id,
    tokenHash: hashToken(refreshToken),
    expiresAt: new Date(Date.now() + parseDurationToMs(refreshExpiresIn)),
    rememberMe: Boolean(rememberMe),
    createdByIp: ip,
    userAgent,
  });

  return { accessToken, refreshToken, refreshExpiresIn };
}

// POST /api/auth/login
export const POST = withErrorHandler(async (req: NextRequest) => {
  await connectDB();
  const { email, password, rememberMe } = await parseBody(req);

  if (!email || !password) {
    throw new AppError("Email and password are required", HTTP_STATUS.BAD_REQUEST);
  }

  const admin = await (Admin as any).findOne({ email }).select("+passwordHash");
  if (!admin) throw new AppError("Invalid email or password", HTTP_STATUS.UNAUTHORIZED);

  const passwordMatches = await comparePassword(String(password), admin.passwordHash);
  if (!passwordMatches) throw new AppError("Invalid email or password", HTTP_STATUS.UNAUTHORIZED);
  if (!admin.isActive) throw new AppError("This admin account has been deactivated", HTTP_STATUS.FORBIDDEN);

  const ip = req.headers.get("x-forwarded-for") || "unknown";
  const userAgent = req.headers.get("user-agent") || "";

  const { accessToken, refreshToken, refreshExpiresIn } = await issueTokens(admin, Boolean(rememberMe), ip, userAgent);

  admin.lastLoginAt = new Date();
  await admin.save();

  const response = ok({ admin: toPublicAdmin(admin) }, "Logged in successfully");
  const accessCookie = buildAccessTokenCookie(accessToken);
  const refreshCookie = buildRefreshTokenCookie(refreshToken, refreshExpiresIn);

  response.cookies.set(accessCookie);
  response.cookies.set(refreshCookie);

  return response;
});
