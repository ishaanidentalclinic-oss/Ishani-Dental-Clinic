import { apiFetch } from "@/lib/adminApi";
import type { SiteSettings, SchedulingHours, DayHours } from "@/types/admin";

export type SiteSettingsPayload = Partial<{
  clinicName: string;
  logoUrl: string;
  faviconUrl: string;
  contact: Partial<SiteSettings["contact"]>;
  businessHours: string;
  schedulingHours: Partial<Record<keyof SchedulingHours, Partial<DayHours>>>;
  seo: Partial<SiteSettings["seo"]>;
  footer: Partial<SiteSettings["footer"]>;
}>;

export async function getSiteSettings() {
  return apiFetch<SiteSettings>(`/settings`);
}

export async function updateSiteSettings(payload: SiteSettingsPayload) {
  return apiFetch<SiteSettings>(`/settings`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}
