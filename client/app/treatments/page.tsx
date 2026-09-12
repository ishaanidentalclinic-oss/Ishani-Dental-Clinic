import type { Metadata } from "next";
import { Award, Clock3, Sparkles, Stethoscope } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { PageHeader } from "@/components/shared/PageHeader";
import { TreatmentsGrid } from "@/components/treatments/TreatmentsGrid";
import { fetchPublicTreatments } from "@/lib/publicTreatments";

export const metadata: Metadata = {
  title: "Treatments | Ishaani Dental Clinic",
  description:
    "Explore the full range of dental treatments at Ishaani Dental Clinic — from routine check-ups to implants, laser dentistry, and more.",
};

export default async function TreatmentsPage() {
  const treatments = await fetchPublicTreatments();

  return (
    <>
      <PageHeader
        eyebrow="Our Treatments"
        heading="Comprehensive dental care, under one roof."
        description="From preventive check-ups to advanced implant and laser dentistry — every treatment is delivered with precision and care."
        compact
        highlights={[
          { icon: Stethoscope, label: `${treatments.length} Specialized Treatments` },
          { icon: Clock3, label: "19+ Years of Clinical Excellence" },
          { icon: Sparkles, label: "Advanced Laser & Implant Dentistry" },
          { icon: Award, label: "Personalized Treatment Plans" },
        ]}
      />

      <Section background="white">
        <TreatmentsGrid treatments={treatments} />
      </Section>
    </>
  );
}
