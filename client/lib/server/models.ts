import mongoose from "mongoose";
import {
  ADMIN_ROLE,
  ADMIN_ROLE_VALUES,
  APPOINTMENT_STATUS,
  APPOINTMENT_STATUS_VALUES,
  APPOINTMENT_SOURCE_VALUES,
  BLOG_STATUS,
  BLOG_STATUS_VALUES,
  CONTACT_STATUS_VALUES,
  DEFAULT_CONTACT_STATUS,
  TREATMENT_STATUS,
  TREATMENT_STATUS_VALUES,
  TREATMENTS,
  DEFAULT_TREATMENT_DURATION,
  DAY_KEYS,
} from "./constants";

const { Schema, model, models } = mongoose;

// ── Admin ─────────────────────────────────────────────────────────────────

const adminSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ADMIN_ROLE_VALUES, default: ADMIN_ROLE.ADMIN },
    isActive: { type: Boolean, default: true },
    lastLoginAt: { type: Date, default: null },
  },
  { timestamps: true },
);

export const Admin = models.Admin || model("Admin", adminSchema);

// ── RefreshToken ──────────────────────────────────────────────────────────

const refreshTokenSchema = new Schema(
  {
    admin: { type: Schema.Types.ObjectId, ref: "Admin", required: true },
    tokenHash: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
    rememberMe: { type: Boolean, default: false },
    createdByIp: { type: String, default: null },
    userAgent: { type: String, default: null },
  },
  { timestamps: true },
);
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
refreshTokenSchema.index({ admin: 1 });

export const RefreshToken = models.RefreshToken || model("RefreshToken", refreshTokenSchema);

// ── Dentist ───────────────────────────────────────────────────────────────

const dentistSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 150 },
    role: { type: String, trim: true, maxlength: 150, default: "" },
    qualifications: { type: [String], default: [] },
    specializations: { type: [String], default: [] },
    experienceYears: { type: Number, min: 0, default: 0 },
    profilePhoto: { type: String, trim: true, default: "" },
    email: { type: String, trim: true, lowercase: true, default: "" },
    googleCalendarId: { type: String, trim: true, default: "" },
    isActive: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);
dentistSchema.index({ isActive: 1, displayOrder: 1 });

export const Dentist = models.Dentist || model("Dentist", dentistSchema);

// ── Patient ───────────────────────────────────────────────────────────────

const patientSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, trim: true, lowercase: true, default: "" },
    phone: { type: String, required: true, trim: true, unique: true },
    previousDentist: { type: Schema.Types.ObjectId, ref: "Dentist", default: null },
  },
  { timestamps: true },
);

export const Patient = models.Patient || model("Patient", patientSchema);

// ── Appointment ───────────────────────────────────────────────────────────

const appointmentSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
    email: { type: String, trim: true, lowercase: true, default: "" },
    phone: { type: String, required: true, trim: true },
    treatment: { type: String, required: true, enum: TREATMENTS },
    preferredDate: { type: String, required: true, trim: true },
    preferredTime: { type: String, required: true, trim: true },
    durationMinutes: { type: Number, required: true, min: 5, default: DEFAULT_TREATMENT_DURATION.duration },
    bufferMinutes: { type: Number, required: true, min: 0, default: DEFAULT_TREATMENT_DURATION.buffer },
    dentist: { type: Schema.Types.ObjectId, ref: "Dentist", required: true },
    patient: { type: Schema.Types.ObjectId, ref: "Patient", default: null },
    source: { type: String, enum: APPOINTMENT_SOURCE_VALUES, default: "Website" },
    googleEventId: { type: String, trim: true, default: "" },
    message: { type: String, trim: true, maxlength: 500, default: "" },
    status: { type: String, enum: APPOINTMENT_STATUS_VALUES, default: APPOINTMENT_STATUS.PENDING },
  },
  { timestamps: true },
);
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ dentist: 1, preferredDate: 1, preferredTime: 1 });
appointmentSchema.index({ patient: 1 });
appointmentSchema.index({ email: 1 });

export const Appointment = models.Appointment || model("Appointment", appointmentSchema);

// ── Contact ───────────────────────────────────────────────────────────────

const contactSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true, default: "" },
    subject: { type: String, trim: true, maxlength: 150, default: "" },
    message: { type: String, required: true, trim: true, minlength: 10, maxlength: 2000 },
    status: { type: String, enum: CONTACT_STATUS_VALUES, default: DEFAULT_CONTACT_STATUS },
  },
  { timestamps: true },
);
contactSchema.index({ status: 1 });
contactSchema.index({ email: 1 });

export const Contact = models.Contact || model("Contact", contactSchema);

// ── Blog ──────────────────────────────────────────────────────────────────

