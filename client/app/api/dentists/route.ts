import { NextRequest } from "next/server";
import { connectDB } from "@/lib/server/db";
import { Dentist } from "@/lib/server/models";
import { ok, withErrorHandler } from "@/lib/server/response";

// GET /api/dentists — public list of active dentists
export const GET = withErrorHandler(async (_req: NextRequest) => {
  await connectDB();
  const dentists = await Dentist.find({ isActive: true }).sort({ displayOrder: 1 }).lean();
  return ok(dentists, "Dentists retrieved successfully");
});
