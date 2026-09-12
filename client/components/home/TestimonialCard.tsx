"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { InitialsAvatar } from "@/components/ui/InitialsAvatar";
import type { Testimonial } from "@/types";

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="group w-[320px] shrink-0 sm:w-[360px]"
    >
      <Card className="relative flex h-full flex-col p-6">
        <p className="flex-1 text-sm leading-relaxed text-ink-700">
          &ldquo;{testimonial.quote}&rdquo;
        </p>
        <div className="mt-6 flex items-center gap-3 border-t border-black/5 pt-4">
          <InitialsAvatar name={testimonial.name} />
          <div>
            <p className="text-sm font-semibold text-ink-900">{testimonial.name}</p>
            <p className="text-xs text-ink-700 opacity-60 transition-opacity duration-300 group-hover:opacity-100">
              Verified Google Review
            </p>
          </div>
        </div>
        <Quote
          size={28}
          className="absolute right-6 bottom-6 text-primary-100 transition-transform duration-300 ease-(--ease-premium) group-hover:scale-110 group-hover:-rotate-6"
          fill="currentColor"
        />
      </Card>
    </motion.div>
  );
}
