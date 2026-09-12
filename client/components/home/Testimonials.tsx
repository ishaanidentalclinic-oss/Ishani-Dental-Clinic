import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { Marquee } from "@/components/ui/Marquee";
import { TestimonialCard } from "@/components/home/TestimonialCard";
import { TESTIMONIALS } from "@/constants/testimonials";
import { SITE } from "@/constants/site";

export function Testimonials() {
  return (
    <Section background="sage">
      <Reveal id="testimonials" className="mx-auto max-w-2xl scroll-mt-24 text-center">
        <Eyebrow>Patient Stories</Eyebrow>
        <h2 className="mt-4 text-3xl leading-tight font-semibold text-ink-900 sm:text-4xl">
          Words from the people whose smiles we&apos;ve{" "}
          <span className="text-primary-600">changed</span>.
        </h2>
      </Reveal>

      <Reveal delay={0.15} className="mt-14 -mx-6 md:-mx-8 lg:-mx-12">
        <Marquee speed={32} className="px-6 py-2 md:px-8 lg:px-12">
          {TESTIMONIALS.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </Marquee>
      </Reveal>

      <Reveal className="mt-10 text-center">
        <Link
          href={SITE.googleReviewsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-primary-700 underline underline-offset-4 hover:text-primary-800"
        >
          Read more reviews on Google →
        </Link>
      </Reveal>
    </Section>
  );
}
