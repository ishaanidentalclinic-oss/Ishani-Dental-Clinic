"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { sectionReveal, staggerContainer, staggerItem } from "@/motion/variants";

interface StaggerGroupProps extends Omit<HTMLMotionProps<"div">, "children"> {
  staggerChildren?: number;
  /** Extra delay before the first child starts, useful for cascading after sibling elements. */
  delayChildren?: number;
  children: React.ReactNode;
}

export function StaggerGroup({
  staggerChildren = 0.12,
  delayChildren = 0,
  children,
  ...props
}: StaggerGroupProps) {
  return (
    <motion.div
      {...sectionReveal}
      variants={staggerContainer(staggerChildren, delayChildren)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  ...props
}: Omit<HTMLMotionProps<"div">, "children"> & { children: React.ReactNode }) {
  return (
    <motion.div variants={staggerItem} {...props}>
      {children}
    </motion.div>
  );
}
