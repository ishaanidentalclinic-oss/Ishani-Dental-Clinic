import { SITE } from "@/constants/site";

export function getWhatsappLink(message?: string, whatsappNumber: string = SITE.whatsappNumber) {
  const base = `https://wa.me/${whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
