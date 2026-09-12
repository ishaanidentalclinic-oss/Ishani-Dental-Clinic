import { API_BASE_URL } from "./apiBaseUrl";

export interface ApiFieldError {
  field?: string;
  message: string;
}

export class AppointmentApiError extends Error {
  errors: ApiFieldError[];

  constructor(message: string, errors: ApiFieldError[] = []) {
    super(message);
    this.name = "AppointmentApiError";
    this.errors = errors;
  }
}

export interface BookAppointmentPayload {
  name: string;
  // Optional — not every patient has one. Phone below is required.
  email?: string;
  phone: string;
  treatment: string;
  dentist: string;
  preferredDate: string;
  preferredTime: string;
  message?: string;
}

export interface DentistRef {
  id: string;
  name: string;
}

interface SlotsForDay {
  durationMinutes: number;
  bufferMinutes: number;
  isOpen: boolean;
  slots: string[];
}

/** Returned when `available-slots` is called with a specific `dentist`. */
export interface AvailableSlotsForDentist extends SlotsForDay {
  date: string;
  treatment: string;
  dentist: DentistRef;
}

/** Returned when `available-slots` is called without a `dentist` — every
 * active dentist's slots side by side, for the "earliest available dentist" flow. */
export interface AvailableSlotsAllDentists {
  date: string;
  treatment: string;
  dentists: Array<SlotsForDay & { dentist: DentistRef }>;
}

export interface NextAvailableSlot {
  date: string;
  time: string;
  dentist: DentistRef;
}

async function parseJsonResponse<T>(res: Response, fallbackMessage: string): Promise<T> {
  const json = await res.json().catch(() => null);

  if (!res.ok) {
    throw new AppointmentApiError(json?.message ?? fallbackMessage, json?.errors ?? []);
  }

  return json?.data as T;
}

/** Public, unauthenticated booking submission — no cookies/credentials needed. */
export async function bookAppointment(payload: BookAppointmentPayload) {
  const res = await fetch(`${API_BASE_URL}/appointments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return parseJsonResponse(res, "Something went wrong. Please try again.");
}

/** Public — a specific dentist's bookable start times for a date + treatment. */
export async function fetchAvailableSlots(
  date: string,
  treatment: string,
  dentist: string,
): Promise<AvailableSlotsForDentist>;
/** Public — every active dentist's bookable start times side by side, when no
 * specific dentist has been chosen yet ("earliest available dentist"). */
export async function fetchAvailableSlots(
  date: string,
  treatment: string,
): Promise<AvailableSlotsAllDentists>;
export async function fetchAvailableSlots(
  date: string,
  treatment: string,
  dentist?: string,
): Promise<AvailableSlotsForDentist | AvailableSlotsAllDentists> {
  const params = new URLSearchParams({ date, treatment });
  if (dentist) params.set("dentist", dentist);

  const res = await fetch(`${API_BASE_URL}/appointments/available-slots?${params.toString()}`);
  return parseJsonResponse(res, "Couldn't load available times. Please try again.");
}

/** Public — scans forward for the first open slot, across every active
 * dentist (or one specific dentist, if provided). */
export async function fetchNextAvailableSlot(
  treatment: string,
  dentist?: string,
): Promise<NextAvailableSlot | null> {
  const params = new URLSearchParams({ treatment });
  if (dentist) params.set("dentist", dentist);

  const res = await fetch(`${API_BASE_URL}/appointments/next-available-slot?${params.toString()}`);
  return parseJsonResponse(res, "Couldn't find the next available slot. Please try again.");
}
