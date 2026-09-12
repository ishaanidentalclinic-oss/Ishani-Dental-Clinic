"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useIsMounted } from "@/hooks/useIsMounted";
import { ReceptionistBookingForm } from "@/components/admin/ReceptionistBookingForm";
import type { AdminAppointment } from "@/types/admin";

interface ReceptionistBookingModalProps {
  open: boolean;
  initialName?: string;
  initialPhone?: string;
  initialEmail?: string;
  onBooked: (appointment: AdminAppointment) => void;
  onClose: () => void;
}

export function ReceptionistBookingModal({
  open,
  initialName,
  initialPhone,
  initialEmail,
  onBooked,
  onClose,
}: ReceptionistBookingModalProps) {
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
            aria-labelledby="receptionist-booking-title"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-card bg-white p-6 shadow-float sm:p-8"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full text-ink-700 hover:bg-black/5"
            >
              <X size={18} />
            </button>

            <h2 id="receptionist-booking-title" className="pr-8 text-xl font-semibold text-ink-900">
              New Appointment
            </h2>
            <p className="mt-1 text-sm text-ink-700">
              Uses the exact same scheduling engine as the website&apos;s booking form.
            </p>

            <div className="mt-6">
              <ReceptionistBookingForm
                initialName={initialName}
                initialPhone={initialPhone}
                initialEmail={initialEmail}
                onBooked={onBooked}
                onCancel={onClose}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
