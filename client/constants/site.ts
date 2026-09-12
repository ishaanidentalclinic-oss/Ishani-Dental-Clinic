export const SITE = {
  name: "Ishaani Dental Clinic",
  shortName: "Ishaani Dental",
  fullName: "Ishaani Dental Clinic — Advanced Implant and Laser Center",
  tagline: "Healthy Smiles Begin Here.",
  phone: "+91 97663 37620",
  phoneHref: "tel:+919766337620",
  whatsappNumber: "919766337620",
  email: "Ishaanidentalclinic@outlook.com",
  // The footer specifically shows this address instead of the general
  // contact email above — a deliberate, hardcoded exception, not driven by
  // SiteSettings — see components/layout/Footer.tsx.
  footerEmail: "synergexai.official@gmail.com",
  address:
    "Office 302, 3rd Floor, Sun City Ambegaon, Katraj-Narhe Road, Near Bhumkar Bridge, Ambegaon (Bk), Pune, Maharashtra, India",
  googleReviewsUrl: "https://g.page/r/CXx9NjwefRjAEAI/review",
  // Working hours are not published on the clinic's source site — call ahead to confirm.
  workingHours: "Call ahead to confirm current hours",
} as const;

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Treatments", href: "/treatments" },
  { label: "Blog", href: "/blogs" },
  { label: "Testimonials", href: "/#testimonials" },
  { label: "Contact", href: "/contact" },
] as const;
