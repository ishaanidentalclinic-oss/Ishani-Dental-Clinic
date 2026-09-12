import { apiFetch } from "@/lib/adminApi";

export const MEDIA_FOLDER = {
  BLOGS: "ishaani-dental/blogs",
  TREATMENTS: "ishaani-dental/treatments",
  DOCTORS: "ishaani-dental/doctors",
  HOMEPAGE: "ishaani-dental/homepage",
} as const;

export type MediaFolder = (typeof MEDIA_FOLDER)[keyof typeof MEDIA_FOLDER];

export async function uploadImage(file: File, folder: MediaFolder) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  return apiFetch<{ url: string; publicId: string }>(`/media/upload`, {
    method: "POST",
    body: formData,
  });
}
