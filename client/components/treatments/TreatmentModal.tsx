"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useIsMounted } from "@/hooks/useIsMounted";
import { ModalTreatmentImage } from "@/components/treatments/ModalTreatmentImage";
import { TreatmentDetailContent } from "@/components/treatments/TreatmentDetailContent";
import type { PublicTreatment } from "@/types/treatment";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

interface TreatmentModalProps {
  treatment: PublicTreatment | null;
  allTreatments: PublicTreatment[];
  onClose: () => void;
  onNavigate: (treatment: PublicTreatment) => void;
}

export function TreatmentModal({
  treatment,
  allTreatments,
  onClose,
  onNavigate,
}: TreatmentModalProps) {
  const mounted = useIsMounted();
  const modalRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const isOpen = treatment !== null;

  const currentIndex = treatment
    ? allTreatments.findIndex((t) => t._id === treatment._id)
    : -1;
  const prevTreatment =
    currentIndex > 0 ? allTreatments[currentIndex - 1] : allTreatments[allTreatments.length - 1];
  const nextTreatment = currentIndex >= 0 ? allTreatments[(currentIndex + 1) % allTreatments.length] : null;

  function handleRelatedSelect(slug: string) {
    const match = allTreatments.find((t) => t.slug === slug);
    if (match) onNavigate(match);
  }

  // Scroll lock + focus save/restore — runs only on the open/closed transition,
  // not on every in-modal navigation (which would otherwise yank focus back out).
  useEffect(() => {
    if (!isOpen) return;

    previouslyFocused.current = document.activeElement as HTMLElement;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const frame = requestAnimationFrame(() => modalRef.current?.focus());

    return () => {
      document.body.style.overflow = originalOverflow;
      cancelAnimationFrame(frame);
      previouslyFocused.current?.focus?.();
    };
  }, [isOpen]);

  useEffect(() => {
    if (!treatment) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key === "ArrowLeft" && prevTreatment) {
        onNavigate(prevTreatment);
        return;
      }
      if (event.key === "ArrowRight" && nextTreatment) {
        onNavigate(nextTreatment);
        return;
      }
      if (event.key === "Tab") {
        const focusables = modalRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
        if (!focusables || focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [treatment, onClose, onNavigate, prevTreatment, nextTreatment]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {treatment && (
        <motion.div
          className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div
            className="absolute inset-0 bg-ink-900/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="treatment-modal-title"
            tabIndex={-1}
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-card bg-white shadow-float outline-none"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-ink-900 shadow-card transition-transform duration-200 hover:scale-110"
            >
              <X size={20} />
            </button>

            {treatment.bannerImage && (
              <ModalTreatmentImage src={treatment.bannerImage} alt={treatment.name} />
            )}

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="p-6 sm:p-8"
            >
              <TreatmentDetailContent
                titleId="treatment-modal-title"
                titleAs="h2"
                name={treatment.name}
                overview={treatment.overview}
                benefits={treatment.benefits}
                idealFor={treatment.idealFor}
                duration={treatment.duration}
                recovery={treatment.recovery}
                procedure={treatment.procedure}
                faqs={treatment.faqs}
                relatedTreatments={treatment.relatedTreatments.map((related) => ({
                  name: related.name,
                  slug: related.slug,
                }))}
                onRelatedSelect={handleRelatedSelect}
              />

              <div className="mt-8 flex items-center justify-center gap-2 border-t border-black/5 pt-6">
                <button
                  type="button"
                  onClick={() => prevTreatment && onNavigate(prevTreatment)}
                  aria-label="Previous treatment"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 text-ink-900 transition-colors duration-200 hover:border-primary-300 hover:text-primary-700"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => nextTreatment && onNavigate(nextTreatment)}
                  aria-label="Next treatment"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 text-ink-900 transition-colors duration-200 hover:border-primary-300 hover:text-primary-700"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
