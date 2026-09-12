import Image from "next/image";
import { ShieldCheck } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/ui/StaggerGroup";
import { fadeLeft } from "@/motion/variants";
import { TECH_FEATURES } from "@/constants/technology";

export function Technology() {
  return (
    <Section id="technology" background="primary">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <Eyebrow tone="light">Our Technology</Eyebrow>
          <h2 className="mt-4 text-3xl leading-tight font-semibold text-white sm:text-4xl">
            Clinical precision, powered by{" "}
            <span className="text-primary-200">advanced technology</span>.
          </h2>
          <p className="mt-4 text-base text-white/80">
            Delivering accurate diagnoses and comfortable treatments with state-of-the-art
            dental technology.
          </p>

          <StaggerGroup className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {TECH_FEATURES.map((feature) => (
              <StaggerItem
                key={feature.id}
                className="rounded-xl bg-white/10 p-5 backdrop-blur-sm"
              >
                <p className="font-medium text-white">{feature.title}</p>
                <p className="mt-1.5 text-sm text-white/70">{feature.description}</p>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </Reveal>

        <Reveal variants={fadeLeft} className="relative">
          <div className="relative aspect-4/5 w-full overflow-hidden rounded-card shadow-float">
            <Image
              src="/images/technology/microscope.jpg"
              alt="Dentist using a surgical microscope for precision treatment"
              fill
              sizes="(min-width: 1024px) 520px, 90vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-6 left-6 flex items-start gap-3 rounded-card bg-white p-4 shadow-float sm:max-w-xs">
            <ShieldCheck size={20} className="mt-0.5 shrink-0 text-primary-600" />
            <div>
              <p className="text-sm font-semibold text-ink-900">5 Patents Held</p>
              <p className="mt-0.5 text-xs text-ink-700">
                Innovation recognized across periodontal and implant dentistry.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
