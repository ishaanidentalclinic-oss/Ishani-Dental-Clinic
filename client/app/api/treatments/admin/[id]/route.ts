import { NextRequest } from "next/server";
import { connectDB } from "@/lib/server/db";
import { Treatment } from "@/lib/server/models";
import { ok, withErrorHandler, requireAuth, parseBody, ADMIN_ROLES } from "@/lib/server/response";
import { AppError, slugify } from "@/lib/server/utils";
import { ADMIN_ROLE, TREATMENT_STATUS, HTTP_STATUS } from "@/lib/server/constants";
import mongoose from "mongoose";

function assertValidObjectId(id: string) {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new AppError("Invalid ID", HTTP_STATUS.BAD_REQUEST);
}

// GET /api/treatments/admin/[id]
export const GET = withErrorHandler(async (req: NextRequest, ctx) => {
  await connectDB();
  requireAuth(req, ADMIN_ROLES);
  const { id } = await ctx.params;
  assertValidObjectId(id);

  const treatment = await Treatment.findById(id).lean();
  if (!treatment) throw new AppError("Treatment not found", HTTP_STATUS.NOT_FOUND);
  return ok(treatment, "Treatment retrieved successfully");
});

// PATCH /api/treatments/admin/[id]
export const PATCH = withErrorHandler(async (req: NextRequest, ctx) => {
  await connectDB();
  requireAuth(req, ADMIN_ROLES);
  const { id } = await ctx.params;
  assertValidObjectId(id);

  const updates = (await parseBody(req)) as Record<string, unknown>;

  if (updates.slug) {
    const nextSlug = slugify(String(updates.slug));
    const existing = await Treatment.findOne({ slug: nextSlug, _id: { $ne: id } });
    if (existing) throw new AppError("That slug is already in use", HTTP_STATUS.CONFLICT);
    updates.slug = nextSlug;
  }

  if (updates.status === TREATMENT_STATUS.PUBLISHED) {
    const current = await Treatment.findById(id).lean();
    if (current && (current as any).status !== TREATMENT_STATUS.PUBLISHED) {
      updates.publishedAt = new Date();
    }
  }

  const treatment = await Treatment.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
  if (!treatment) throw new AppError("Treatment not found", HTTP_STATUS.NOT_FOUND);
  return ok(treatment, "Treatment updated successfully");
});

// DELETE /api/treatments/admin/[id]
export const DELETE = withErrorHandler(async (req: NextRequest, ctx) => {
  await connectDB();
  requireAuth(req, [ADMIN_ROLE.SUPER_ADMIN]);
  const { id } = await ctx.params;
  assertValidObjectId(id);

  const treatment = await Treatment.findByIdAndDelete(id);
  if (!treatment) throw new AppError("Treatment not found", HTTP_STATUS.NOT_FOUND);

  // Data hygiene: remove dangling references
  await Treatment.updateMany({ relatedTreatments: id }, { $pull: { relatedTreatments: id } });
  return ok(null, "Treatment deleted successfully");
});
