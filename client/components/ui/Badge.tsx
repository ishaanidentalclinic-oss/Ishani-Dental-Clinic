import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

type BadgeTone = "primary" | "neutral" | "light";

const toneClasses: Record<BadgeTone, string> = {
  primary: "bg-primary-50 text-primary-700",
  neutral: "bg-black/[0.04] text-ink-700",
  light: "bg-white/15 text-white",
};

interface BadgeProps extends ComponentPropsWithoutRef<"span"> {
  tone?: BadgeTone;
}

export function Badge({ tone = "primary", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-pill px-3 py-1 text-xs font-medium",
        toneClasses[tone],
        className,
      )}
      {...props}
    />
  );
}
