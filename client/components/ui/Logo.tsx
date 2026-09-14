import Link from "next/link";
import { cn } from "@/lib/cn";
import { SITE } from "@/constants/site";

interface LogoProps {
  className?: string;
  href?: string;
  onClick?: () => void;
}

export function Logo({ className, href = "/", onClick }: LogoProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn("flex items-center gap-2 font-serif text-xl font-semibold", className)}
      aria-label={`${SITE.name} — Home`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="h-7 w-7 shrink-0"
        aria-hidden="true"
      >
        <path
          d="M12 3c-1.6 0-2.6.8-3.5.8-1 0-2-.8-3.3-.8C3.2 3 2 4.7 2 7.2c0 2.8 1.2 6 2.1 8.4.8 2 1.5 4.1 2.8 4.1 1.2 0 1.4-.8 2.1-3 .5-1.5.8-2.5 1-2.5s.5 1 1 2.5c.7 2.2.9 3 2.1 3 1.3 0 2-2.1 2.8-4.1.9-2.4 2.1-5.6 2.1-8.4C18 4.7 16.8 3 14.8 3c-1.3 0-2.3.8-3.3.8-.5 0-.9-.2-1.5-.8Z"
          fill="currentColor"
        />
      </svg>
      <span>{SITE.shortName}</span>
    </Link>
  );
}
