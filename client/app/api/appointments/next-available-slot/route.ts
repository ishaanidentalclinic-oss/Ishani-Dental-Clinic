import { NextRequest } from "next/server";
import { connectDB } from "@/lib/server/db";
import { Dentist, Appointment, SiteSettings } from "@/lib/server/models";
import { ok, withErrorHandler, getQuery } from "@/lib/server/response";
import { AppError, timeToMinutes, minutesToTime, intervalsOverlap, getClinicTodayString, getClinicNowMinutes, getDayKey, addDaysToDateOnlyString } from "@/lib/server/utils";
import { getTreatmentSizing, APPOINTMENT_STATUS, HTTP_STATUS, DEFAULT_BUSINESS_HOURS } from "@/lib/server/constants";
import { getBusinessHoursForDay } from "@/lib/server/constants";
import * as calendarService from "@/lib/server/calendar";

const SLOT_INTERVAL_MINUTES = 15;
const NEXT_AVAILABLE_LOOKAHEAD_DAYS = 30;

function activeStatusFilter() {
  return { status: { $nin: [APPOINTMENT_STATUS.CANCELLED, APPOINTMENT_STATUS.COMPLETED] } };
}

function occupiedInterval(appt: { preferredTime: string; durationMinutes: number; bufferMinutes: number }) {
  return { start: timeToMinutes(appt.preferredTime), duration: appt.durationMinutes + appt.bufferMinutes };
}

async function getSlotsForDentist(dateOnlyString: string, treatment: string, dentistId: string, googleCalendarId: string) {
  const { duration: durationMinutes, buffer: bufferMinutes } = getTreatmentSizing(treatment);
  const candidateBlocked = durationMinutes + bufferMinutes;

  let schedulingHours = DEFAULT_BUSINESS_HOURS;
  try {
    const settings = await SiteSettings.findOne().lean();
    if ((settings as any)?.schedulingHours) schedulingHours = (settings as any).schedulingHours;
  } catch {}

  const dayKey = getDayKey(dateOnlyString);
  const hours = getBusinessHoursForDay(schedulingHours, dayKey);
  if (!hours.isOpen) return { isOpen: false, slots: [] as string[] };

  const openMinutes = timeToMinutes(hours.openTime);
  const closeMinutes = timeToMinutes(hours.closeTime);
  const isToday = dateOnlyString === getClinicTodayString();
  const nowMinutes = isToday ? getClinicNowMinutes() : -Infinity;

  const [booked, busyFromCalendar] = await Promise.all([
    Appointment.find({ dentist: dentistId, preferredDate: dateOnlyString, ...activeStatusFilter() })
      .select("preferredTime durationMinutes bufferMinutes").lean(),
    googleCalendarId ? calendarService.getBusyIntervals(googleCalendarId, dateOnlyString) : [],
  ]);

  const occupied = [
    ...(booked as any[]).map(occupiedInterval),
    ...busyFromCalendar.map(({ start, end }) => ({ start, duration: end - start })),
  ];

  const slots: string[] = [];
  for (let s = openMinutes; s + durationMinutes <= closeMinutes; s += SLOT_INTERVAL_MINUTES) {
    if (isToday && s <= nowMinutes) continue;
    if (!occupied.some((o) => intervalsOverlap(s, candidateBlocked, o.start, o.duration))) {
      slots.push(minutesToTime(s));
    }
  }
  return { isOpen: true, slots };
}

// GET /api/appointments/next-available-slot
export const GET = withErrorHandler(async (req: NextRequest) => {
  await connectDB();
  const { treatment, dentist: dentistId } = getQuery(req);

  if (!treatment) throw new AppError("treatment is required", HTTP_STATUS.BAD_REQUEST);

  let cursor = getClinicTodayString();

  for (let i = 0; i < NEXT_AVAILABLE_LOOKAHEAD_DAYS; i++) {
    if (dentistId) {
      const dentist = await Dentist.findById(dentistId).lean();
      if (!dentist) break;
      const { isOpen, slots } = await getSlotsForDentist(cursor, treatment, dentistId, (dentist as any).googleCalendarId);
      if (isOpen && slots.length > 0) {
        return ok({ date: cursor, time: slots[0], dentist: { id: (dentist as any)._id, name: (dentist as any).name } }, "Next available slot found");
      }
    } else {
      const dentists = await Dentist.find({ isActive: true }).sort({ displayOrder: 1 }).lean();
      for (const d of dentists as any[]) {
        const { isOpen, slots } = await getSlotsForDentist(cursor, treatment, String(d._id), d.googleCalendarId);
        if (isOpen && slots.length > 0) {
          return ok({ date: cursor, time: slots[0], dentist: { id: d._id, name: d.name } }, "Next available slot found");
        }
      }
    }
    cursor = addDaysToDateOnlyString(cursor, 1);
  }

  return ok(null, "No availability found in the lookahead window");
});
