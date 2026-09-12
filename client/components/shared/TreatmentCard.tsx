import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";

interface TreatmentCardProps {
  image: string;
  name: string;
  description: string;
  onClick?: () => void;
}

export function TreatmentCard({ image, name, description, onClick }: TreatmentCardProps) {
  const isInteractive = Boolean(onClick);

  const content = (
    <Card
      className={cn(
        "group h-full overflow-hidden transition-all duration-300 ease-(--ease-premium)",
        isInteractive && "hover:-translate-y-1.5 hover:shadow-float",
      )}
    >
      <div className="relative aspect-4/3 w-full overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(min-width: 1024px) 360px, (min-width: 640px) 45vw, 90vw"
          className="object-cover transition-transform duration-700 ease-(--ease-premium) group-hover:scale-[1.06]"
        />
      </div>
      <div className="p-5 transition-transform duration-500 ease-(--ease-premium) group-hover:-translate-y-0.5">
        <h3 className="text-base font-semibold text-ink-900 transition-colors duration-300 group-hover:text-primary-700">
          {name}
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-ink-700">{description}</p>
        {isInteractive && (
          <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary-700 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            View Details
            <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </span>
        )}
      </div>
    </Card>
  );

  if (!isInteractive) {
    return content;
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="block h-full w-full cursor-pointer text-left"
      aria-label={`View details for ${name}`}
    >
      {content}
    </button>
  );
}
