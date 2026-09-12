import { NextRequest } from "next/server";
import { connectDB } from "@/lib/server/db";
import { Treatment } from "@/lib/server/models";
import { ok, withErrorHandler } from "@/lib/server/response";
import { TREATMENT_STATUS } from "@/lib/server/constants";

// GET /api/treatments — Public list of published treatments
export const GET = withErrorHandler(async (_req: NextRequest) => {
  await connectDB();

  const treatments = await Treatment.find({ status: TREATMENT_STATUS.PUBLISHED })
    .sort({ displayOrder: 1, createdAt: -1 })
    .populate("relatedTreatments", "name slug shortDescription bannerImage")
    .lean();

  return ok(treatments, "Treatments retrieved successfully");
});