const blogSectionSchema = new Schema(
  {
    heading: { type: String, trim: true },
    paragraphs: { type: [String], default: [] },
    bullets: { type: [String], default: [] },
  },
  { _id: false },
);

const blogSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, required: true, trim: true, lowercase: true, unique: true },
    excerpt: { type: String, required: true, trim: true, maxlength: 300 },
    coverImage: { type: String, default: "" },
    category: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    readTime: { type: String, trim: true, default: "" },
    sections: { type: [blogSectionSchema], default: [] },
    status: { type: String, enum: BLOG_STATUS_VALUES, default: BLOG_STATUS.DRAFT },
    featured: { type: Boolean, default: false },
    publishedAt: { type: Date, default: null },
    seo: {
      metaTitle: { type: String, trim: true, maxlength: 70, default: "" },
      metaDescription: { type: String, trim: true, maxlength: 160, default: "" },
    },
  },
  { timestamps: true },
);
blogSchema.index({ status: 1 });
blogSchema.index({ category: 1 });
blogSchema.index({ featured: 1 });

export const Blog = models.Blog || model("Blog", blogSchema);

// ── Treatment ─────────────────────────────────────────────────────────────

const procedureStepSchema = new Schema(
  {
    title: { type: String, trim: true, maxlength: 150 },
    description: { type: String, trim: true, maxlength: 500 },
  },
  { _id: false },
);

const faqSchema = new Schema(
  {
    question: { type: String, trim: true, maxlength: 200 },
    answer: { type: String, trim: true, maxlength: 1000 },
  },
  { _id: false },
);

const treatmentSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 150 },
    slug: { type: String, required: true, trim: true, lowercase: true, unique: true },
    shortDescription: { type: String, required: true, trim: true, maxlength: 200 },
    overview: { type: String, required: true, trim: true, maxlength: 1000 },
    bannerImage: { type: String, default: "" },
    category: { type: String, trim: true, default: "" },
    benefits: { type: [String], default: [] },
    idealFor: { type: [String], default: [] },
    duration: { type: String, trim: true, default: "" },
    recovery: { type: String, trim: true, default: "" },
    procedure: { type: [procedureStepSchema], default: [] },
    faqs: { type: [faqSchema], default: [] },
    relatedTreatments: [{ type: Schema.Types.ObjectId, ref: "Treatment" }],
    status: { type: String, enum: TREATMENT_STATUS_VALUES, default: TREATMENT_STATUS.DRAFT },
    displayOrder: { type: Number, default: 0 },
    publishedAt: { type: Date, default: null },
    seo: {
      metaTitle: { type: String, trim: true, maxlength: 70, default: "" },
      metaDescription: { type: String, trim: true, maxlength: 160, default: "" },
      ogImageUrl: { type: String, trim: true, default: "" },
    },
  },
  { timestamps: true },
);
treatmentSchema.index({ status: 1 });
treatmentSchema.index({ displayOrder: 1 });

export const Treatment = models.Treatment || model("Treatment", treatmentSchema);

// ── SiteSettings ──────────────────────────────────────────────────────────

const dayHoursSchema = new Schema(
  {
    isOpen: { type: Boolean, default: true },
    openTime: { type: String, trim: true, default: "10:00" },
    closeTime: { type: String, trim: true, default: "19:00" },
  },
  { _id: false },
);

const schedulingHoursSchema = new Schema(
  Object.fromEntries(DAY_KEYS.map((day) => [day, { type: dayHoursSchema, default: () => ({}) }])),
  { _id: false },
);

const siteSettingsSchema = new Schema(
  {
    clinicName: { type: String, trim: true, required: true },
    logoUrl: { type: String, trim: true, default: "" },
    faviconUrl: { type: String, trim: true, default: "" },
    contact: {
      phone: { type: String, trim: true, default: "" },
      email: { type: String, trim: true, lowercase: true, default: "" },
      address: { type: String, trim: true, default: "" },
      whatsappNumber: { type: String, trim: true, default: "" },
      googleMapsUrl: { type: String, trim: true, default: "" },
      googleReviewsUrl: { type: String, trim: true, default: "" },
    },
    businessHours: { type: String, trim: true, default: "" },
    schedulingHours: { type: schedulingHoursSchema, default: () => ({}) },
    seo: {
      metaTitle: { type: String, trim: true, maxlength: 70, default: "" },
      metaDescription: { type: String, trim: true, maxlength: 160, default: "" },
      ogImageUrl: { type: String, trim: true, default: "" },
    },
    footer: {
      about: { type: String, trim: true, maxlength: 300, default: "" },
    },
  },
  { timestamps: true },
);

export const SiteSettings = models.SiteSettings || model("SiteSettings", siteSettingsSchema);
