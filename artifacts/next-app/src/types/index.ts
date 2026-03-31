export interface Publication {
  id: string;
  title: string;
  abstract: string;
  category: "Brief" | "Report" | "Insight" | "Article";
  date: string;
  year: number;
  topics: string[];
  authors: string[];
  downloadUrl?: string;
}

export interface NewsPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  imageAlt: string;
  slug: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  registrationUrl?: string;
}

export interface Program {
  id: string;
  name: string;
  tagline: string;
  description: string;
  outcomes: string[];
  evidenceSummary: string;
}

export interface Partner {
  id: string;
  name: string;
  type: "University" | "Community" | "Government" | "Foundation" | "Corporate";
}

export interface ResearchArea {
  id: string;
  title: string;
  description: string;
  slug: string;
}

export interface Metric {
  id: string;
  label: string;
  value: string;
  description?: string;
}
