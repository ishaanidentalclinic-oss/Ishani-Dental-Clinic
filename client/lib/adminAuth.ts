import { apiFetch } from "@/lib/adminApi";

export async function changePassword(currentPassword: string, newPassword: string) {
  return apiFetch<null>("/auth/change-password", {
    method: "POST",
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}
