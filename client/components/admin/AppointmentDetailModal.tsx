"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useIsMounted } from "@/hooks/useIsMounted";
import { AppointmentStatusBadge } from "@/components/admin/AppointmentStatusBadge";
import { formatDateOnlyDisplay } from "@/lib/dateOnly";
import type { AdminAppointment } from "@/types/admin";

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}

function formatDate(value: string) {
  return formatDateOnlyDisplay(value, { day: "numeric", month: "long", year: "numeric" });
}

interface DetailRowProps {
  label: string;
  value: React.ReactNode;
}

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <div>
      <dt className="text-xs font-medium tracking-wide text-ink-700 uppercase">{label}</dt>
      <dd className="mt-1 text-sm text-ink-900">{value}</dd>
    </div>
  );
}

export function AppointmentDetailModal({
  appointment,
  onClose,
}: {
  appointment: AdminAppointment | null;
  onClose: () => void;
}) {
  const mounted = useIsMounted();

  useEffect(() => {
    if (!appointment) return;

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
  }, [appointment, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {appointment && (
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
            aria-labelledby="appointment-detail-title"
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

            <h2 id="appointment-detail-title" className="pr-8 text-xl font-semibold text-ink-900">
              {appointment.name}
            </h2>
            <div className="mt-2">
              <AppointmentStatusBadge status={appointment.status} />
            </div>

            <dl className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <DetailRow
                label="Phone"
                value={
                  <a href={`tel:${appointment.phone}`} className="hover:text-primary-700">
                    {appointment.phone}
                  </a>
                }
              />
              <DetailRow
                label="Email"
                value={
                  appointment.email ? (
                    <a href={`mailto:${appointment.email}`} className="hover:text-primary-700">
                      {appointment.email}
                    </a>
                  ) : (
                    <span className="text-ink-700/60">Not provided</span>
                  )
                }
              />
              <DetailRow label="Treatment" value={appointment.treatment} />
              <DetailRow label="Preferred Date" value={formatDate(appointment.preferredDate)} />
              <DetailRow label="Preferred Time" value={appointment.preferredTime} />
              <DetailRow label="Booked On" value={formatDateTime(appointment.createdAt)} />
            </dl>

            <div className="mt-5">
              <p className="text-xs font-medium tracking-wide text-ink-700 uppercase">
                Additional Notes
              </p>
              <p className="mt-1.5 rounded-xl bg-sage-50 p-4 text-sm leading-relaxed text-ink-900">
                {appointment.message || "No additional notes provided."}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
