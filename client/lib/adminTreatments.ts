import { apiFetch } from "@/lib/adminApi";
import type { AdminTreatment, PaginationMeta, TreatmentFaq, TreatmentProcedureStep } from "@/types/admin";
import type { TreatmentStatus } from "@/constants/adminTreatmentStatus";

export interface ListTreatmentsParams {
  page?: number;
  limit?: number;
  sort?: "newest" | "oldest" | "order";
  status?: TreatmentStatus;
  search?: string;
}

export interface TreatmentPayload {
  name: string;
  slug?: string;
  shortDescription: string;
  overview: string;
  bannerImage: string;
  category: string;
  benefits: string[];
  idealFor: string[];
  duration: string;
  recovery: string;
  procedure: TreatmentProcedureStep[];
  faqs: TreatmentFaq[];
  relatedTreatments: string[];
  status: TreatmentStatus;
  displayOrder: number;
  seo: {
    metaTitle: string;
    metaDescription: string;
    ogImageUrl: string;
  };
}

function buildQuery(params: ListTreatmentsParams) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") query.set(key, String(value));
  });
  const qs = query.toString();
  return qs ? `?${qs}` : "";
}

export async function listTreatments(params: ListTreatmentsParams) {
  return apiFetch<{ treatments: AdminTreatment[]; meta: PaginationMeta }>(
    `/treatments/admin/list${buildQuery(params)}`,
  );
}

export async function getTreatment(id: string) {
  return apiFetch<AdminTreatment>(`/treatments/admin/${id}`);
}

export async function createTreatment(payload: TreatmentPayload) {
  return apiFetch<AdminTreatment>(`/treatments/admin`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateTreatment(id: string, payload: Partial<TreatmentPayload>) {
  return apiFetch<AdminTreatment>(`/treatments/admin/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function deleteTreatment(id: string) {
  return apiFetch<null>(`/treatments/admin/${id}`, { method: "DELETE" });
}
