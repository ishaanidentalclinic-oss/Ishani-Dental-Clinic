import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/Container";

type SectionBackground = "white" | "sage" | "primary";

const backgroundClasses: Record<SectionBackground, string> = {
  white: "bg-white",
  sage: "bg-sage-50",
  primary: "bg-primary-900 text-white",
};

interface SectionProps extends ComponentPropsWithoutRef<"section"> {
  background?: SectionBackground;
  containerClassName?: string;
}

export function Section({
  background = "white",
  className,
  containerClassName,
  children,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn("py-20 md:py-28", backgroundClasses[background], className)}
      {...props}
    >
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
