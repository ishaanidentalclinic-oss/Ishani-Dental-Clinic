export interface TreatmentProcedureStep {
  title: string;
  description: string;
}

export interface TreatmentFaq {
  question: string;
  answer: string;
}

export interface RelatedTreatmentRef {
  _id: string;
  name: string;
  slug: string;
  shortDescription: string;
  bannerImage: string;
}

/** The public shape of a treatment — the one source of truth consumed by the
 * Treatments page, individual treatment pages, homepage cards, and the
 * shared treatment modal. Mirrors server/src/models/Treatment.model.js. */
export interface PublicTreatment {
  _id: string;
  name: string;
  slug: string;
  shortDescription: string;
  overview: string;
  bannerImage: string;
  benefits: string[];
  idealFor: string[];
  duration: string;
  recovery: string;
  procedure: TreatmentProcedureStep[];
  faqs: TreatmentFaq[];
  relatedTreatments: RelatedTreatmentRef[];
  seo: {
    metaTitle: string;
    metaDescription: string;
    ogImageUrl: string;
  };
  displayOrder: number;
}
