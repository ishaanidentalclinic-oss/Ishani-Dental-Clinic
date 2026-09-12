// ── Shared server-side utilities ──────────────────────────────────────────

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;
  errors: { field?: string; message: string }[];

  constructor(
    message: string,
    statusCode = 500,
    errors: { field?: string; message: string }[] = [],
  ) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.isOperational = true;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}

// ── Scheduling ────────────────────────────────────────────────────────────

import { DAY_KEYS } from "./constants";

export const CLINIC_UTC_OFFSET_MINUTES = 5 * 60 + 30;

export function timeToMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

export function minutesToTime(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60).toString().padStart(2, "0");
  const minutes = (totalMinutes % 60).toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function addDaysToDateOnlyString(dateOnlyString: string, days: number) {
  const [year, month, day] = dateOnlyString.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + days));
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function getDayKey(dateOnlyString: string) {
  const [year, month, day] = dateOnlyString.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return DAY_KEYS[date.getUTCDay()];
}

export function getClinicNow() {
  const now = new Date();
  return new Date(now.getTime() + CLINIC_UTC_OFFSET_MINUTES * 60 * 1000);
}

export function getClinicTodayString() {
  const clinicNow = getClinicNow();
  const year = clinicNow.getUTCFullYear();
  const month = String(clinicNow.getUTCMonth() + 1).padStart(2, "0");
  const day = String(clinicNow.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getClinicNowMinutes() {
  const clinicNow = getClinicNow();
  return clinicNow.getUTCHours() * 60 + clinicNow.getUTCMinutes();
}

export function intervalsOverlap(aStart: number, aDuration: number, bStart: number, bDuration: number) {
  return aStart < bStart + bDuration && bStart < aStart + aDuration;
}

export function formatDateOnlyDisplay(
  dateOnlyString: string,
  options: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" },
) {
  const [year, month, day] = dateOnlyString.split("-").map(Number);
  const localDate = new Date(year, month - 1, day);
  return localDate.toLocaleDateString("en-IN", options);
}

// ── Misc ──────────────────────────────────────────────────────────────────

export function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function escapeHtml(value: string) {
  const HTML_ESCAPES: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };
  return String(value).replace(/[&<>"']/g, (char) => HTML_ESCAPES[char]);
}

export function slugify(value: string) {
  return value.toString().trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export function normalizePhone(phone: string) {
  return (phone || "").replace(/\D/g, "");
}

export function hashToken(rawToken: string) {
  const crypto = require("crypto") as typeof import("crypto");
  return crypto.createHash("sha256").update(rawToken).digest("hex");
}

export function parseDurationToMs(duration: string) {
  const UNIT_TO_MS: Record<string, number> = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };
  const match = /^(\d+)([smhd])$/.exec(duration.trim());
  if (!match) throw new Error(`Invalid duration: "${duration}"`);
  const [, amount, unit] = match;
  return Number(amount) * UNIT_TO_MS[unit];
}
