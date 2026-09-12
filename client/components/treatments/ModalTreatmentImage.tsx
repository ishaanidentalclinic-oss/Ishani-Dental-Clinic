"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

const zoomVariants: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1.035, transition: { duration: 0.7, ease: EASE } },
};

const sweepVariants: Variants = {
  rest: { x: "-130%" },
  hover: { x: "230%", transition: { duration: 0.9, ease: "easeInOut" } },
};

interface ModalTreatmentImageProps {
  src: string;
  alt: string;
}

export function ModalTreatmentImage({ src, alt }: ModalTreatmentImageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 14 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      className="relative aspect-video w-full shrink-0 overflow-hidden rounded-t-card transition-shadow duration-500 hover:shadow-float"
    >
      <motion.div initial="rest" whileHover="hover" animate="rest" className="absolute inset-0">
        <motion.div
          variants={zoomVariants}
          className="absolute inset-0 transition-[filter] duration-500 hover:brightness-105"
        >
          <Image src={src} alt={alt} fill sizes="(min-width: 768px) 672px, 100vw" className="object-cover" priority />
        </motion.div>

        <motion.div
          variants={sweepVariants}
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent"
        />
      </motion.div>
    </motion.div>
  );
}
