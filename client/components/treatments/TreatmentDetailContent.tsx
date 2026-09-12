import Link from "next/link";
import { Check } from "lucide-react";
import { FaqAccordion } from "@/components/shared/FaqAccordion";

interface ProcedureStepLike {
  title: string;
  description: string;
}

interface FaqLike {
  question: string;
  answer: string;
}

interface RelatedTreatmentPill {
  name: string;
  slug: string;
}

export interface TreatmentDetailContentProps {
  name: string;
  overview: string;
  benefits: string[];
  idealFor: string[];
  duration: string;
  recovery?: string;
  procedure: ProcedureStepLike[];
  faqs: FaqLike[];
  relatedTreatments: RelatedTreatmentPill[];
  /** Modal context passes this to navigate within the modal instead of a real link. */
  onRelatedSelect?: (slug: string) => void;
  /** aria-labelledby target for the modal's dialog role. */
  titleId?: string;
  /** h1 on the standalone detail page (SEO), h2 inside the modal. */
  titleAs?: "h1" | "h2";
}

/**
 * The single rendering implementation for "what a treatment looks like" —
 * shared by TreatmentModal (homepage + /treatments), the standalone
 * /treatments/[slug] page, and the admin preview modal, so all three stay
 * visually identical by construction rather than by convention.
 */
export function TreatmentDetailContent({
  name,
  overview,
  benefits,
  idealFor,
  duration,
  recovery,
  procedure,
  faqs,
  relatedTreatments,
  onRelatedSelect,
  titleId,
  titleAs = "h2",
}: TreatmentDetailContentProps) {
  const Title = titleAs;

  return (
    <div>
      {name && (
        <Title id={titleId} className="text-2xl font-semibold text-ink-900 sm:text-3xl">
          {name}
        </Title>
      )}
      <p className={name ? "mt-3 text-base leading-relaxed text-ink-700" : "text-base leading-relaxed text-ink-700"}>
        {overview}
      </p>

      {(benefits.length > 0 || idealFor.length > 0) && (
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {benefits.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold tracking-wide text-ink-900 uppercase">
                Key Benefits
              </h3>
              <ul className="mt-3 space-y-2">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-ink-700">
                    <Check size={15} className="mt-0.5 shrink-0 text-primary-600" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {idealFor.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold tracking-wide text-ink-900 uppercase">
                Ideal Candidates
              </h3>
              <ul className="mt-3 space-y-2">
                {idealFor.map((candidate, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-ink-700">
                    <Check size={15} className="mt-0.5 shrink-0 text-primary-600" />
                    {candidate}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {(duration || recovery) && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {duration && (
            <div className="rounded-xl bg-sage-50 p-4">
              <p className="text-xs font-medium tracking-wide text-ink-700 uppercase">
                Typical Duration
              </p>
              <p className="mt-1 text-sm font-medium text-ink-900">{duration}</p>
            </div>
          )}
          {recovery && (
            <div className="rounded-xl bg-sage-50 p-4">
              <p className="text-xs font-medium tracking-wide text-ink-700 uppercase">Recovery</p>
              <p className="mt-1 text-sm font-medium text-ink-900">{recovery}</p>
            </div>
          )}
        </div>
      )}

      {procedure.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xs font-semibold tracking-wide text-ink-900 uppercase">
            The Procedure
          </h3>
          <ol className="mt-3 space-y-3">
            {procedure.map((step, index) => (
              <li key={index} className="flex items-start gap-3 text-sm text-ink-700">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-50 text-xs font-semibold text-primary-700">
                  {index + 1}
                </span>
                <span>
                  {step.title && <span className="font-medium text-ink-900">{step.title}. </span>}
                  {step.description}
                </span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {faqs.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xs font-semibold tracking-wide text-ink-900 uppercase">FAQs</h3>
          <FaqAccordion
            items={faqs.map((faq, index) => ({ id: `faq-${index}`, ...faq }))}
            className="mx-0 mt-3 max-w-none space-y-2"
          />
        </div>
      )}

      {relatedTreatments.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xs font-semibold tracking-wide text-ink-900 uppercase">
            Related Treatments
          </h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {relatedTreatments.map((related) =>
              onRelatedSelect ? (
                <button
                  key={related.slug}
                  type="button"
                  onClick={() => onRelatedSelect(related.slug)}
                  className="rounded-pill border border-black/10 px-3 py-1.5 text-sm text-ink-900 transition-colors duration-200 hover:border-primary-300 hover:text-primary-700"
                >
                  {related.name}
                </button>
              ) : (
                <Link
                  key={related.slug}
                  href={`/treatments/${related.slug}`}
                  className="rounded-pill border border-black/10 px-3 py-1.5 text-sm text-ink-900 transition-colors duration-200 hover:border-primary-300 hover:text-primary-700"
                >
                  {related.name}
                </Link>
              ),
            )}
          </div>
        </div>
      )}
    </div>
  );
}
