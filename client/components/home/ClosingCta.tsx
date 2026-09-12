"use client";

import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { StaggerGroup, StaggerItem } from "@/components/ui/StaggerGroup";
import { useHashLinkClick } from "@/hooks/useHashLinkClick";
import { getWhatsappLink } from "@/lib/whatsapp";
import { buttonHover, buttonTap } from "@/motion/variants";

const APPOINTMENT_HREF = "/contact#appointment";
const WHATSAPP_MESSAGE = "Hello, I would like to book an appointment at Ishaani Dental Clinic.";

const TRUST_ITEMS = [
  "19+ Years of Clinical Experience",
  "Personalized Care",
  "Advanced Implant & Laser Dentistry",
];

export function ClosingCta() {
  const hashClick = useHashLinkClick();

  return (
    <section className="bg-white py-24 md:py-32">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <h2 className="text-3xl leading-tight font-semibold text-ink-900 sm:text-4xl">
              Ready to Smile with Confidence?
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-ink-700">
              Take the first step toward healthier teeth with personalized care, advanced
              technology, and experienced specialists at Ishaani Dental Clinic.
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <motion.div
                whileHover={buttonHover}
                whileTap={buttonTap}
                className="w-full sm:w-auto"
              >
                <Button
                  href={APPOINTMENT_HREF}
                  onClick={hashClick(APPOINTMENT_HREF)}
                  className="w-full sm:w-auto"
                >
                  Book Appointment
                </Button>
              </motion.div>

              <motion.div
                whileHover={buttonHover}
                whileTap={buttonTap}
                className="w-full sm:w-auto"
              >
                <Button
                  href={getWhatsappLink(WHATSAPP_MESSAGE)}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="whatsapp"
                  className="w-full sm:w-auto"
                >
                  <WhatsAppIcon size={18} />
                  Book via WhatsApp
                </Button>
              </motion.div>
            </div>
          </Reveal>

          <StaggerGroup
            delayChildren={0.3}
            className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-2"
          >
            {TRUST_ITEMS.map((label) => (
              <StaggerItem key={label} className="flex items-center gap-2 text-sm text-ink-700">
                <Check size={15} className="shrink-0 text-primary-600" />
                {label}
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </Container>
    </section>
  );
}
