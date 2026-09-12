import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

export function IconBox({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn(
        "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sage-100 text-primary-700",
        className,
      )}
      {...props}
    />
  );
}
