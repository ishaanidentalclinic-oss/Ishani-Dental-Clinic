import { NextRequest } from "next/server";
import { connectDB } from "@/lib/server/db";
import { Treatment } from "@/lib/server/models";
import { ok, withErrorHandler } from "@/lib/server/response";
import { AppError } from "@/lib/server/utils";
import { TREATMENT_STATUS, HTTP_STATUS } from "@/lib/server/constants";
import mongoose from "mongoose";

// GET /api/treatments/[id] — Public get by slug or ObjectId
export const GET = withErrorHandler(async (_req: NextRequest, ctx) => {
  await connectDB();
  const { id } = await ctx.params;

  let treatment = await Treatment.findOne({ slug: id, status: TREATMENT_STATUS.PUBLISHED })
    .populate("relatedTreatments", "name slug shortDescription bannerImage")
    .lean();

  if (!treatment && mongoose.Types.ObjectId.isValid(id)) {
    treatment = await Treatment.findOne({ _id: id, status: TREATMENT_STATUS.PUBLISHED })
      .populate("relatedTreatments", "name slug shortDescription bannerImage")
      .lean();
  }

  if (!treatment) {
    throw new AppError("Treatment not found", HTTP_STATUS.NOT_FOUND);
  }

  return ok(treatment, "Treatment retrieved successfully");
});
