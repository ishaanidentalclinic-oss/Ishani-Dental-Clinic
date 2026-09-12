"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as const;

const cardVariants: Variants = {
  rest: {
    y: 0,
    boxShadow: "0 4px 24px rgb(11 44 38 / 0.06)",
    borderColor: "rgba(157, 216, 192, 0)",
  },
  hover: {
    y: -9,
    boxShadow: "0 22px 45px rgb(11 44 38 / 0.18)",
    borderColor: "rgba(157, 216, 192, 1)",
    transition: { duration: 0.6, ease: EASE },
  },
};

const imageVariants: Variants = {
  rest: { scale: 1, y: 0 },
  hover: { scale: 1.045, y: -6, transition: { duration: 0.7, ease: EASE } },
};

const overlayVariants: Variants = {
  rest: { opacity: 0 },
  hover: { opacity: 1, transition: { duration: 0.5, ease: EASE, delay: 0.04 } },
};

const titleVariants: Variants = {
  rest: { color: "#16232a" },
  hover: { color: "#145043", transition: { duration: 0.4, ease: EASE } },
};

const descriptionVariants: Variants = {
  rest: { y: 0 },
  hover: { y: -3, transition: { duration: 0.5, ease: EASE, delay: 0.04 } },
};

const detailsVariants: Variants = {
  rest: { opacity: 0, x: -6 },
  hover: { opacity: 1, x: 0, transition: { duration: 0.4, ease: EASE, delay: 0.14 } },
};

interface TreatmentDetailCardProps {
  image: string;
  name: string;
  description: string;
  onClick: () => void;
}

export function TreatmentDetailCard({ image, name, description, onClick }: TreatmentDetailCardProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial="rest"
      whileHover="hover"
      animate="rest"
      aria-label={`View details for ${name}`}
      className="block h-full w-full cursor-pointer text-left"
    >
      <motion.div
        variants={cardVariants}
        className="h-full overflow-hidden rounded-card border bg-white"
      >
        <div className="relative aspect-4/3 w-full overflow-hidden">
          <motion.div variants={imageVariants} className="absolute inset-0">
            <Image
              src={image}
              alt={name}
              fill
              sizes="(min-width: 1024px) 360px, (min-width: 640px) 45vw, 90vw"
              className="object-cover"
            />
          </motion.div>
          <motion.div
            variants={overlayVariants}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-900/45 via-ink-900/5 to-transparent"
          />
        </div>

        <div className="p-5">
          <motion.h3 variants={titleVariants} className="text-base font-semibold">
            {name}
          </motion.h3>
          <motion.p variants={descriptionVariants} className="mt-1.5 text-sm leading-relaxed text-ink-700">
            {description}
          </motion.p>
          <motion.span
            variants={detailsVariants}
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary-700"
          >
            View Details
            <ArrowRight size={14} />
          </motion.span>
        </div>
      </motion.div>
    </motion.button>
  );
}
