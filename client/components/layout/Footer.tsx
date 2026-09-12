"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Mail, MapPin, MessageCircle, Phone, Star } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { StaggerGroup, StaggerItem } from "@/components/ui/StaggerGroup";
import { getWhatsappLink } from "@/lib/whatsapp";
import { fetchPublicSiteSettings } from "@/lib/publicSettings";
import { fetchPublicTreatments } from "@/lib/publicTreatments";
import { SITE, NAV_LINKS } from "@/constants/site";
import type { SiteSettings } from "@/types/admin";
import type { PublicTreatment } from "@/types/treatment";

export function Footer() {
  const year = new Date().getFullYear();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [treatments, setTreatments] = useState<PublicTreatment[]>([]);

  useEffect(() => {
    let ignore = false;
    fetchPublicSiteSettings().then((data) => {
      if (!ignore) setSettings(data);
    });
    fetchPublicTreatments().then((data) => {
      if (!ignore) setTreatments(data);
    });
    return () => {
      ignore = true;
    };
  }, []);

  const address = settings?.contact.address || SITE.address;
  const phone = settings?.contact.phone || SITE.phone;
  const email = settings?.contact.email || SITE.email;
  const whatsappNumber = settings?.contact.whatsappNumber || SITE.whatsappNumber;
  const googleReviewsUrl = settings?.contact.googleReviewsUrl || SITE.googleReviewsUrl;
  const aboutBlurb = settings?.footer.about || `${SITE.fullName}. Patient-centered dental care, built on prevention and precision.`;

  const SOCIAL_LINKS = [
    {
      id: "whatsapp",
      label: "Chat on WhatsApp",
      icon: MessageCircle,
      href: getWhatsappLink("Hi, I'd like to get in touch.", whatsappNumber),
    },
    {
      id: "google",
      label: "Read our Google reviews",
      icon: Star,
      href: googleReviewsUrl,
    },
  ] as const;

  const CONTACT_LINES = [
    { id: "address", icon: MapPin, value: address, href: undefined },
    { id: "phone", icon: Phone, value: phone, href: `tel:${phone.replace(/\s+/g, "")}` },
    { id: "email", icon: Mail, value: email, href: `mailto:${email}` },
  ] as const;

  return (
    <footer className="relative bg-primary-950">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary-300/50 to-transparent" />

      <Container>
        <StaggerGroup className="grid gap-12 pt-24 pb-16 sm:grid-cols-2 lg:grid-cols-4">
          <StaggerItem className="max-w-xs">
            <Logo className="text-white" />
            <p className="mt-4 text-sm leading-relaxed text-white/60">{aboutBlurb}</p>
            <div className="mt-5 flex gap-3">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.id}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-primary-200 transition-colors duration-200 hover:bg-primary-700 hover:text-white"
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </StaggerItem>

          <StaggerItem>
            <h3 className="text-sm font-semibold tracking-wide text-primary-200 uppercase">
              Explore
            </h3>
            <nav aria-label="Footer navigation" className="mt-5 flex flex-col gap-3">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group inline-flex w-fit items-center text-sm text-white/70 transition-colors hover:text-white"
                >
                  {link.label}
                  <span className="ml-0 max-w-0 overflow-hidden opacity-0 transition-all duration-300 group-hover:ml-1.5 group-hover:max-w-4 group-hover:opacity-100">
                    →
                  </span>
                </Link>
              ))}
            </nav>
          </StaggerItem>

          <StaggerItem>
            <h3 className="text-sm font-semibold tracking-wide text-primary-200 uppercase">
              Treatments
            </h3>
            <nav aria-label="Treatments" className="mt-5 flex flex-col gap-3">
              {treatments.slice(0, 4).map((treatment) => (
                <Link
                  key={treatment._id}
                  href={`/treatments/${treatment.slug}`}
                  className="w-fit text-sm text-white/70 transition-colors hover:text-white"
                >
                  {treatment.name}
                </Link>
              ))}
            </nav>
          </StaggerItem>

          <StaggerItem>
            <h3 className="text-sm font-semibold tracking-wide text-primary-200 uppercase">
              Contact
            </h3>
            <div className="mt-5 flex flex-col gap-4">
              {CONTACT_LINES.map((line) => {
                const content = (
                  <span className="flex items-start gap-2.5 text-sm text-white/70">
                    <line.icon size={16} className="mt-0.5 shrink-0 text-primary-300" />
                    <span className="min-w-0 break-words">{line.value}</span>
                  </span>
                );
                return line.href ? (
                  <a
                    key={line.id}
                    href={line.href}
                    className="w-full transition-colors hover:text-white"
                  >
                    {content}
                  </a>
                ) : (
                  <div key={line.id}>{content}</div>
                );
              })}
            </div>
          </StaggerItem>
        </StaggerGroup>

        <div className="border-t border-white/10 py-6 text-center">
          <p className="text-xs text-white/50">
            © {year} {SITE.name}. All rights reserved.
          </p>
          <p className="mt-1.5 text-[11px] text-white/30">
            Designed &amp; Developed by{" "}
            <span className="transition-colors duration-200 hover:text-white/60">SynergexAI</span>
          </p>
          <a
            href={`mailto:${SITE.footerEmail}`}
            className="mt-1 block text-[11px] text-white/30 transition-colors duration-200 hover:text-white/60"
          >
            {SITE.footerEmail}
          </a>
        </div>
      </Container>
    </footer>
  );
}
