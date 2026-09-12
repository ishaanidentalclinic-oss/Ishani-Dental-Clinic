import { NextRequest } from "next/server";
import { connectDB } from "@/lib/server/db";
import { Contact } from "@/lib/server/models";
import { ok, withErrorHandler, requireAuth, parseBody, FRONT_DESK_ROLES } from "@/lib/server/response";
import { AppError } from "@/lib/server/utils";
import { HTTP_STATUS } from "@/lib/server/constants";
import mongoose from "mongoose";

function assertValidObjectId(id: string) {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new AppError("Invalid ID", HTTP_STATUS.BAD_REQUEST);
}

export const GET = withErrorHandler(async (req: NextRequest, ctx) => {
  await connectDB();
  requireAuth(req, FRONT_DESK_ROLES);
  const { id } = await ctx.params;
  assertValidObjectId(id);

  const contact = await Contact.findById(id).lean();
  if (!contact) throw new AppError("Enquiry not found", HTTP_STATUS.NOT_FOUND);
  return ok(contact, "Enquiry retrieved successfully");
});

export const PATCH = withErrorHandler(async (req: NextRequest, ctx) => {
  await connectDB();
  requireAuth(req, FRONT_DESK_ROLES);
  const { id } = await ctx.params;
  assertValidObjectId(id);

  const data = await parseBody(req);
  const contact = await Contact.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!contact) throw new AppError("Enquiry not found", HTTP_STATUS.NOT_FOUND);
  return ok(contact, "Enquiry updated successfully");
});

export const DELETE = withErrorHandler(async (req: NextRequest, ctx) => {
  await connectDB();
  requireAuth(req, ["admin", "super_admin"]);
  const { id } = await ctx.params;
  assertValidObjectId(id);

  const contact = await Contact.findByIdAndDelete(id);
  if (!contact) throw new AppError("Enquiry not found", HTTP_STATUS.NOT_FOUND);
  return ok(null, "Enquiry deleted successfully");
});
