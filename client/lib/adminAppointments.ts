import { apiFetch } from "@/lib/adminApi";
import type { AdminAppointment, PaginationMeta } from "@/types/admin";
import type { AppointmentStatus } from "@/constants/adminAppointmentStatus";

export interface ListAppointmentsParams {
  page?: number;
  limit?: number;
  sort?: "newest" | "oldest";
  status?: AppointmentStatus;
  treatment?: string;
  dentist?: string;
  preferredDate?: string;
  search?: string;
}

function buildQuery(params: ListAppointmentsParams) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") query.set(key, String(value));
  });
  const qs = query.toString();
  return qs ? `?${qs}` : "";
}

export async function listAppointments(params: ListAppointmentsParams) {
  return apiFetch<{ appointments: AdminAppointment[]; meta: PaginationMeta }>(
    `/appointments${buildQuery(params)}`,
  );
}

export async function updateAppointmentStatus(id: string, status: AppointmentStatus) {
  return apiFetch<AdminAppointment>(`/appointments/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export async function deleteAppointment(id: string) {
  return apiFetch<null>(`/appointments/${id}`, { method: "DELETE" });
}

export interface CreateReceptionistAppointmentPayload {
  name: string;
  email?: string;
  phone: string;
  treatment: string;
  dentist: string;
  preferredDate: string;
  preferredTime: string;
  source: "Receptionist" | "Walk-in";
  message?: string;
}

/** Receptionist/walk-in booking — same scheduling engine as the public
 * booking form, just called from the admin panel with an explicit source. */
export async function createReceptionistAppointment(payload: CreateReceptionistAppointmentPayload) {
  return apiFetch<AdminAppointment>("/appointments/receptionist", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
