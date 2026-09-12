/** Mirrors server/src/constants/appointmentStatus.js — keep the two in sync. */
export const APPOINTMENT_STATUS_VALUES = ["Pending", "Confirmed", "Completed", "Cancelled"] as const;

export type AppointmentStatus = (typeof APPOINTMENT_STATUS_VALUES)[number];
