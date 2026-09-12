import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { HomeTreatmentCards } from "@/components/home/HomeTreatmentCards";
import { fetchPublicTreatments } from "@/lib/publicTreatments";

export async function Treatments() {
  const treatments = await fetchPublicTreatments();
  const featured = treatments.slice(0, 3);

  return (
    <Section id="treatments" background="white">
      <Reveal className="mx-auto max-w-2xl text-center">
        <Eyebrow>What we offer</Eyebrow>
        <h2 className="mt-4 text-3xl leading-tight font-semibold text-ink-900 sm:text-4xl">
          Expert care for every <span className="text-primary-600">aspect</span> of your
          smile.
        </h2>
      </Reveal>

      <HomeTreatmentCards treatments={featured} />

      <Reveal className="mt-10 text-center">
        <Link
          href="/treatments"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary-700 hover:text-primary-800"
        >
          Explore All Treatments
          <ArrowRight size={16} />
        </Link>
      </Reveal>
    </Section>
  );
}
