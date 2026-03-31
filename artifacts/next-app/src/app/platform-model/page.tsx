import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { platformPillars, howItWorksSteps } from "@/data/platformPillars";

export const metadata: Metadata = {
  title: "Platform Model | I.T.S. Fatherhood",
  description:
    "Understand the full I.T.S. Fatherhood system architecture: four pillars of Data, Activation, Technology, and Ecosystem that drive measurable fatherhood outcomes.",
};

const stakeholderFlows = [
  {
    actor: "Father",
    flow: ["Takes intake survey", "Joins MetaDAD cohort", "Engages with mentor", "Completes outcome assessment", "Data feeds platform"],
  },
  {
    actor: "Community Site",
    flow: ["Partners with I.T.S.", "Deploys MetaDAD cohorts", "Collects local data", "Receives outcome reports", "Expands program"],
  },
  {
    actor: "Funder / Researcher",
    flow: ["Reviews intelligence briefs", "Accesses aggregate outcomes", "Co-designs studies", "Publishes findings", "Reinvests strategically"],
  },
];

const outcomes = [
  { label: "Individual Outcomes", items: ["Father engagement scores", "Parenting confidence", "Co-parenting stability", "Employment status", "Housing stability"] },
  { label: "Family Outcomes", items: ["Father-child contact frequency", "Child academic performance", "Household income trajectory", "Maternal co-parenting quality"] },
  { label: "Community Outcomes", items: ["Program retention rates", "Cohort completion rates", "Mentor-mentee matches sustained", "Cross-site replication fidelity"] },
];

const pillarColors: Record<string, { bg: string; border: string; text: string; num: string }> = {
  navy: { bg: "bg-navy-500", border: "border-navy-400", text: "text-white", num: "text-blue-300" },
  amber: { bg: "bg-stone-800", border: "border-stone-700", text: "text-white", num: "text-amber-400" },
  blue: { bg: "bg-stone-900", border: "border-stone-700", text: "text-white", num: "text-blue-400" },
  green: { bg: "bg-stone-800", border: "border-stone-700", text: "text-white", num: "text-emerald-400" },
};

