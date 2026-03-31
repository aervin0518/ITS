export type InsightCategory = "Brief" | "Insight" | "Report" | "Field Note";

export interface Insight {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: InsightCategory;
  tags: string[];
  publishedAt: string;
  readTime: string;
  featured?: boolean;
}

export const insights: Insight[] = [
  {
    id: "1",
    title: "Measuring What Matters: A Framework for Fatherhood Outcome Indicators",
    slug: "measuring-what-matters-fatherhood-outcome-indicators",
    excerpt:
      "Most fatherhood programs track attendance. We track outcomes. This brief introduces a 12-indicator framework for measuring real, longitudinal change in father engagement, household stability, and child development.",
    category: "Brief",
    tags: ["Outcomes", "Measurement", "Data Framework"],
    publishedAt: "2025-03-01",
    readTime: "8 min",
    featured: true,
  },
  {
    id: "2",
    title: "The Presence Gap: Why Father Absence Is a Systems Failure, Not a Character Flaw",
    slug: "the-presence-gap-systems-failure",
    excerpt:
      "A structural analysis of the policy, institutional, and economic conditions that produce father disengagement — and the platform-level interventions that reverse it.",
    category: "Report",
    tags: ["Policy", "Systems", "Structural Analysis"],
    publishedAt: "2025-01-15",
    readTime: "22 min",
    featured: true,
  },
  {
    id: "3",
    title: "Inside MetaDAD: What the Data Says After 18 Months",
    slug: "inside-metadad-18-month-data",
    excerpt:
      "Longitudinal findings from two cohorts of the MetaDAD mentorship model — including engagement rates, outcome scores, and what surprised us.",
    category: "Insight",
    tags: ["MetaDAD", "Longitudinal", "Cohort Data"],
    publishedAt: "2024-12-10",
    readTime: "12 min",
    featured: true,
  },
  {
    id: "4",
    title: "Community Intelligence: How Fathers Describe What Support Actually Looks Like",
    slug: "community-intelligence-fathers-describe-support",
    excerpt:
      "Field notes from 60+ structured interviews with fathers across three communities — surfacing what works, what fails, and what the data never captures.",
    category: "Field Note",
    tags: ["Qualitative", "Community Voice", "Interview Data"],
    publishedAt: "2024-11-05",
    readTime: "10 min",
  },
  {
    id: "5",
    title: "From Program to Platform: A Reframe for Fatherhood Organizations",
    slug: "from-program-to-platform-reframe",
    excerpt:
      "Why the shift from event-based programming to data-driven infrastructure isn't just semantics — and how organizations can begin the transition.",
    category: "Brief",
    tags: ["Platform Model", "Strategy", "Organizations"],
    publishedAt: "2024-10-20",
    readTime: "7 min",
  },
  {
    id: "6",
    title: "Black Fathers and the Deficit Narrative: Evidence Against the Mythology",
    slug: "black-fathers-deficit-narrative-evidence",
    excerpt:
      "A synthesis of 40 peer-reviewed studies that systematically dismantles the deficit framing applied to Black fatherhood — and proposes an asset-based research agenda.",
    category: "Report",
    tags: ["Racial Equity", "Research Synthesis", "Counter-Narrative"],
    publishedAt: "2024-09-08",
    readTime: "28 min",
  },
];
