import { NextRequest } from "next/server";
import { connectDB } from "@/lib/server/db";
import { SiteSettings } from "@/lib/server/models";
import { ok, withErrorHandler, requireAuth, parseBody, ADMIN_ROLES } from "@/lib/server/response";
import { CLINIC, DEFAULT_BUSINESS_HOURS, HTTP_STATUS } from "@/lib/server/constants";
import { AppError } from "@/lib/server/utils";

function buildDefaultSettings() {
  return {
    clinicName: CLINIC.name,
    logoUrl: "",
    faviconUrl: "",
    contact: {
      phone: CLINIC.phone,
      email: CLINIC.email,
      address: CLINIC.address,
      whatsappNumber: "919766337620",
      googleMapsUrl: "",
      googleReviewsUrl: "https://g.page/r/CXx9NjwefRjAEAI/review",
    },
    businessHours: "Call ahead to confirm current hours",
    schedulingHours: { ...DEFAULT_BUSINESS_HOURS },
    seo: {
      metaTitle: "Ishaani Dental Clinic | Premium Dental Care",
      metaDescription:
        "Experience gentle, personalized dental care with advanced technology and a team dedicated to keeping your smile healthy and confident.",
      ogImageUrl: "",
    },
    footer: {
      about: `${CLINIC.fullName}. Patient-centered dental care, built on prevention and precision.`,
    },
  };
}

// GET /api/settings — public (no auth) + admin
export const GET = withErrorHandler(async (_req: NextRequest) => {
  await connectDB();

  let settings = await SiteSettings.findOne().lean();
  if (!settings) {
    const created = await SiteSettings.create(buildDefaultSettings());
    settings = created.toObject();
  }
  return ok(settings, "Settings retrieved successfully");
});

export const PATCH = withErrorHandler(async (req: NextRequest) => {
  await connectDB();
  requireAuth(req, ADMIN_ROLES);

  const data = await parseBody(req) as Record<string, unknown>;
  let existing = await SiteSettings.findOne();

  if (!existing) {
    const created = await SiteSettings.create({ ...buildDefaultSettings(), ...data });
    return ok(created.toObject(), "Settings saved successfully");
  }

  if (data.contact) (existing as any).contact = { ...(existing as any).contact.toObject(), ...data.contact };
  if (data.seo) (existing as any).seo = { ...(existing as any).seo.toObject(), ...data.seo };
  if (data.footer) (existing as any).footer = { ...(existing as any).footer.toObject(), ...data.footer };
  if (data.schedulingHours) {
    const existingHours = (existing as any).schedulingHours.toObject();
    const merged = { ...existingHours };
    for (const [day, dayUpdate] of Object.entries(data.schedulingHours as Record<string, unknown>)) {
      merged[day] = { ...(existingHours[day] ?? {}), ...(dayUpdate as object) };
    }
    (existing as any).schedulingHours = merged;
  }

  const { contact: _c, seo: _s, footer: _f, schedulingHours: _sh, ...rest } = data;
  Object.assign(existing, rest);
  await existing.save();

  return ok(existing.toObject(), "Settings updated successfully");
});
