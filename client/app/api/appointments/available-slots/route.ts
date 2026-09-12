import { NextRequest } from "next/server";
import { connectDB } from "@/lib/server/db";
import { Appointment, Dentist } from "@/lib/server/models";
import { ok, withErrorHandler, getQuery } from "@/lib/server/response";
import { AppError, timeToMinutes, minutesToTime, intervalsOverlap, getClinicTodayString, getClinicNowMinutes, getDayKey, addDaysToDateOnlyString } from "@/lib/server/utils";
import { getTreatmentSizing, APPOINTMENT_STATUS, HTTP_STATUS, DEFAULT_BUSINESS_HOURS } from "@/lib/server/constants";
import { getBusinessHoursForDay } from "@/lib/server/constants";
import * as calendarService from "@/lib/server/calendar";
import { SiteSettings } from "@/lib/server/models";
import mongoose from "mongoose";

const SLOT_INTERVAL_MINUTES = 15;
const NEXT_AVAILABLE_LOOKAHEAD_DAYS = 30;

function activeStatusFilter() {
  return { status: { $nin: [APPOINTMENT_STATUS.CANCELLED, APPOINTMENT_STATUS.COMPLETED] } };
}

function occupiedInterval(appt: { preferredTime: string; durationMinutes: number; bufferMinutes: number }) {
  return { start: timeToMinutes(appt.preferredTime), duration: appt.durationMinutes + appt.bufferMinutes };
}

async function getSchedulingHours() {
  try {
    const settings = await SiteSettings.findOne().lean();
    return (settings as any)?.schedulingHours || DEFAULT_BUSINESS_HOURS;
  } catch {
    return DEFAULT_BUSINESS_HOURS;
  }
}

async function getSlotsForDentist(
  dateOnlyString: string,
  treatment: string,
  dentistId: string,
  googleCalendarId: string,
) {
  const { duration: durationMinutes, buffer: bufferMinutes } = getTreatmentSizing(treatment);
  const candidateBlocked = durationMinutes + bufferMinutes;

  const schedulingHours = await getSchedulingHours();
  const dayKey = getDayKey(dateOnlyString);
  const hours = getBusinessHoursForDay(schedulingHours, dayKey);

  if (!hours.isOpen) return { durationMinutes, bufferMinutes, isOpen: false, slots: [] };

  const openMinutes = timeToMinutes(hours.openTime);
  const closeMinutes = timeToMinutes(hours.closeTime);
  const isToday = dateOnlyString === getClinicTodayString();
  const nowMinutes = isToday ? getClinicNowMinutes() : -Infinity;

  const [booked, busyFromCalendar] = await Promise.all([
    Appointment.find({ dentist: dentistId, preferredDate: dateOnlyString, ...activeStatusFilter() })
      .select("preferredTime durationMinutes bufferMinutes")
      .lean(),
    googleCalendarId ? calendarService.getBusyIntervals(googleCalendarId, dateOnlyString) : [],
  ]);

  const occupiedIntervals = [
    ...(booked as any[]).map(occupiedInterval),
    ...busyFromCalendar.map(({ start, end }) => ({ start, duration: end - start })),
  ];

  const slots: string[] = [];
  for (let start = openMinutes; start + durationMinutes <= closeMinutes; start += SLOT_INTERVAL_MINUTES) {
    if (isToday && start <= nowMinutes) continue;
    const overlaps = occupiedIntervals.some((o) => intervalsOverlap(start, candidateBlocked, o.start, o.duration));
    if (!overlaps) slots.push(minutesToTime(start));
  }

  return { durationMinutes, bufferMinutes, isOpen: true, slots };
}

// GET /api/appointments/available-slots
export const GET = withErrorHandler(async (req: NextRequest) => {
  await connectDB();
  const { date, treatment, dentist: dentistId } = getQuery(req);

  if (!date || !treatment) {
    throw new AppError("date and treatment are required", HTTP_STATUS.BAD_REQUEST);
  }

  if (dentistId) {
    const dentist = await Dentist.findById(dentistId).lean();
    if (!dentist || !(dentist as any).isActive) throw new AppError("Dentist not found", HTTP_STATUS.NOT_FOUND);
    const result = await getSlotsForDentist(date, treatment, dentistId, (dentist as any).googleCalendarId);
    return ok({ date, treatment, dentist: { id: (dentist as any)._id, name: (dentist as any).name }, ...result }, "Available slots retrieved");
  }

  const dentists = await Dentist.find({ isActive: true }).sort({ displayOrder: 1 }).lean();
  const byDentist = await Promise.all(
    dentists.map(async (d: any) => ({
      dentist: { id: d._id, name: d.name },
      ...(await getSlotsForDentist(date, treatment, String(d._id), d.googleCalendarId)),
    })),
  );

  return ok({ date, treatment, dentists: byDentist }, "Available slots retrieved");
});

// Also used by next-available-slot, export helper
export { getSlotsForDentist, NEXT_AVAILABLE_LOOKAHEAD_DAYS };
