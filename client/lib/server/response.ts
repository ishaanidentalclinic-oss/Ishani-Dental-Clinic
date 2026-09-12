import { NextRequest, NextResponse } from "next/server";
import { AppError } from "./utils";
import { verifyAccessToken, ACCESS_TOKEN_COOKIE } from "./auth";
import { ADMIN_ROLE } from "./constants";

/** Standard JSON success response */
export function ok(data?: unknown, message = "Success", status = 200) {
  return NextResponse.json({ success: true, message, data }, { status });
}

/** Standard JSON created response */
export function created(data?: unknown, message = "Created") {
  return ok(data, message, 201);
}

/** Standard JSON error response */
export function errorResponse(message: string, status = 500, errors?: unknown) {
  return NextResponse.json({ success: false, message, errors }, { status });
}

/** Wraps an async route handler with consistent error handling */
export function withErrorHandler(
  handler: (req: NextRequest, ctx: { params: Promise<Record<string, string>> }) => Promise<NextResponse>,
) {
  return async (req: NextRequest, ctx: { params: Promise<Record<string, string>> }) => {
    try {
      return await handler(req, ctx);
    } catch (err) {
      if (err instanceof AppError) {
        return errorResponse(err.message, err.statusCode, err.errors);
      }
      console.error("[API Error]", err);
      return errorResponse("An unexpected error occurred", 500);
    }
  };
}

/** Extracts and verifies the access token from cookies. Returns { id, role } or null. */
export function getAuthFromRequest(req: NextRequest): { id: string; role: string } | null {
  try {
    const token = req.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
    if (!token) return null;
    const payload = verifyAccessToken(token);
    return { id: payload.sub, role: payload.role };
  } catch {
    return null;
  }
}

/** Throws 401 if not authenticated, 403 if not in allowed roles */
export function requireAuth(
  req: NextRequest,
  allowedRoles?: string[],
): { id: string; role: string } {
  const auth = getAuthFromRequest(req);
  if (!auth) throw new AppError("Your session has expired. Please log in again.", 401);
  if (allowedRoles && !allowedRoles.includes(auth.role)) {
    throw new AppError("You do not have permission to perform this action.", 403);
  }
  return auth;
}

export const FRONT_DESK_ROLES = [ADMIN_ROLE.RECEPTIONIST, ADMIN_ROLE.ADMIN, ADMIN_ROLE.SUPER_ADMIN];
export const ADMIN_ROLES = [ADMIN_ROLE.ADMIN, ADMIN_ROLE.SUPER_ADMIN];

/** Parse JSON body safely */
export async function parseBody(req: NextRequest): Promise<Record<string, unknown>> {
  try {
    return await req.json();
  } catch {
    return {};
  }
}

/** Get query params as an object */
export function getQuery(req: NextRequest): Record<string, string> {
  const params: Record<string, string> = {};
  req.nextUrl.searchParams.forEach((value, key) => {
    params[key] = value;
  });
  return params;
}
