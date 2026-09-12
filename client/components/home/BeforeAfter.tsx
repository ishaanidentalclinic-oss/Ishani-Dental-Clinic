"use client";

import { useState, type KeyboardEvent } from "react";
import ReactCompareImage from "react-compare-image";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { CompareHandle } from "@/components/home/CompareHandle";
import { fadeScale } from "@/motion/variants";
import { cn } from "@/lib/cn";
import { RESULT_SHOWCASES } from "@/constants/results";

const KEYBOARD_STEP = 5;

export function BeforeAfter() {
  const [activeId, setActiveId] = useState(RESULT_SHOWCASES[0].id);
  const active = RESULT_SHOWCASES.find((r) => r.id === activeId) ?? RESULT_SHOWCASES[0];

  return (
    <Section id="results" background="white">
      <Reveal className="mx-auto max-w-2xl text-center">
        <Eyebrow>Real Results</Eyebrow>
        <h2 className="mt-4 text-3xl leading-tight font-semibold text-ink-900 sm:text-4xl">
          Before &amp; After — see the <span className="text-primary-600">difference</span>.
        </h2>
        <p className="mt-4 text-base text-ink-700">
          Drag the slider to reveal each transformation.
        </p>
      </Reveal>

      <Reveal className="mt-8 flex flex-wrap justify-center gap-3">
        {RESULT_SHOWCASES.map((showcase) => (
          <button
            key={showcase.id}
            type="button"
            onClick={() => setActiveId(showcase.id)}
            className={cn(
              "rounded-pill px-5 py-2 text-sm font-medium transition-colors duration-200",
              showcase.id === activeId
                ? "bg-primary-700 text-white"
                : "border border-black/10 text-ink-900 hover:border-primary-300",
            )}
          >
            {showcase.label}
          </button>
        ))}
      </Reveal>

      <CompareSlider
        key={active.id}
        beforeImage={active.beforeImage}
        afterImage={active.afterImage}
        label={active.label}
      />
    </Section>
  );
}

interface CompareSliderProps {
  beforeImage: string;
  afterImage: string;
  label: string;
}

function CompareSlider({ beforeImage, afterImage, label }: CompareSliderProps) {
  // Percentage (0-100) position of the divider. react-compare-image only reads its
  // `sliderPositionPercentage` prop on mount, so keyboard nudges force a remount
  // (via `renderKey`) to actually move it — dragging stays smooth and uncoupled from this.
  const [position, setPosition] = useState(50);
  const [renderKey, setRenderKey] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const commitPosition = (next: number) => {
    setPosition(Math.min(100, Math.max(0, next)));
    setRenderKey((key) => key + 1);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case "ArrowLeft":
        event.preventDefault();
        commitPosition(position - KEYBOARD_STEP);
        break;
      case "ArrowRight":
        event.preventDefault();
        commitPosition(position + KEYBOARD_STEP);
        break;
      case "Home":
        event.preventDefault();
        commitPosition(0);
        break;
      case "End":
        event.preventDefault();
        commitPosition(100);
        break;
      default:
        break;
    }
  };

  return (
    <Reveal
      variants={fadeScale}
      role="slider"
      tabIndex={0}
      aria-label={`Before and after comparison — ${label}`}
      aria-valuenow={Math.round(position)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-orientation="horizontal"
      aria-valuetext={`${Math.round(position)}% before, ${100 - Math.round(position)}% after`}
      onKeyDown={handleKeyDown}
      onPointerDown={() => setIsDragging(true)}
      onPointerUp={() => setIsDragging(false)}
      onPointerLeave={() => setIsDragging(false)}
      onPointerCancel={() => setIsDragging(false)}
      className="relative mx-auto mt-10 w-full max-w-3xl overflow-hidden rounded-card shadow-card outline-none focus-visible:ring-4 focus-visible:ring-primary-400/40"
    >
      <ReactCompareImage
        key={renderKey}
        leftImage={beforeImage}
        rightImage={afterImage}
        leftImageAlt={`${label} — before`}
        rightImageAlt={`${label} — after`}
        sliderPositionPercentage={position / 100}
        onSliderPositionChange={(value) => setPosition(value * 100)}
        sliderLineColor="#ffffff"
        sliderLineWidth={3}
        handleSize={48}
        handle={<CompareHandle isActive={isDragging} />}
      />

      <span className="pointer-events-none absolute top-5 left-5 rounded-pill bg-ink-900/70 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-white uppercase backdrop-blur-sm">
        Before
      </span>
      <span className="pointer-events-none absolute top-5 right-5 rounded-pill bg-primary-700/85 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-white uppercase backdrop-blur-sm">
        After
      </span>
    </Reveal>
  );
}
