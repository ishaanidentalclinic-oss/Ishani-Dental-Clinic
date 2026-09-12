import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

interface InputProps extends ComponentPropsWithoutRef<"input"> {
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, invalid, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      className={cn(
        "w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-ink-900 placeholder:text-ink-700/50 focus:border-primary-600 focus:ring-2 focus:ring-primary-600/20 focus:outline-none",
        invalid ? "border-red-400" : "border-black/10",
        className,
      )}
      {...props}
    />
  );
});
