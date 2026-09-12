import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { TreatmentDetailContent } from "@/components/treatments/TreatmentDetailContent";
import { fetchPublicTreatments, fetchPublicTreatmentBySlug } from "@/lib/publicTreatments";

interface TreatmentPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const treatments = await fetchPublicTreatments();
  return treatments.map((treatment) => ({ slug: treatment.slug }));
}

export async function generateMetadata({ params }: TreatmentPageProps): Promise<Metadata> {
  const { slug } = await params;
  const treatment = await fetchPublicTreatmentBySlug(slug);
  if (!treatment) return {};

  const title = treatment.seo.metaTitle || `${treatment.name} | Ishaani Dental Clinic`;
  const description = treatment.seo.metaDescription || treatment.shortDescription;
  const ogImage = treatment.seo.ogImageUrl || treatment.bannerImage;

  return {
    title,
    description,
    openGraph: ogImage ? { images: [{ url: ogImage }] } : undefined,
  };
}

export default async function TreatmentPage({ params }: TreatmentPageProps) {
  const { slug } = await params;
  const treatment = await fetchPublicTreatmentBySlug(slug);

  if (!treatment) {
    notFound();
  }

  return (
    <>
      <Section background="white" className="pt-28 pb-0 md:pt-32">
        <Reveal className="mx-auto max-w-3xl">
          <Link
            href="/treatments"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-700 hover:text-primary-800"
          >
            <ArrowLeft size={16} />
            All Treatments
          </Link>

          <Badge className="mt-6">Treatment</Badge>
          <h1 className="mt-4 text-3xl leading-tight font-semibold text-ink-900 sm:text-4xl md:text-5xl">
            {treatment.name}
          </h1>
          <p className="mt-4 text-base text-ink-700">{treatment.shortDescription}</p>
        </Reveal>

        {treatment.bannerImage && (
          <Reveal
            delay={0.1}
            className="relative mx-auto mt-10 aspect-video w-full max-w-4xl overflow-hidden rounded-card shadow-card"
          >
            <Image
              src={treatment.bannerImage}
              alt={treatment.name}
              fill
              sizes="(min-width: 1024px) 896px, 100vw"
              className="object-cover"
              priority
            />
          </Reveal>
        )}
      </Section>

      <Section background="white" className="pt-8 pb-12 md:pt-10">
        <Reveal className="mx-auto max-w-3xl">
          <TreatmentDetailContent
            titleAs="h1"
            name=""
            overview={treatment.overview}
            benefits={treatment.benefits}
            idealFor={treatment.idealFor}
            duration={treatment.duration}
            recovery={treatment.recovery}
            procedure={treatment.procedure}
            faqs={treatment.faqs}
            relatedTreatments={treatment.relatedTreatments.map((related) => ({
              name: related.name,
              slug: related.slug,
            }))}
          />
        </Reveal>
      </Section>

      <Section background="sage" className="py-14">
        <Reveal className="mx-auto max-w-xl text-center">
          <h2 className="text-2xl font-semibold text-ink-900 sm:text-3xl">
            Interested in {treatment.name}?
          </h2>
          <p className="mt-3 text-base text-ink-700">
            Book a consultation and our team will guide you through the next steps.
          </p>
          <Button href="/contact#appointment" className="mt-6">
            Book Appointment
          </Button>
        </Reveal>
      </Section>
    </>
  );
}
