import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

interface EyebrowProps extends ComponentPropsWithoutRef<"p"> {
  tone?: "primary" | "light";
}

export function Eyebrow({ tone = "primary", className, ...props }: EyebrowProps) {
  return (
    <p
      className={cn(
        "text-sm font-medium tracking-[0.15em] uppercase",
        tone === "primary" ? "text-primary-600" : "text-primary-200",
        className,
      )}
      {...props}
    />
  );
}
