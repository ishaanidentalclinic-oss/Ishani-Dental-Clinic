// ── Constants ──────────────────────────────────────────────────────────────

export const CLINIC = Object.freeze({
  name: "Ishaani Dental Clinic",
  fullName: "Ishaani Dental Clinic — Advanced Implant and Laser Center",
  phone: "+91 97663 37620",
  email: "Ishaanidentalclinic@outlook.com",
  address:
    "Office 302, 3rd Floor, Sun City Ambegaon, Katraj-Narhe Road, Near Bhumkar Bridge, Ambegaon (Bk), Pune, Maharashtra, India",
});

export const DAY_KEYS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

export const DEFAULT_BUSINESS_HOURS = Object.freeze({
  sunday: { isOpen: false, openTime: "10:00", closeTime: "19:00" },
  monday: { isOpen: true, openTime: "10:00", closeTime: "19:00" },
  tuesday: { isOpen: true, openTime: "10:00", closeTime: "19:00" },
  wednesday: { isOpen: true, openTime: "10:00", closeTime: "19:00" },
  thursday: { isOpen: true, openTime: "10:00", closeTime: "19:00" },
  friday: { isOpen: true, openTime: "10:00", closeTime: "19:00" },
  saturday: { isOpen: true, openTime: "10:00", closeTime: "19:00" },
});

export function getBusinessHoursForDay(
  schedulingHours: Record<string, { isOpen?: boolean; openTime?: string; closeTime?: string }> | undefined,
  dayKey: string,
) {
  const configured = schedulingHours?.[dayKey];
  const fallback = (DEFAULT_BUSINESS_HOURS as Record<string, { isOpen: boolean; openTime: string; closeTime: string }>)[dayKey];
  return {
    isOpen: typeof configured?.isOpen === "boolean" ? configured.isOpen : fallback.isOpen,
    openTime: configured?.openTime || fallback.openTime,
    closeTime: configured?.closeTime || fallback.closeTime,
  };
}

export const TREATMENTS = Object.freeze([
  "Dental Check-Up",
  "Dental Implants",
  "Laser Treatments",
  "Teeth Whitening",
  "Root Canal Treatment",
  "Dental Fillings",
  "Tooth Extractions",
  "Surgical Tooth Extraction",
  "Orthodontic Braces / Aligners",
  "Complete Dentures",
  "Crown & Bridges",
  "Oral Precancer Screening",
  "Cavity Sealants (Kids Only)",
  "Teeth Cleaning / Professional Scaling",
  "Gum Surgery with Bone Grafting",
  "Gum Esthetic Surgery (Depigmentation)",
  "Other",
]) as readonly string[];

export const TREATMENT_DURATIONS_MINUTES = Object.freeze({
  "Dental Check-Up": { duration: 20, buffer: 5 },
  "Dental Implants": { duration: 60, buffer: 15 },
  "Laser Treatments": { duration: 30, buffer: 10 },
  "Teeth Whitening": { duration: 60, buffer: 10 },
  "Root Canal Treatment": { duration: 60, buffer: 15 },
  "Dental Fillings": { duration: 30, buffer: 10 },
  "Tooth Extractions": { duration: 30, buffer: 10 },
  "Surgical Tooth Extraction": { duration: 45, buffer: 15 },
  "Orthodontic Braces / Aligners": { duration: 30, buffer: 5 },
  "Complete Dentures": { duration: 30, buffer: 10 },
  "Crown & Bridges": { duration: 45, buffer: 10 },
  "Oral Precancer Screening": { duration: 15, buffer: 5 },
  "Cavity Sealants (Kids Only)": { duration: 20, buffer: 5 },
  "Teeth Cleaning / Professional Scaling": { duration: 45, buffer: 10 },
  "Gum Surgery with Bone Grafting": { duration: 60, buffer: 15 },
  "Gum Esthetic Surgery (Depigmentation)": { duration: 45, buffer: 15 },
}) as Record<string, { duration: number; buffer: number }>;

export const DEFAULT_TREATMENT_DURATION = Object.freeze({ duration: 30, buffer: 10 });

export function getTreatmentSizing(treatment: string) {
  return TREATMENT_DURATIONS_MINUTES[treatment] ?? DEFAULT_TREATMENT_DURATION;
}

export const APPOINTMENT_STATUS = Object.freeze({
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
});
export const APPOINTMENT_STATUS_VALUES = Object.values(APPOINTMENT_STATUS);
export const DEFAULT_APPOINTMENT_STATUS = APPOINTMENT_STATUS.PENDING;

export const APPOINTMENT_SOURCE = Object.freeze({
  WEBSITE: "Website",
  RECEPTIONIST: "Receptionist",
  WALK_IN: "Walk-in",
  PHONE_CALL: "Phone Call",
  REFERRAL: "Referral",
});
export const APPOINTMENT_SOURCE_VALUES = Object.values(APPOINTMENT_SOURCE);

export const ADMIN_ROLE = Object.freeze({
  RECEPTIONIST: "receptionist",
  ADMIN: "admin",
  SUPER_ADMIN: "super_admin",
});
export const ADMIN_ROLE_VALUES = Object.values(ADMIN_ROLE);

export const CONTACT_STATUS = Object.freeze({ NEW: "new", RESOLVED: "resolved" });
export const CONTACT_STATUS_VALUES = Object.values(CONTACT_STATUS);
export const DEFAULT_CONTACT_STATUS = CONTACT_STATUS.NEW;

export const BLOG_STATUS = Object.freeze({ DRAFT: "draft", PUBLISHED: "published" });
export const BLOG_STATUS_VALUES = Object.values(BLOG_STATUS);

export const TREATMENT_STATUS = Object.freeze({ DRAFT: "draft", PUBLISHED: "published" });
export const TREATMENT_STATUS_VALUES = Object.values(TREATMENT_STATUS);

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};
