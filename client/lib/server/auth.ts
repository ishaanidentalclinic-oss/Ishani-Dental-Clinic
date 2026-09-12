import jwt from "jsonwebtoken";
import crypto from "crypto";
import { parseDurationToMs } from "./utils";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;
const ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || "15m";
const REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || "1d";
const REFRESH_EXPIRES_IN_LONG = process.env.JWT_REFRESH_EXPIRES_IN_LONG || "30d";

export const ACCESS_TOKEN_COOKIE = "accessToken";
export const REFRESH_TOKEN_COOKIE = "refreshToken";

export const JWT_CONFIG = {
  accessExpiresIn: ACCESS_EXPIRES_IN,
  refreshExpiresIn: REFRESH_EXPIRES_IN,
  refreshExpiresInLong: REFRESH_EXPIRES_IN_LONG,
};

export function signAccessToken(payload: { adminId: string; role: string }) {
  return jwt.sign({ sub: String(payload.adminId), role: payload.role }, ACCESS_SECRET, {
    expiresIn: ACCESS_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, ACCESS_SECRET) as jwt.JwtPayload & { sub: string; role: string };
}

export function signRefreshToken(payload: { adminId: string }, expiresIn: string) {
  return jwt.sign(
    { sub: String(payload.adminId), jti: crypto.randomUUID() },
    REFRESH_SECRET,
    { expiresIn: expiresIn as jwt.SignOptions["expiresIn"] },
  );
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, REFRESH_SECRET) as jwt.JwtPayload & { sub: string };
}

/** Cookie options for Next.js Response / NextResponse */
function baseCookieOptions() {
  const isProduction = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: (process.env.COOKIE_SAME_SITE as "lax" | "strict" | "none") || "lax",
    path: "/",
  } as const;
}

export function buildAccessTokenCookie(token: string) {
  return {
    name: ACCESS_TOKEN_COOKIE,
    value: token,
    ...baseCookieOptions(),
    maxAge: parseDurationToMs(ACCESS_EXPIRES_IN) / 1000,
  };
}

export function buildRefreshTokenCookie(token: string, expiresIn: string) {
  return {
    name: REFRESH_TOKEN_COOKIE,
    value: token,
    ...baseCookieOptions(),
    maxAge: parseDurationToMs(expiresIn) / 1000,
    path: "/api/auth",
  };
}

export function buildClearAuthCookies() {
  const base = baseCookieOptions();
  return [
    { name: ACCESS_TOKEN_COOKIE, value: "", ...base, maxAge: 0 },
    { name: REFRESH_TOKEN_COOKIE, value: "", ...base, maxAge: 0, path: "/api/auth" },
  ];
}
