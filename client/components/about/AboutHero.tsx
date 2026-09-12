import Image from "next/image";
import { Clock3, ShieldCheck, Sparkles } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/ui/StaggerGroup";
import { fadeLeft } from "@/motion/variants";

const TRUST_BADGES = [
  { id: "experience", icon: Clock3, label: "19+ Years of Experience" },
  { id: "technology", icon: Sparkles, label: "Advanced Implant & Laser Dentistry" },
  { id: "prevention", icon: ShieldCheck, label: "Prevention-First Care" },
] as const;

export function AboutHero() {
  return (
    <Section background="white" className="relative overflow-hidden pt-28 pb-16 md:pt-32 md:pb-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-24 -z-10 h-96 w-96 rounded-full bg-primary-100/60 blur-3xl"
      />

      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <Eyebrow>About Us</Eyebrow>
          <h1 className="mt-4 text-4xl leading-tight font-semibold text-ink-900 sm:text-5xl">
            Patient-centered care, built on trust.
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-ink-700">
            Ishaani Dental Clinic brings together experienced specialists, modern
            technology, and a genuinely prevention-first philosophy — so every visit
            feels like it&apos;s built around you, not just your treatment.
          </p>

          <StaggerGroup className="mt-8 flex flex-wrap gap-3">
            {TRUST_BADGES.map((badge) => (
              <StaggerItem
                key={badge.id}
                className="flex items-center gap-2 rounded-pill bg-sage-50 px-4 py-2 text-sm font-medium text-ink-900"
              >
                <badge.icon size={16} className="shrink-0 text-primary-600" />
                {badge.label}
              </StaggerItem>
            ))}
          </StaggerGroup>
        </Reveal>

        <Reveal variants={fadeLeft} className="relative">
          <div className="relative aspect-4/5 w-full overflow-hidden rounded-card shadow-float">
            <Image
              src="/images/about/about-hero.jpg"
              alt="A dentist warmly sharing a patient's treatment results together"
              fill
              sizes="(min-width: 1024px) 520px, 90vw"
              className="object-cover"
              priority
            />
          </div>
          <div className="absolute -bottom-6 -left-6 hidden rounded-card bg-white p-4 shadow-float sm:block">
            <p className="font-serif text-2xl font-semibold text-primary-700">19+</p>
            <p className="mt-0.5 text-xs text-ink-700">Years caring for smiles</p>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
