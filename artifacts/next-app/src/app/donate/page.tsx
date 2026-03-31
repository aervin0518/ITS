import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Support | I.T.S. Fatherhood",
  description:
    "Invest in the infrastructure that makes fatherhood outcomes measurable. Support I.T.S. Fatherhood's platform, research, and ecosystem deployment.",
};

const investmentAreas = [
  {
    area: "Data Infrastructure",
    description: "Funds the surveys, intake systems, and data protocols that make longitudinal outcome tracking possible.",
    icon: "01",
  },
  {
    area: "MetaDAD Cohort Activation",
    description: "Supports cohort deployment — mentor training, curriculum delivery, participant stipends, and outcome assessments.",
    icon: "02",
  },
  {
    area: "Intelligence Publishing",
    description: "Enables the production of briefs, reports, and field notes that translate platform data into actionable intelligence.",
    icon: "03",
  },
  {
    area: "Ecosystem Expansion",
    description: "Covers the cost of onboarding new partner sites — bringing the platform's infrastructure to new communities.",
    icon: "04",
  },
];

const tiers = [
  {
    label: "Platform Supporter",
    range: "$25 – $99",
    description: "Sustains foundational platform operations — data hosting, community outreach, and participant support.",
  },
  {
    label: "Intelligence Ally",
    range: "$100 – $499",
    description: "Funds one month of data collection operations — survey deployment, intake processing, and outcome tracking.",
  },
  {
    label: "Cohort Sponsor",
    range: "$500 – $1,999",
    description: "Sponsors one MetaDAD cohort session — covering mentor training, curriculum delivery, and participant costs.",
  },
  {
    label: "Infrastructure Partner",
    range: "$2,000+",
    description: "Enables new site deployment or funds a major research output — acknowledged in platform publications.",
  },
];

export default function DonatePage() {
  return (
    <>
      {/* HERO */}
      <section className="bg-navy-500 text-white section-padding">
        <div className="container-narrow">
          <p className="text-xs font-sans font-semibold tracking-[0.3em] uppercase text-blue-300 mb-6">
            Strategic Investment
          </p>
          <h1 className="text-5xl md:text-6xl font-serif text-white leading-tight mb-6 max-w-4xl">
            Invest in infrastructure that makes fatherhood outcomes measurable.
          </h1>
          <p className="text-navy-200 font-sans text-lg max-w-2xl leading-relaxed">
            This is not charity. This is investment in the data infrastructure that
            fatherhood communities need — and funders have always lacked.
          </p>
        </div>
      </section>

      {/* WHY INVESTMENT MATTERS */}
      <section className="section-padding bg-white">
        <div className="container-narrow">
          <div className="max-w-3xl">
            <h2 className="text-4xl font-serif text-stone-900 mb-6">Why Investment Matters</h2>
            <div className="flex flex-col gap-5 font-sans text-stone-600 leading-relaxed">
              <p>
                Most fatherhood programs are chronically underfunded — not because the outcomes
                aren&apos;t real, but because they&apos;re unmeasured. Funders can&apos;t invest
                confidently in what they can&apos;t evaluate.
              </p>
              <p>
                I.T.S. Fatherhood is solving that problem from the infrastructure level.
                By building real longitudinal data systems, deploying structured intervention
                models, and publishing defensible outcome evidence — we&apos;re making fatherhood
                investment credible for the first time.
              </p>
              <p>
                Your investment in this platform doesn&apos;t just fund one program. It builds
                the infrastructure that makes every future program in the ecosystem more
                accountable and more fundable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT FUNDING BUILDS */}
      <section className="section-padding bg-stone-50 border-t border-stone-200">
        <div className="container-narrow">
          <p className="text-xs font-sans font-semibold tracking-[0.3em] uppercase text-navy-500 mb-4">
            What Funding Builds
          </p>
          <h2 className="text-4xl font-serif text-stone-900 mb-12 max-w-3xl">
            Infrastructure areas your investment supports.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {investmentAreas.map((area) => (
              <div key={area.area} className="bg-white border border-stone-200 p-7 flex gap-5">
                <div className="text-2xl font-serif text-stone-200 font-bold flex-shrink-0">{area.icon}</div>
                <div>
                  <h3 className="text-xl font-serif text-stone-900 mb-3">{area.area}</h3>
                  <p className="text-sm font-sans text-stone-500 leading-relaxed">{area.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DONATION TIERS */}
      <section className="section-padding bg-stone-900">
        <div className="container-narrow">
          <p className="text-xs font-sans font-semibold tracking-[0.3em] uppercase text-blue-400 mb-4">
            Strategic Outcomes
          </p>
          <h2 className="text-4xl font-serif text-white mb-14 max-w-3xl">
            Every level of investment builds something real.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {tiers.map((tier) => (
              <div key={tier.label} className="bg-stone-800 border border-stone-700 p-7">
                <div className="flex items-start justify-between mb-3 gap-4 flex-wrap">
                  <h3 className="text-xl font-serif text-white">{tier.label}</h3>
                  <span className="text-sm font-sans font-medium text-blue-300 bg-stone-900 px-3 py-1 whitespace-nowrap">
                    {tier.range}
                  </span>
                </div>
                <p className="text-sm font-sans text-stone-300 leading-relaxed">{tier.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DONATION CTA */}
      <section className="section-padding bg-navy-500">
        <div className="container-narrow max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-serif text-white mb-6">Ready to invest in the infrastructure?</h2>
          <p className="font-sans text-navy-200 mb-10 text-lg">
            One-time or recurring — every contribution funds the data, the cohorts, and the intelligence that changes what fatherhood outcomes look like.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Link
              href="https://form.jotform.com/253554464301049"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-navy-500 font-sans font-medium text-sm tracking-wide uppercase hover:bg-stone-100 transition-colors"
            >
              Make a Contribution
            </Link>
          </div>
          <p className="font-sans text-sm text-navy-300">
            For major gifts, funder partnerships, or sponsorship inquiries,{" "}
            <Link href="/contact" className="text-white underline hover:text-navy-200 transition-colors">
              contact us directly
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
