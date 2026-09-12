import type { AppointmentStatus } from "@/constants/adminAppointmentStatus";
import type { ContactStatus } from "@/constants/adminContactStatus";
import type { BlogStatus } from "@/constants/adminBlogStatus";
import type { TreatmentStatus } from "@/constants/adminTreatmentStatus";

export interface AdminAppointment {
  _id: string;
  name: string;
  email: string;
  phone: string;
  treatment: string;
  dentist: { _id: string; name: string } | string;
  patient: string | null;
  source: "Website" | "Receptionist" | "Walk-in" | "Phone Call" | "Referral";
  preferredDate: string;
  preferredTime: string;
  durationMinutes: number;
  bufferMinutes: number;
  message: string;
  status: AppointmentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AdminPatient {
  _id: string;
  name: string;
  email: string;
  phone: string;
  previousDentist: { _id: string; name: string } | null;
  createdAt: string;
  updatedAt: string;
}

export interface PatientSearchResult {
  patient: AdminPatient;
  upcomingAppointments: AdminAppointment[];
  pastAppointments: AdminAppointment[];
}

export interface AdminContact {
  _id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: ContactStatus;
  createdAt: string;
  updatedAt: string;
}

export interface BlogSection {
  heading?: string;
  paragraphs?: string[];
  bullets?: string[];
}

export interface AdminBlog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  category: string;
  author: string;
  readTime: string;
  sections: BlogSection[];
  status: BlogStatus;
  featured: boolean;
  publishedAt: string | null;
  seo: {
    metaTitle: string;
    metaDescription: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface TreatmentProcedureStep {
  title: string;
  description: string;
}

export interface TreatmentFaq {
  question: string;
  answer: string;
}

export interface RelatedTreatmentRef {
  _id: string;
  name: string;
  slug: string;
  shortDescription: string;
  bannerImage: string;
}

export interface AdminTreatment {
  _id: string;
  name: string;
  slug: string;
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
  relatedTreatments: string[] | RelatedTreatmentRef[];
  status: TreatmentStatus;
  displayOrder: number;
  publishedAt: string | null;
  seo: {
    metaTitle: string;
    metaDescription: string;
    ogImageUrl: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  totalRecords: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
}

export interface DayHours {
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

export interface SchedulingHours {
  sunday: DayHours;
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
}

export interface SiteSettings {
  _id: string;
  clinicName: string;
  logoUrl: string;
  faviconUrl: string;
  contact: {
    phone: string;
    email: string;
    address: string;
    whatsappNumber: string;
    googleMapsUrl: string;
    googleReviewsUrl: string;
  };
  businessHours: string;
  schedulingHours: SchedulingHours;
  seo: {
    metaTitle: string;
    metaDescription: string;
    ogImageUrl: string;
  };
  footer: {
    about: string;
  };
  createdAt: string;
  updatedAt: string;
}
