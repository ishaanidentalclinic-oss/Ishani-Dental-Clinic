"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useHashLinkClick } from "@/hooks/useHashLinkClick";

const APPOINTMENT_HREF = "/contact#appointment";

export function HeroCta() {
  const hashClick = useHashLinkClick();

  return (
    <Link
      href={APPOINTMENT_HREF}
      onClick={hashClick(APPOINTMENT_HREF)}
      className="group inline-flex items-center gap-3 rounded-full bg-white py-1.5 pr-1.5 pl-6 text-sm font-medium text-ink-900 shadow-float transition-transform duration-200 hover:scale-[1.02]"
    >
      Get Started
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-whatsapp text-white transition-transform duration-200 group-hover:translate-x-0.5">
        <ArrowRight size={16} />
      </span>
    </Link>
  );
}
