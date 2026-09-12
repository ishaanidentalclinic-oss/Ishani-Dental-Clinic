import { Heart, Scale, Target, Users } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Card } from "@/components/ui/Card";
import { IconBox } from "@/components/ui/IconBox";
import { Reveal } from "@/components/ui/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/ui/StaggerGroup";
import { PROMISE_VALUES } from "@/constants/our-promise";

const ICONS = {
  "patient-first": Heart,
  ethical: Scale,
  precision: Target,
  trust: Users,
} as const;

export function OurPromise() {
  return (
    <Section background="white">
      <Reveal className="mx-auto max-w-2xl text-center">
        <Eyebrow>Our Promise</Eyebrow>
        <h2 className="mt-4 text-3xl leading-tight font-semibold text-ink-900 sm:text-4xl">
          A commitment that goes beyond treatment.
        </h2>
        <p className="mt-4 text-base leading-relaxed text-ink-700">
          Ethical dentistry, long-term relationships, and meticulous precision — delivered
          with genuine compassion and a commitment to never stop learning.
        </p>
      </Reveal>

      <StaggerGroup className="mx-auto mt-14 grid max-w-3xl gap-6 sm:grid-cols-2">
        {PROMISE_VALUES.map((value) => {
          const Icon = ICONS[value.id as keyof typeof ICONS];
          return (
            <StaggerItem
              key={value.id}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="group h-full"
            >
              <Card className="h-full border border-transparent p-7 transition-all duration-300 ease-(--ease-premium) group-hover:border-primary-200/60 group-hover:shadow-float">
                <IconBox className="transition-transform duration-300 ease-(--ease-premium) group-hover:scale-110 group-hover:-rotate-6">
                  <Icon size={22} />
                </IconBox>
                <h3 className="mt-4 font-semibold text-ink-900">{value.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-700">
                  {value.description}
                </p>
              </Card>
            </StaggerItem>
          );
        })}
      </StaggerGroup>
    </Section>
  );
}
