import { apiFetch } from "@/lib/adminApi";
import type { PatientSearchResult } from "@/types/admin";

/** Receptionist phone lookup — returns `null` (not a 404) when no patient
 * matches, since "no match" just means offer to create a new patient. */
export async function searchPatientByPhone(phone: string) {
  return apiFetch<PatientSearchResult | null>(
    `/patients/search?phone=${encodeURIComponent(phone)}`,
  );
}
