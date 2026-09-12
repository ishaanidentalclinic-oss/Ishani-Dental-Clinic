import { apiFetch } from "@/lib/adminApi";
import type { AdminContact, PaginationMeta } from "@/types/admin";
import type { ContactStatus } from "@/constants/adminContactStatus";

export interface ListContactsParams {
  page?: number;
  limit?: number;
  sort?: "newest" | "oldest";
  status?: ContactStatus;
  search?: string;
}

function buildQuery(params: ListContactsParams) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") query.set(key, String(value));
  });
  const qs = query.toString();
  return qs ? `?${qs}` : "";
}

export async function listContacts(params: ListContactsParams) {
  return apiFetch<{ contacts: AdminContact[]; meta: PaginationMeta }>(`/contacts${buildQuery(params)}`);
}

export async function updateContactStatus(id: string, status: ContactStatus) {
  return apiFetch<AdminContact>(`/contacts/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export async function deleteContact(id: string) {
  return apiFetch<null>(`/contacts/${id}`, { method: "DELETE" });
}
