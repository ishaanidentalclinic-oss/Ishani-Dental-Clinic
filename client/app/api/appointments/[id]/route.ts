import { NextRequest } from "next/server";
import { connectDB } from "@/lib/server/db";
import { Appointment, Dentist } from "@/lib/server/models";
import { ok, withErrorHandler, requireAuth, parseBody, FRONT_DESK_ROLES } from "@/lib/server/response";
import { AppError } from "@/lib/server/utils";
import { APPOINTMENT_STATUS, HTTP_STATUS } from "@/lib/server/constants";
import * as emailService from "@/lib/server/email";
import * as calendarService from "@/lib/server/calendar";
import mongoose from "mongoose";

function assertValidObjectId(id: string) {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new AppError("Invalid ID", HTTP_STATUS.BAD_REQUEST);
}

// GET /api/appointments/:id
export const GET = withErrorHandler(async (req: NextRequest, ctx) => {
  await connectDB();
  requireAuth(req, FRONT_DESK_ROLES);
  const { id } = await ctx.params;
  assertValidObjectId(id);

  const appointment = await Appointment.findById(id).populate("dentist", "name").lean();
  if (!appointment) throw new AppError("Appointment not found", HTTP_STATUS.NOT_FOUND);

  return ok(appointment, "Appointment retrieved successfully");
});

// PATCH /api/appointments/:id
export const PATCH = withErrorHandler(async (req: NextRequest, ctx) => {
  await connectDB();
  requireAuth(req, FRONT_DESK_ROLES);
  const { id } = await ctx.params;
  assertValidObjectId(id);

  const data = await parseBody(req);
  const isCancelling = data.status === APPOINTMENT_STATUS.CANCELLED;
  const isDateTimeChange = Boolean(data.preferredDate || data.preferredTime);

  let previous: Record<string, unknown> | null = null;
  if (isCancelling || isDateTimeChange) {
    previous = await Appointment.findById(id).lean() as any;
    if (!previous) throw new AppError("Appointment not found", HTTP_STATUS.NOT_FOUND);
  }

  const appointment = await Appointment.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!appointment) throw new AppError("Appointment not found", HTTP_STATUS.NOT_FOUND);

  // Fire-and-forget notifications
  if (isCancelling && previous?.status !== APPOINTMENT_STATUS.CANCELLED) {
    void emailService.sendAppointmentCancelledEmail(appointment as any).catch(console.error);
    void (async () => {
      if (!(previous as any)?.googleEventId) return;
      const dentist = await Dentist.findById((previous as any).dentist).lean();
      if (dentist) await calendarService.deleteAppointmentEvent((previous as any).googleEventId, dentist as any);
    })().catch(console.error);
  } else if (isDateTimeChange && previous) {
    void emailService.sendAppointmentRescheduledEmail(appointment as any, {
      preferredDate: String(previous.preferredDate),
      preferredTime: String(previous.preferredTime),
    }).catch(console.error);
  }

  return ok(appointment, "Appointment updated successfully");
});

// DELETE /api/appointments/:id
export const DELETE = withErrorHandler(async (req: NextRequest, ctx) => {
  await connectDB();
  requireAuth(req, ["super_admin"]);
  const { id } = await ctx.params;
  assertValidObjectId(id);

  const appointment = await Appointment.findByIdAndDelete(id);
  if (!appointment) throw new AppError("Appointment not found", HTTP_STATUS.NOT_FOUND);

  return ok(null, "Appointment deleted successfully");
});
