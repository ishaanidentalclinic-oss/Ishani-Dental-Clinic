import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

export const Select = forwardRef<HTMLSelectElement, ComponentPropsWithoutRef<"select">>(
  function Select({ className, children, ...props }, ref) {
    return (
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            "w-full appearance-none rounded-lg border border-black/10 bg-white px-4 py-2.5 pr-10 text-sm text-ink-900 focus:border-primary-600 focus:ring-2 focus:ring-primary-600/20 focus:outline-none",
            className,
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown
          size={16}
          className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-ink-700"
        />
      </div>
    );
  },
);
