import type { Metadata } from "next";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import MetricCard from "@/components/MetricCard";
import { metrics } from "@/data/metrics";

export const metadata: Metadata = {
  title: "Data & Surveys",
};

const JOTFORM_URL = "https://form.jotform.com/253554464301049";

export default function DataSurveysPage() {
  return (
    <>
      <div className="bg-navy-500 text-white section-padding">
        <div className="container-narrow">
          <h1 className="text-5xl md:text-6xl font-serif text-white mb-4">Data & Surveys</h1>
          <p className="text-navy-200 font-sans text-lg max-w-2xl">
            Community-informed data collection that centers father voices and generates credible,
            actionable evidence.
          </p>
        </div>
      </div>

      <section className="section-padding bg-white">
        <div className="container-narrow">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <SectionHeading title="Fatherhood Impact Survey" className="mb-6" />
              <div className="flex flex-col gap-4 font-sans text-stone-700 leading-relaxed text-sm mb-8">
                <p>
                  The Fatherhood Impact Survey is our primary community data collection
                  instrument. Designed in partnership with fathers, practitioners, and community
                  organizations, it gathers comprehensive information about fatherhood experiences,
                  engagement patterns, barriers to involvement, and support needs across diverse
                  demographic and geographic contexts.
                </p>
                <p>
                  Survey responses directly inform our published research, program design, and
                  policy recommendations. All data is anonymized and stored securely. Participants
                  may withdraw at any time. The survey takes approximately 15–20 minutes to
                  complete.
                </p>
                <p>
                  Your participation strengthens the evidence base that advocates for fathers and
                  families. Every response contributes to a more complete picture of fatherhood
                  in America.
                </p>
              </div>
              <a
                href={JOTFORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                Take the Fatherhood Impact Survey
              </a>
            </div>
            <div className="flex flex-col gap-4">
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-6">
                <h3 className="font-serif text-stone-900 mb-4">Survey Methodology</h3>
                <ul className="flex flex-col gap-3">
                  {[
                    "Developed through iterative community consultation with fathers and practitioners",
                    "Validated scales combined with novel fatherhood engagement measures",
                    "Available in English with Spanish translation in progress",
                    "Accessible on desktop and mobile devices",
                    "Results aggregated and reported in biannual research briefs",
                  ].map((item, i) => (
                    <li key={i} className="flex gap-2 text-sm font-sans text-stone-700">
                      <span className="text-navy-500 mt-0.5 flex-shrink-0">—</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-stone-50 divider">
        <div className="container-narrow">
          <SectionHeading title="How We Collect Data" className="mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "In-Depth Interviews",
                description:
                  "One-on-one interviews with fathers lasting 60–90 minutes, conducted by trained researchers. Interviews explore lived experience, identity, co-parenting dynamics, and systemic barriers with depth that surveys cannot achieve.",
              },
              {
                title: "Community Surveys",
                description:
                  "Structured surveys distributed through community partner networks, social service agencies, and program sites. Surveys reach broader populations and enable statistical analysis across demographic groups.",
              },
              {
                title: "Facilitated Group Sessions",
                description:
                  "Father's Table dialogues and co-parenting circles generate qualitative data through facilitated group discussion. Session notes and coded transcripts inform research themes and contribute to published insights.",
              },
            ].map((method) => (
              <div key={method.title} className="bg-white border border-stone-200 rounded-xl p-6">
                <h3 className="font-serif text-stone-900 mb-3">{method.title}</h3>
                <p className="font-sans text-sm text-stone-600 leading-relaxed">
                  {method.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="ethics" className="section-padding bg-white divider">
        <div className="container-narrow">
          <SectionHeading
            title="Research Ethics"
            subtitle="Our commitment to ethical research practice is foundational, not supplementary."
            className="mb-10"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "Informed Consent",
                description:
                  "All research participants provide voluntary, informed consent before participating. Consent forms are written in plain language, available in multiple formats, and explain how data will be used, stored, and reported.",
              },
              {
                title: "Data Anonymization",
                description:
                  "Personal identifying information is removed or pseudonymized at the point of data entry. Published research reports aggregate data and never identify individual participants.",
              },
              {
                title: "IRB Compliance",
                description:
                  "Human subjects research conducted by the center follows established Institutional Review Board protocols. We are committed to continuous improvement of our ethical review processes.",
              },
              {
                title: "Secure Data Storage",
                description:
                  "All research data is stored in encrypted, password-protected systems with restricted access. Data retention policies comply with ethical standards and participant agreements.",
              },
            ].map((principle) => (
              <div key={principle.title} className="border border-stone-200 rounded-xl p-6">
                <h3 className="font-serif text-stone-900 mb-3">{principle.title}</h3>
                <p className="font-sans text-sm text-stone-600 leading-relaxed">
                  {principle.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-stone-900">
        <div className="container-narrow">
          <SectionHeading
            title="Research at Scale"
            subtitle="Our data collection spans multiple years, cities, and methodological approaches."
            align="center"
            className="mx-auto text-center items-center mb-12 [&_h2]:text-white [&_p]:text-stone-400"
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {metrics.map((metric) => (
              <MetricCard key={metric.id} metric={metric} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
