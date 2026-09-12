import type { ComponentType } from "react";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/ui/StaggerGroup";

interface PageHeaderHighlight {
  icon: ComponentType<{ size?: number; className?: string }>;
  label: string;
}

interface PageHeaderProps {
  eyebrow: string;
  heading: React.ReactNode;
  description?: string;
  background?: "white" | "sage";
  /** Trims the vertical padding — opt in per page so other usages are unaffected. */
  compact?: boolean;
  /** Optional row of trust badges rendered beneath the description. */
  highlights?: PageHeaderHighlight[];
}

export function PageHeader({
  eyebrow,
  heading,
  description,
  background = "sage",
  compact = false,
  highlights,
}: PageHeaderProps) {
  return (
    <Section
      background={background}
      className={compact ? "pt-32 pb-12 md:pt-36 md:pb-14" : "pt-36 pb-16 md:pt-44 md:pb-20"}
    >
      <Reveal className="mx-auto max-w-2xl text-center">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="mt-4 text-4xl leading-tight font-semibold text-ink-900 sm:text-5xl">
          {heading}
        </h1>
        {description && <p className="mt-4 text-base text-ink-700">{description}</p>}
      </Reveal>

      {highlights && highlights.length > 0 && (
        <StaggerGroup className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {highlights.map((highlight) => (
            <StaggerItem
              key={highlight.label}
              className="flex items-center gap-2 rounded-pill bg-white px-4 py-2 text-sm font-medium text-ink-900 shadow-card"
            >
              <highlight.icon size={16} className="shrink-0 text-primary-600" />
              {highlight.label}
            </StaggerItem>
          ))}
        </StaggerGroup>
      )}
    </Section>
  );
}
