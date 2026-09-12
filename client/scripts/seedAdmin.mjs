/**
 * CLI script to seed the initial Super Admin and Dentists into MongoDB.
 * Usage: npm run seed:admin (from client or root)
 */
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env.local if exists
const envPath = path.resolve(__dirname, "../.env.local");
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI not found in environment or client/.env.local");
  process.exit(1);
}

async function seed() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
  console.log("✅ Connected to MongoDB");

  const db = mongoose.connection.db;

  const name = process.env.SEED_ADMIN_NAME || "Super Admin";
  const email = (process.env.SEED_ADMIN_EMAIL || "admin@ishaanidental.com").toLowerCase().trim();
  const password = process.env.SEED_ADMIN_PASSWORD || "Admin@123456";

  const adminCol = db.collection("admins");
  const existing = await adminCol.findOne({ email });

  if (existing) {
    console.log(`ℹ️ Admin already exists: ${email}`);
  } else {
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);
    await adminCol.insertOne({
      name,
      email,
      passwordHash,
      role: "super_admin",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log(`✅ Super Admin created successfully!`);
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
  }

  // Seed dentists
  const dentistCol = db.collection("dentists");
  const dentistCount = await dentistCol.countDocuments();
  if (dentistCount === 0) {
    await dentistCol.insertMany([
      {
        name: "Dr. Raghavendra S Medikeri",
        role: "Founder & CEO — Periodontist & Implantologist",
        qualifications: [
          "BDS — Bapuji Dental College, Davangere",
          "MDS — A.B. Shetty Dental College Hospital, Mangalore",
          "5 patents & 2 copyrights · Professor, Sinhgad Dental College",
          "Maharashtra Prerna Award (2025)",
        ],
        specializations: ["Periodontal Therapy", "Lasers", "Dental Implants"],
        experienceYears: 19,
        profilePhoto: "/images/doctors/dr-raghavendra-medikeri.jpg",
        email: "",
        googleCalendarId: process.env.GOOGLE_CALENDAR_ID_DR_RAGHAVENDRA || "",
        displayOrder: 0,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Dr. Manjushri W",
        role: "Oral Physician & Radiologist",
        qualifications: [
          "BDS — KLE Dental College",
          "MDS — P.M.N.M. Dental College Hospital, Karnataka",
          "Professor, Sinhgad Dental College",
          "Active research grants & journal publications",
        ],
        specializations: ["Oral Medicine", "Radiology", "TMJ Disorders"],
        experienceYears: 15,
        profilePhoto: "/images/doctors/dr-manjushri-w.jpg",
        email: "",
        googleCalendarId: process.env.GOOGLE_CALENDAR_ID_DR_MANJUSHRI || "",
        displayOrder: 1,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
    console.log("✅ Seeded default dentists into database");
  } else {
    console.log(`ℹ️ Dentists already seeded (${dentistCount} existing)`);
  }

  await mongoose.disconnect();
  console.log("Database disconnected. Seed complete!");
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
