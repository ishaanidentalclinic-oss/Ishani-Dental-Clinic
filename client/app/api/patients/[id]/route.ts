import { NextRequest } from "next/server";
import { connectDB } from "@/lib/server/db";
import { Patient } from "@/lib/server/models";
import { ok, withErrorHandler, requireAuth, FRONT_DESK_ROLES } from "@/lib/server/response";
import { AppError } from "@/lib/server/utils";
import { HTTP_STATUS } from "@/lib/server/constants";
import mongoose from "mongoose";

export const GET = withErrorHandler(async (req: NextRequest, ctx) => {
  await connectDB();
  requireAuth(req, FRONT_DESK_ROLES);
  const { id } = await ctx.params;

  if (!mongoose.Types.ObjectId.isValid(id)) throw new AppError("Invalid ID", HTTP_STATUS.BAD_REQUEST);

  const patient = await Patient.findById(id).populate("previousDentist", "name").lean();
  if (!patient) throw new AppError("Patient not found", HTTP_STATUS.NOT_FOUND);
  return ok(patient, "Patient retrieved successfully");
});
