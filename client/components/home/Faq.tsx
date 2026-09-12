import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { FaqAccordion } from "@/components/shared/FaqAccordion";
import { getWhatsappLink } from "@/lib/whatsapp";
import { FAQS } from "@/constants/faqs";

export function Faq() {
  return (
    <Section id="faq" background="sage">
      <Reveal className="mx-auto max-w-2xl text-center">
        <Eyebrow>Common Questions</Eyebrow>
        <h2 className="mt-4 text-3xl leading-tight font-semibold text-ink-900 sm:text-4xl">
          Frequently asked questions.
        </h2>
        <p className="mt-4 text-base text-ink-700">
          Can&apos;t find your answer here?{" "}
          <Link
            href={getWhatsappLink("Hi, I have a question that wasn't in your FAQ.")}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary-700 underline underline-offset-4 hover:text-primary-800"
          >
            Ask us on WhatsApp
          </Link>
          .
        </p>
      </Reveal>

      <FaqAccordion items={FAQS} />
    </Section>
  );
}
