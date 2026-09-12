"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useAnimationFrame, useMotionValue } from "framer-motion";
import { cn } from "@/lib/cn";

interface MarqueeProps {
  /** Render the content to be looped ONCE — Marquee duplicates it internally. */
  children: ReactNode;
  /** Scroll speed in pixels per second. */
  speed?: number;
  className?: string;
}

/**
 * Infinite, draggable, auto-scrolling row. Pauses on hover, supports mouse drag and
 * touch swipe, and loops seamlessly by measuring one copy of the (duplicated) track
 * and wrapping the position modulo that width.
 */
export function Marquee({ children, speed = 40, className }: MarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [setWidth, setSetWidth] = useState(0);
  const x = useMotionValue(0);
  const [isPaused, setIsPaused] = useState(false);
  const isDraggingRef = useRef(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const measure = () => setSetWidth(track.scrollWidth / 2);
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  useAnimationFrame((_, delta) => {
    if (!setWidth) return;

    let next = x.get();
    if (!isPaused && !isDraggingRef.current) {
      next -= (speed * delta) / 1000;
    }
    if (next <= -setWidth) next += setWidth;
    if (next > 0) next -= setWidth;
    if (next !== x.get()) x.set(next);
  });

  return (
    <div
      className={cn("overflow-hidden", className)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <motion.div
        ref={trackRef}
        style={{ x }}
        drag="x"
        dragElastic={0.05}
        dragMomentum={false}
        onDragStart={() => {
          isDraggingRef.current = true;
        }}
        onDragEnd={() => {
          isDraggingRef.current = false;
        }}
        className="flex w-max cursor-grab touch-pan-y gap-6 select-none active:cursor-grabbing"
      >
        <div key="set-a" style={{ display: "contents" }}>
          {children}
        </div>
        <div key="set-b" style={{ display: "contents" }} aria-hidden="true">
          {children}
        </div>
      </motion.div>
    </div>
  );
}
