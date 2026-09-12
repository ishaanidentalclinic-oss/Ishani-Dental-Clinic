"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { getWhatsappLink } from "@/lib/whatsapp";

export function WhatsappFab() {
  return (
    <motion.div
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      className="fixed right-5 bottom-5 z-40 sm:right-6 sm:bottom-6"
    >
      <Link
        href={getWhatsappLink("Hi, I'd like to know more about your treatments.")}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-float transition-transform duration-300 hover:scale-110"
      >
        <motion.span
          aria-hidden="true"
          initial={{ scale: 1, opacity: 0.55 }}
          animate={{ scale: [1, 1.7, 1.7], opacity: [0.55, 0, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, ease: "easeOut" }}
          className="absolute inset-0 rounded-full bg-whatsapp"
        />
        <WhatsAppIcon size={28} className="relative" />
      </Link>
    </motion.div>
  );
}
