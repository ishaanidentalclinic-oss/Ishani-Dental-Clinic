import { NextRequest } from "next/server";
import { connectDB } from "@/lib/server/db";
import { Treatment } from "@/lib/server/models";
import { created, withErrorHandler, requireAuth, parseBody, ADMIN_ROLES } from "@/lib/server/response";
import { AppError, slugify } from "@/lib/server/utils";
import { TREATMENT_STATUS, HTTP_STATUS } from "@/lib/server/constants";

// POST /api/treatments/admin — Create treatment
export const POST = withErrorHandler(async (req: NextRequest) => {
  await connectDB();
  requireAuth(req, ADMIN_ROLES);

  const data = await parseBody(req);
  if (!data.name || !data.shortDescription || !data.overview) {
    throw new AppError("name, shortDescription, and overview are required", HTTP_STATUS.BAD_REQUEST);
  }

  const baseSlug = slugify(String(data.slug || data.name));
  let slug = baseSlug;
  let suffix = 1;
  while (await Treatment.exists({ slug })) {
    suffix++;
    slug = `${baseSlug}-${suffix}`;
  }

  const publishedAt = data.status === TREATMENT_STATUS.PUBLISHED ? new Date() : null;
  const treatment = await Treatment.create({ ...data, slug, publishedAt });
  return created(treatment, "Treatment created successfully");
});
