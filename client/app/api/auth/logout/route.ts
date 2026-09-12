import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/server/db";
import { RefreshToken } from "@/lib/server/models";
import { hashToken } from "@/lib/server/utils";
import { buildClearAuthCookies, REFRESH_TOKEN_COOKIE } from "@/lib/server/auth";
import { ok, withErrorHandler } from "@/lib/server/response";

// POST /api/auth/logout
export const POST = withErrorHandler(async (req: NextRequest) => {
  await connectDB();

  const refreshToken = req.cookies.get(REFRESH_TOKEN_COOKIE)?.value;
  if (refreshToken) {
    await RefreshToken.deleteOne({ tokenHash: hashToken(refreshToken) });
  }

  const response = ok(null, "Logged out successfully");
  const clearCookies = buildClearAuthCookies();
  clearCookies.forEach((c) => response.cookies.set(c));

  return response;
});
