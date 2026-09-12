export interface PromiseValue {
  id: string;
  title: string;
  description: string;
}

export const PROMISE_VALUES: PromiseValue[] = [
  {
    id: "patient-first",
    title: "Patient-First Care",
    description: "Every decision starts with what's genuinely best for you, not the treatment plan.",
  },
  {
    id: "ethical",
    title: "Ethical Dentistry",
    description: "Honest recommendations, explained plainly — only the care you actually need.",
  },
  {
    id: "precision",
    title: "Precision & Excellence",
    description: "Advanced technology and continuous learning, applied with meticulous care.",
  },
  {
    id: "trust",
    title: "Lifelong Trust",
    description: "Relationships built to last — we're here for your family's smiles for years to come.",
  },
];
