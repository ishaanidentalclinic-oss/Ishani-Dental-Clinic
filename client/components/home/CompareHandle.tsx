import { ChevronsLeftRight } from "lucide-react";
import { cn } from "@/lib/cn";

interface CompareHandleProps {
  isActive?: boolean;
}

export function CompareHandle({ isActive = false }: CompareHandleProps) {
  return (
    <span className="relative flex h-12 w-12 items-center justify-center">
      <span
        className={cn(
          "absolute -inset-2.5 rounded-full bg-white/30 opacity-0 blur-sm transition-opacity duration-300 ease-(--ease-premium)",
          isActive && "opacity-100",
        )}
      />
      <span
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-primary-700 text-white shadow-float transition-transform duration-300 ease-(--ease-premium) hover:scale-110",
          isActive && "scale-110",
        )}
      >
        <ChevronsLeftRight size={20} />
      </span>
    </span>
  );
}
