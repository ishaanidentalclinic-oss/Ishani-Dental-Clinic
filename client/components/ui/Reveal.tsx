"use client";

import { motion, type HTMLMotionProps, type Variants } from "framer-motion";
import { fadeUp, sectionReveal } from "@/motion/variants";

interface RevealProps extends Omit<HTMLMotionProps<"div">, "children"> {
  variants?: Variants;
  delay?: number;
  children: React.ReactNode;
}

export function Reveal({ variants = fadeUp, delay = 0, children, ...props }: RevealProps) {
  const delayedVariants: Variants = delay
    ? {
        ...variants,
        visible: {
          ...variants.visible,
          transition: {
            ...(variants.visible as { transition?: object })?.transition,
            delay,
          },
        },
      }
    : variants;

  return (
    <motion.div {...sectionReveal} variants={delayedVariants} {...props}>
      {children}
    </motion.div>
  );
}
