import Link from "next/link";
import { Clock3, MapPin, MessageCircle, Phone, Star } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/ui/StaggerGroup";
import { getWhatsappLink } from "@/lib/whatsapp";
import { SITE } from "@/constants/site";

const TRUST_ITEMS = [
  { id: "response", icon: Clock3, label: "Usually replies within one business day" },
  { id: "location", icon: MapPin, label: "Pune, Maharashtra" },
  {
    id: "reviews",
    icon: Star,
    label: "Google Reviews",
    href: SITE.googleReviewsUrl,
  },
] as const;

export function ContactHero() {
  return (
    <Section background="white" className="relative overflow-hidden pt-28 pb-10 md:pt-32 md:pb-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-100/60 blur-3xl"
      />

      <div className="mx-auto max-w-2xl text-center">
        <Reveal>
          <Eyebrow>Contact</Eyebrow>
        </Reveal>

        <Reveal delay={0.05}>
          <h1 className="mt-4 text-4xl leading-tight font-semibold text-ink-900 sm:text-5xl">
            Get in touch.
          </h1>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mx-auto mt-4 max-w-md text-base text-ink-700">
            Whether you&apos;re booking an appointment, asking about a treatment, or just
            have a question — we&apos;d love to hear from you.
          </p>
        </Reveal>

        <StaggerGroup className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <StaggerItem>
            <Button variant="outline" href={SITE.phoneHref}>
              <Phone size={16} />
              Call Us
            </Button>
          </StaggerItem>
          <StaggerItem>
            <Button
              variant="outline"
              href={getWhatsappLink("Hi, I'd like to get in touch.")}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle size={16} />
              WhatsApp
            </Button>
          </StaggerItem>
        </StaggerGroup>

        <StaggerGroup className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {TRUST_ITEMS.map((item) => {
            const content = (
              <span className="flex items-center gap-1.5 text-xs text-ink-700">
                <item.icon size={14} className="shrink-0 text-primary-600" />
                {item.label}
              </span>
            );
            return (
              <StaggerItem key={item.id}>
                {"href" in item ? (
                  <Link
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-primary-700"
                  >
                    {content}
                  </Link>
                ) : (
                  content
                )}
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </div>
    </Section>
  );
}
