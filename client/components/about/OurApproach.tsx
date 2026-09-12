import {
  Award,
  ClipboardList,
  HeartHandshake,
  ShieldCheck,
  Smile,
  Sparkles,
} from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { IconBox } from "@/components/ui/IconBox";
import { Reveal } from "@/components/ui/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/ui/StaggerGroup";
import { APPROACH_PRINCIPLES } from "@/constants/our-approach";

const ICONS = {
  prevention: ShieldCheck,
  personalized: ClipboardList,
  technology: Sparkles,
  comfort: Smile,
  specialists: Award,
  ethics: HeartHandshake,
} as const;

export function OurApproach() {
  return (
    <Section background="sage">
      <Reveal className="mx-auto max-w-2xl text-center">
        <Eyebrow>Our Approach</Eyebrow>
        <h2 className="mt-4 text-3xl leading-tight font-semibold text-ink-900 sm:text-4xl">
          How we practice dentistry.
        </h2>
      </Reveal>

      <StaggerGroup className="mx-auto mt-14 grid max-w-4xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {APPROACH_PRINCIPLES.map((principle) => {
          const Icon = ICONS[principle.id as keyof typeof ICONS];
          return (
            <StaggerItem key={principle.id} className="flex flex-col items-start gap-4">
              <IconBox>
                <Icon size={20} />
              </IconBox>
              <div>
                <h3 className="font-semibold text-ink-900">{principle.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-700">
                  {principle.description}
                </p>
              </div>
            </StaggerItem>
          );
        })}
      </StaggerGroup>
    </Section>
  );
}
