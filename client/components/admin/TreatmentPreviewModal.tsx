"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { X } from "lucide-react";
import { useIsMounted } from "@/hooks/useIsMounted";
import { TreatmentDetailContent } from "@/components/treatments/TreatmentDetailContent";
import type { TreatmentFaq, TreatmentProcedureStep } from "@/types/admin";

export interface TreatmentPreviewData {
  name: string;
  overview: string;
  bannerImage: string;
  benefits: string[];
  idealFor: string[];
  duration: string;
  recovery: string;
  procedure: TreatmentProcedureStep[];
  faqs: TreatmentFaq[];
  relatedTreatments: { name: string; slug: string }[];
}

export function TreatmentPreviewModal({
  open,
  treatment,
  onClose,
}: {
  open: boolean;
  treatment: TreatmentPreviewData;
  onClose: () => void;
}) {
  const mounted = useIsMounted();

  useEffect(() => {
    if (!open) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-100 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div
            className="absolute inset-0 bg-ink-900/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="treatment-preview-title"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-card bg-white p-6 shadow-float sm:p-8"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close preview"
              className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full text-ink-900 shadow-card hover:bg-black/5"
            >
              <X size={18} />
            </button>

            {treatment.bannerImage && (
              <div className="relative aspect-video w-full overflow-hidden rounded-card">
                <Image src={treatment.bannerImage} alt="" fill className="object-cover" unoptimized />
              </div>
            )}

            <div className={treatment.bannerImage ? "mt-6" : ""}>
              <TreatmentDetailContent
                titleId="treatment-preview-title"
                name={treatment.name || "Untitled treatment"}
                overview={treatment.overview}
                benefits={treatment.benefits}
                idealFor={treatment.idealFor}
                duration={treatment.duration}
                recovery={treatment.recovery}
                procedure={treatment.procedure}
                faqs={treatment.faqs}
                relatedTreatments={treatment.relatedTreatments}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
