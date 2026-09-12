import { API_BASE_URL } from "./apiBaseUrl";

export interface Dentist {
  _id: string;
  name: string;
  role: string;
  qualifications: string[];
  specializations: string[];
  experienceYears: number;
  profilePhoto: string;
  isActive: boolean;
  displayOrder: number;
}

/** Public, unauthenticated — the booking form's dentist cards/radios and the
 * receptionist dashboard's doctor-schedule view both read this same list. */
export async function fetchDentists(): Promise<Dentist[]> {
  const res = await fetch(`${API_BASE_URL}/dentists`);
  const json = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(json?.message ?? "Couldn't load the list of dentists.");
  }

  return json?.data ?? [];
}
