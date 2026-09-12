export interface ApproachPrinciple {
  id: string;
  title: string;
  description: string;
}

export const APPROACH_PRINCIPLES: ApproachPrinciple[] = [
  {
    id: "prevention",
    title: "Prevention-First Care",
    description:
      "We focus on catching and preventing issues early, not just treating symptoms after they appear.",
  },
  {
    id: "personalized",
    title: "Personalized Treatment Plans",
    description: "Every plan is tailored to your specific needs, history, and smile goals.",
  },
  {
    id: "technology",
    title: "Modern Dental Technology",
    description:
      "Advanced laser dentistry and precision implant techniques, backed by continuous learning.",
  },
  {
    id: "comfort",
    title: "Comfortable Patient Experience",
    description: "A calm, transparent environment where every step is explained clearly.",
  },
  {
    id: "specialists",
    title: "Experienced Specialists",
    description:
      "19+ years of clinical experience across periodontics, implantology, and oral medicine.",
  },
  {
    id: "ethics",
    title: "Ethical Dentistry",
    description: "Honest recommendations — only the treatment you actually need, explained plainly.",
  },
];
