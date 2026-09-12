export interface TrustBadge {
  id: string;
  label: string;
}

export interface Doctor {
  id: string;
  name: string;
  role: string;
  photo: string;
  experience: string;
  credentials: string[];
  tags: string[];
}

export interface TechFeature {
  id: string;
  title: string;
  description: string;
}

export interface ResultShowcase {
  id: string;
  label: string;
  beforeImage: string;
  afterImage: string;
}

export interface Testimonial {
  id: string;
  name: string;
  quote: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  readTime: string;
  date: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}
