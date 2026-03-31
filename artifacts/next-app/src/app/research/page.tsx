import type { Metadata } from "next";
import ResearchHubContent from "@/components/ResearchHubContent";

export const metadata: Metadata = {
  title: "Research Hub — I.T.S. Fatherhood Research Center",
  description:
    "Explore Insights, Articles, Briefs, and Reports from the I.T.S. Fatherhood Research Center. Evidence-based content for fathers, practitioners, and policymakers.",
};

export default function ResearchHubPage() {
  return <ResearchHubContent />;
}
