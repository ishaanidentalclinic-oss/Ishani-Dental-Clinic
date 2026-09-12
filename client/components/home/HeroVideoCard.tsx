"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Pause, Play } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { fadeScale } from "@/motion/variants";

export function HeroVideoCard() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  return (
    <Reveal
      variants={fadeScale}
      delay={0.2}
      className="absolute right-6 bottom-8 z-10 hidden w-72 lg:right-12 lg:block"
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        whileHover={{ scale: 1.03, y: -4 }}
        className="group overflow-hidden rounded-card bg-white shadow-float transition-shadow duration-300 hover:shadow-xl"
      >
        <div className="relative h-36 w-full overflow-hidden">
          <video
            ref={videoRef}
            className="h-full w-full object-cover transition-transform duration-700 ease-(--ease-premium) group-hover:scale-105"
            src="/videos/hero-card.mp4"
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
          />
          <button
            type="button"
            onClick={toggle}
            aria-label={isPlaying ? "Pause video" : "Play video"}
            aria-pressed={isPlaying}
            className="absolute inset-0 flex items-center justify-center bg-ink-900/20 transition-colors duration-200 hover:bg-ink-900/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-primary-700 transition-transform duration-200 group-hover:scale-110">
              {isPlaying ? (
                <Pause size={18} fill="currentColor" />
              ) : (
                <Play size={18} className="ml-0.5" fill="currentColor" />
              )}
            </span>
          </button>
        </div>
        <div className="p-4">
          <p className="text-sm text-ink-700">
            Trusted dental professionals providing personalized treatments for brighter,
            healthier smiles.
          </p>
        </div>
      </motion.div>
    </Reveal>
  );
}
