"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { X } from "lucide-react";
import { useIsMounted } from "@/hooks/useIsMounted";
import { Badge } from "@/components/ui/Badge";
import type { BlogSection } from "@/types/admin";

export interface BlogPreviewData {
  title: string;
  category: string;
  author: string;
  readTime: string;
  coverImage: string;
  sections: BlogSection[];
}

export function BlogPreviewModal({
  open,
  blog,
  onClose,
}: {
  open: boolean;
  blog: BlogPreviewData;
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
            aria-labelledby="blog-preview-title"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 max-h-[88vh] w-full max-w-3xl overflow-y-auto rounded-card bg-white p-6 shadow-float sm:p-10"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close preview"
              className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full text-ink-700 hover:bg-black/5"
            >
              <X size={18} />
            </button>

            {blog.category && <Badge>{blog.category}</Badge>}
            <h1
              id="blog-preview-title"
              className="mt-4 text-2xl leading-tight font-semibold text-ink-900 sm:text-3xl"
            >
              {blog.title || "Untitled post"}
            </h1>
            <p className="mt-3 text-sm text-ink-700">
              {[blog.author, blog.readTime].filter(Boolean).join(" · ")}
            </p>

            {blog.coverImage && (
              <div className="relative mt-8 aspect-video w-full overflow-hidden rounded-card">
                <Image src={blog.coverImage} alt="" fill className="object-cover" unoptimized />
              </div>
            )}

            <div className="mt-8">
              {blog.sections.map((section, index) => (
                <div key={index} className={index > 0 ? "mt-8" : ""}>
                  {section.heading && (
                    <h2 className="text-xl font-semibold text-ink-900">{section.heading}</h2>
                  )}
                  {section.paragraphs?.map((paragraph, pIndex) => (
                    <p
                      key={pIndex}
                      className={`text-base leading-relaxed text-ink-700 ${
                        section.heading || pIndex > 0 ? "mt-4" : ""
                      }`}
                    >
                      {paragraph}
                    </p>
                  ))}
                  {section.bullets && section.bullets.length > 0 && (
                    <ul className="mt-4 space-y-2.5">
                      {section.bullets.map((bullet, bIndex) => (
                        <li key={bIndex} className="flex items-start gap-2.5 text-base text-ink-700">
                          <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-600" />
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
