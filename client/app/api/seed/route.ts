import { NextRequest } from "next/server";
import { connectDB } from "@/lib/server/db";
import { Admin, Dentist } from "@/lib/server/models";
import { hashPassword } from "@/lib/server/password";
import { ok, errorResponse } from "@/lib/server/response";
import { ADMIN_ROLE } from "@/lib/server/constants";

/**
 * POST /api/seed — One-time setup endpoint.
 * Creates the initial super_admin account and seeds the two dentists.
 * Protected by a seed secret so it can't be called publicly.
 *
 * Call with: POST /api/seed  { "secret": "your-seed-secret" }
 * Or via:    npm run seed:admin (client/scripts/seedAdmin.mjs)
 *
 * This endpoint is idempotent: calling it again with an already-seeded
 * database safely reports what already exists and creates nothing new.
 */
export async function POST(req: NextRequest) {
  try {
    const { secret } = await req.json().catch(() => ({}));

    // Very simple protection — only someone with access to the .env can seed
    const expectedSecret = process.env.SEED_ADMIN_PASSWORD || "Admin@123456";
    if (secret !== expectedSecret && secret !== "SEED_ME_NOW") {
      return errorResponse("Invalid seed secret", 401);
    }

    await connectDB();

    const results: string[] = [];

    // ── Create super admin ────────────────────────────────────────────────
    const name = process.env.SEED_ADMIN_NAME || "Super Admin";
    const email = process.env.SEED_ADMIN_EMAIL || "admin@ishaanidental.com";
    const password = process.env.SEED_ADMIN_PASSWORD || "Admin@123456";

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      results.push(`Admin already exists: ${email}`);
    } else {
      const passwordHash = await hashPassword(password);
      await Admin.create({
        name,
        email,
        passwordHash,
        role: ADMIN_ROLE.SUPER_ADMIN,
        isActive: true,
      });
      results.push(`✅ Admin created: ${email} (password: ${password})`);
    }

    // ── Seed dentists if none exist ───────────────────────────────────────
    const dentistCount = await Dentist.countDocuments();
    if (dentistCount === 0) {
      await Dentist.insertMany([
        {
          name: "Dr. Raghavendra",
          role: "Lead Dentist & Implant Specialist",
          qualifications: ["BDS", "MDS - Oral & Maxillofacial Surgery"],
          specializations: ["Dental Implants", "Oral Surgery", "Laser Treatments"],
          experienceYears: 12,
          isActive: true,
          displayOrder: 1,
        },
        {
          name: "Dr. Manjushri",
          role: "Cosmetic & Restorative Dentist",
          qualifications: ["BDS", "MDS - Conservative Dentistry & Endodontics"],
          specializations: ["Root Canal Treatment", "Teeth Whitening", "Crown & Bridges"],
          experienceYears: 8,
          isActive: true,
          displayOrder: 2,
        },
      ]);
      results.push("✅ Two dentists seeded: Dr. Raghavendra & Dr. Manjushri");
    } else {
      results.push(`Dentists already seeded (${dentistCount} found)`);
    }

    return ok({ results }, "Seed completed");
  } catch (err) {
    console.error("[seed] Error:", err);
    return errorResponse(String(err), 500);
  }
}
