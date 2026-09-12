import { NextRequest } from "next/server";
import { connectDB } from "@/lib/server/db";
import { Patient, Appointment } from "@/lib/server/models";
import { ok, withErrorHandler, requireAuth, getQuery, FRONT_DESK_ROLES } from "@/lib/server/response";
import { AppError, normalizePhone, getClinicTodayString } from "@/lib/server/utils";
import { HTTP_STATUS } from "@/lib/server/constants";

// GET /api/patients — search by phone (receptionist)
export const GET = withErrorHandler(async (req: NextRequest) => {
  await connectDB();
  requireAuth(req, FRONT_DESK_ROLES);

  const { phone } = getQuery(req);
  if (!phone) throw new AppError("phone query parameter is required", HTTP_STATUS.BAD_REQUEST);

  const normalizedPhone = normalizePhone(phone);
  const patient = await Patient.findOne({ phone: normalizedPhone }).populate("previousDentist", "name").lean();

  if (!patient) return ok(null, "No patient found with that phone number");

  const today = getClinicTodayString();
  const [upcoming, past] = await Promise.all([
    Appointment.find({ patient: (patient as any)._id, preferredDate: { $gte: today } })
      .sort({ preferredDate: 1, preferredTime: 1 })
      .populate("dentist", "name")
      .lean(),
    Appointment.find({ patient: (patient as any)._id, preferredDate: { $lt: today } })
      .sort({ preferredDate: -1, preferredTime: -1 })
      .limit(10)
      .populate("dentist", "name")
      .lean(),
  ]);

  return ok({ patient, upcomingAppointments: upcoming, pastAppointments: past }, "Patient found");
});
