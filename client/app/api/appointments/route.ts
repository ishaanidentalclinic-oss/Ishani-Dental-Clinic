import { NextRequest } from "next/server";
import { connectDB } from "@/lib/server/db";
import { Appointment, Dentist, Patient } from "@/lib/server/models";
import { ok, created, withErrorHandler, requireAuth, parseBody, getQuery, FRONT_DESK_ROLES } from "@/lib/server/response";
import { AppError, escapeRegex, getClinicTodayString, getClinicNowMinutes, timeToMinutes, intervalsOverlap } from "@/lib/server/utils";
import { getTreatmentSizing, APPOINTMENT_STATUS, HTTP_STATUS, APPOINTMENT_SOURCE } from "@/lib/server/constants";
import * as emailService from "@/lib/server/email";
import * as calendarService from "@/lib/server/calendar";
import mongoose from "mongoose";

const SLOT_INTERVAL_MINUTES = 15;
const NEXT_AVAILABLE_LOOKAHEAD_DAYS = 30;

function assertValidObjectId(id: string) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid ID", HTTP_STATUS.BAD_REQUEST);
  }
}

function activeStatusFilter() {
  return {
    status: {
      $nin: [APPOINTMENT_STATUS.CANCELLED, APPOINTMENT_STATUS.COMPLETED],
    },
  };
}

function occupiedInterval(appt: { preferredTime: string; durationMinutes: number; bufferMinutes: number }) {
  return { start: timeToMinutes(appt.preferredTime), duration: appt.durationMinutes + appt.bufferMinutes };
}

// GET /api/appointments — admin list (authenticated)
// POST /api/appointments — public create
export const GET = withErrorHandler(async (req: NextRequest) => {
  await connectDB();
  requireAuth(req, FRONT_DESK_ROLES);

  const query = getQuery(req);
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 10));
  const sort = query.sort === "oldest" ? 1 : -1;
  const skip = (page - 1) * limit;

  const filter: Record<string, unknown> = {};
  if (query.status) filter.status = query.status;
  if (query.treatment) filter.treatment = query.treatment;
  if (query.dentist) filter.dentist = query.dentist;
  if (query.preferredDate) filter.preferredDate = query.preferredDate;
  if (query.search) {
    const regex = new RegExp(escapeRegex(query.search), "i");
    filter.$or = [{ name: regex }, { email: regex }, { phone: regex }];
  }

  const [appointments, totalRecords] = await Promise.all([
    Appointment.find(filter).sort({ createdAt: sort }).skip(skip).limit(limit).populate("dentist", "name").lean(),
    Appointment.countDocuments(filter),
  ]);

  return ok(
    {
      appointments,
      meta: {
        totalRecords,
        currentPage: page,
        totalPages: Math.max(Math.ceil(totalRecords / limit), 1),
        pageSize: limit,
      },
    },
    "Appointments retrieved successfully",
  );
});

export const POST = withErrorHandler(async (req: NextRequest) => {
  await connectDB();
  const data = await parseBody(req);

  // Validate required fields
  if (!data.name || !data.phone || !data.treatment || !data.preferredDate || !data.preferredTime || !data.dentist) {
    throw new AppError("Name, phone, treatment, preferredDate, preferredTime, and dentist are required", HTTP_STATUS.BAD_REQUEST);
  }

  const appointment = await createAppointmentInternal(data);
  return created(appointment, "Appointment created successfully");
});

async function createAppointmentInternal(data: Record<string, unknown>) {
  // Validate dentist
  assertValidObjectId(String(data.dentist));
  const dentist = await Dentist.findById(data.dentist).lean();
  if (!dentist || !(dentist as any).isActive) {
    throw new AppError("Selected dentist is not available", HTTP_STATUS.BAD_REQUEST);
  }

  const { duration: durationMinutes, buffer: bufferMinutes } = getTreatmentSizing(String(data.treatment));

  // Find or create patient
  const phone = String(data.phone).replace(/\D/g, "");
  let patient = await Patient.findOne({ phone });
  if (patient) {
    if (data.name) (patient as any).name = data.name;
    if (data.email) (patient as any).email = data.email;
    if ((patient as any).isModified()) await (patient as any).save();
  } else {
    patient = await Patient.create({
      name: data.name,
      email: data.email || "",
      phone,
      previousDentist: data.dentist || null,
    });
  }

  const appointment = await Appointment.create({
    ...data,
    durationMinutes,
    bufferMinutes,
    patient: (patient as any)._id,
    source: data.source || APPOINTMENT_SOURCE.WEBSITE,
  });

  // Fire-and-forget notifications
  void emailService.sendPatientConfirmationEmail(appointment as any).catch(console.error);
  void emailService.sendClinicNotificationEmail(appointment as any).catch(console.error);
  void (async () => {
    const eventId = await calendarService.createAppointmentEvent(appointment as any, dentist as any);
    if (eventId) await Appointment.findByIdAndUpdate((appointment as any)._id, { googleEventId: eventId });
  })().catch(console.error);

  return appointment;
}

// Export for internal use by receptionist route
export { createAppointmentInternal };
