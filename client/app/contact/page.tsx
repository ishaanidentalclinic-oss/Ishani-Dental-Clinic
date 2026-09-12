import type { Metadata } from "next";
import { ContactHero } from "@/components/contact/ContactHero";
import { ClinicInfo } from "@/components/contact/ClinicInfo";
import { LocationMap } from "@/components/contact/LocationMap";
import { AppointmentSection } from "@/components/contact/AppointmentSection";

export const metadata: Metadata = {
  title: "Contact Us | Ishaani Dental Clinic",
  description:
    "Get in touch with Ishaani Dental Clinic — Advanced Implant and Laser Center in Pune. Book an appointment, find our address, or reach us on WhatsApp.",
};

export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <ClinicInfo />
      <LocationMap />
      <AppointmentSection />
    </>
  );
}
