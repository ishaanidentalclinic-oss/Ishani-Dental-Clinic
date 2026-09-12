"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useIsMounted } from "@/hooks/useIsMounted";
import { ContactStatusBadge } from "@/components/admin/ContactStatusBadge";
import type { AdminContact } from "@/types/admin";

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
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

export function ContactDetailModal({
  contact,
  onClose,
}: {
  contact: AdminContact | null;
  onClose: () => void;
}) {
  const mounted = useIsMounted();

  useEffect(() => {
    if (!contact) return;

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
  }, [contact, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {contact && (
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
            aria-labelledby="contact-detail-title"
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

            <h2 id="contact-detail-title" className="pr-8 text-xl font-semibold text-ink-900">
              {contact.name}
            </h2>
            <div className="mt-2">
              <ContactStatusBadge status={contact.status} />
            </div>

            <dl className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <DetailRow
                label="Email"
                value={
                  <a href={`mailto:${contact.email}`} className="hover:text-primary-700">
                    {contact.email}
                  </a>
                }
              />
              {contact.phone && (
                <DetailRow
                  label="Phone"
                  value={
                    <a href={`tel:${contact.phone}`} className="hover:text-primary-700">
                      {contact.phone}
                    </a>
                  }
                />
              )}
              <DetailRow label="Subject" value={contact.subject || "—"} />
              <DetailRow label="Received On" value={formatDateTime(contact.createdAt)} />
            </dl>

            <div className="mt-5">
              <p className="text-xs font-medium tracking-wide text-ink-700 uppercase">Message</p>
              <p className="mt-1.5 rounded-xl bg-sage-50 p-4 text-sm leading-relaxed whitespace-pre-line text-ink-900">
                {contact.message}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