export default function PlatformModelPage() {
  return (
    <>
      {/* HERO */}
      <section className="bg-navy-500 text-white section-padding">
        <div className="container-narrow">
          <p className="text-xs font-sans font-semibold tracking-[0.3em] uppercase text-blue-300 mb-6">
            Platform Architecture
          </p>
          <h1 className="text-5xl md:text-6xl font-serif text-white leading-tight mb-6 max-w-4xl">
            A system designed to measure, activate, and scale fatherhood outcomes.
          </h1>
          <p className="text-navy-200 font-sans text-lg max-w-2xl leading-relaxed">
            The I.T.S. platform is not a program. It is infrastructure — four interconnected
            pillars that work together to generate real, defensible, longitudinal impact.
          </p>
        </div>
      </section>

      {/* PLATFORM OVERVIEW */}
      <section className="section-padding bg-white">
        <div className="container-narrow">
          <h2 className="text-4xl font-serif text-stone-900 mb-4 max-w-3xl">Platform Overview</h2>
          <p className="font-sans text-stone-500 max-w-2xl mb-12">
            Most fatherhood initiatives are built as programs: they deliver services, count
            participants, and report activity. I.T.S. Fatherhood is built as a platform: it
            collects data, activates interventions, generates intelligence, and deploys at scale.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-0 border border-stone-200 mb-12">
            {howItWorksSteps.map((step, i) => (
              <div key={step.id} className={`p-8 bg-stone-50 ${i < howItWorksSteps.length - 1 ? "border-b md:border-b-0 md:border-r border-stone-200" : ""}`}>
                <div className="text-3xl font-serif text-stone-300 font-bold mb-3">{step.step}</div>
                <div className="text-lg font-serif text-stone-900 mb-2">{step.title}</div>
                <div className="text-sm font-sans text-stone-500 leading-relaxed">{step.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOUR PILLARS */}
      <section className="section-padding bg-stone-900">
        <div className="container-narrow">
          <p className="text-xs font-sans font-semibold tracking-[0.3em] uppercase text-blue-400 mb-4">
            Four Pillars
          </p>
          <h2 className="text-4xl font-serif text-white mb-14 max-w-3xl">
            The architecture behind the platform.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {platformPillars.map((pillar) => {
              const colors = pillarColors[pillar.color] ?? pillarColors.navy;
              return (
                <div key={pillar.id} className={`${colors.bg} ${colors.border} border p-8`}>
                  <div className={`text-4xl font-serif font-bold mb-2 ${colors.num}`}>{pillar.number}</div>
                  <h3 className={`text-2xl font-serif ${colors.text} mb-2`}>{pillar.name}</h3>
                  <p className="text-sm font-sans text-stone-300 font-medium italic mb-4">{pillar.tagline}</p>
                  <p className="text-sm font-sans text-stone-300 leading-relaxed mb-6">{pillar.description}</p>
                  <ul className="flex flex-col gap-2">
                    {pillar.capabilities.map((cap) => (
                      <li key={cap} className="flex items-start gap-2 text-sm font-sans text-stone-400">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-stone-500 flex-shrink-0" />
                        {cap}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* STAKEHOLDER FLOWS */}
      <section className="section-padding bg-white border-t border-stone-200">
        <div className="container-narrow">
          <p className="text-xs font-sans font-semibold tracking-[0.3em] uppercase text-navy-500 mb-4">
            Stakeholder Flows
          </p>
          <h2 className="text-4xl font-serif text-stone-900 mb-4 max-w-3xl">
            How different actors move through the platform.
          </h2>
          <p className="font-sans text-stone-500 max-w-2xl mb-12">
            The platform serves multiple stakeholders simultaneously — and each one&apos;s journey feeds data back into the system.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stakeholderFlows.map((flow) => (
              <div key={flow.actor} className="border border-stone-200">
                <div className="bg-navy-500 px-6 py-4">
                  <h3 className="font-serif text-white text-lg">{flow.actor}</h3>
                </div>
                <div className="p-6">
                  <ol className="flex flex-col gap-4">
                    {flow.flow.map((step, i) => (
                      <li key={step} className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-navy-50 border border-navy-200 flex items-center justify-center text-xs font-sans font-bold text-navy-500 flex-shrink-0">
                          {i + 1}
                        </span>
                        <span className="text-sm font-sans text-stone-600 pt-0.5">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OUTCOMES MODEL */}
      <section className="section-padding bg-stone-50 border-t border-stone-200">
        <div className="container-narrow">
          <p className="text-xs font-sans font-semibold tracking-[0.3em] uppercase text-navy-500 mb-4">
            Outcomes Model
          </p>
          <h2 className="text-4xl font-serif text-stone-900 mb-4 max-w-3xl">
            What we actually track — and why it matters.
          </h2>
          <p className="font-sans text-stone-500 max-w-2xl mb-12">
            Every interaction with the platform generates data across three outcome levels.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {outcomes.map((group) => (
              <div key={group.label} className="bg-white border border-stone-200 p-7">
                <h3 className="text-lg font-serif text-stone-900 mb-5 pb-4 border-b border-stone-100">
                  {group.label}
                </h3>
                <ul className="flex flex-col gap-3">
                  {group.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm font-sans text-stone-600">
                      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-navy-400 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SCALABILITY */}
      <section className="section-padding bg-navy-500">
        <div className="container-narrow">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-sans font-semibold tracking-[0.3em] uppercase text-blue-300 mb-4">
                Scalability
              </p>
              <h2 className="text-4xl font-serif text-white mb-6">
                Built to deploy anywhere.
              </h2>
              <div className="flex flex-col gap-4 font-sans text-navy-200 leading-relaxed">
                <p>
                  The I.T.S. platform is designed for replication. The data infrastructure,
                  MetaDAD cohort model, and outcome tracking framework are all built to be
                  deployed across community sites without losing fidelity.
                </p>
                <p>
                  Each new partner site adds to the platform&apos;s data — and benefits from
                  the collective intelligence of every other site. This is the network effect
                  of building a platform, not a program.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              {[
                { label: "Site-Level Deployment", desc: "Partner organizations receive the MetaDAD model, data protocols, and training to deploy within their community." },
                { label: "Data Integration", desc: "Site-level data flows into the central platform — aggregated, anonymized, and analyzed across all active sites." },
                { label: "Intelligence Return", desc: "Partner sites receive comparative outcome reports, helping them improve their local deployment continuously." },
              ].map((item) => (
                <div key={item.label} className="bg-navy-600 border border-navy-400 p-6">
                  <h3 className="font-serif text-white text-lg mb-2">{item.label}</h3>
                  <p className="font-sans text-sm text-navy-200 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-white border-t border-stone-200">
        <div className="container-narrow text-center">
          <h2 className="text-4xl font-serif text-stone-900 mb-4">Ready to deploy the platform?</h2>
          <p className="font-sans text-stone-500 mb-8 max-w-xl mx-auto">
            Whether you&apos;re a community organization, school, or faith community — we&apos;ll help you get started.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/partners" className="btn-primary">Partner With Us <ArrowRight size={14} /></Link>
            <Link href="/research" className="btn-secondary">View the Research</Link>
          </div>
        </div>
      </section>
    </>
  );
}
