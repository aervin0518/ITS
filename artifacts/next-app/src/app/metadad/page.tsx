import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "MetaDAD | I.T.S. Fatherhood",
  description:
    "MetaDAD is the activation layer of the I.T.S. Fatherhood platform — a structured mentor/mentee cohort model that converts data into measurable fatherhood outcomes.",
};

const cohortPhases = [
  {
    phase: "01",
    title: "Intake & Assessment",
    duration: "Week 1–2",
    description:
      "Each father completes a structured intake survey that establishes baseline scores across engagement, stability, and wellbeing indicators. This baseline feeds the platform and guides cohort matching.",
  },
  {
    phase: "02",
    title: "Cohort Formation & Mentor Matching",
    duration: "Week 2–3",
    description:
      "Participants are placed into cohorts of 8–12 fathers and matched with a trained MetaDAD mentor — an experienced father with demonstrated stability and program training.",
  },
  {
    phase: "03",
    title: "Structured Curriculum Delivery",
    duration: "Weeks 3–16",
    description:
      "Cohorts move through a 12-week research-backed curriculum covering father identity, co-parenting, economic stability, self-regulation, and community engagement — with weekly check-ins and mentor sessions.",
  },
  {
    phase: "04",
    title: "Outcome Assessment & Data Return",
    duration: "Week 17–18",
    description:
      "Each cohort completes post-program assessments. Results are scored against baseline, compared to prior cohorts, and returned to the platform — generating intelligence for the next iteration.",
  },
];

const outcomes = [
  "73% show measurable improvement in at least three engagement indicators",
  "68% report increased confidence in their parenting role",
  "61% improve co-parenting quality scores",
  "54% improve employment or income stability during the program",
  "88% report the mentor relationship as the most valuable element",
];

const fitGroups = [
  { label: "Parents", desc: "Fathers at any stage — new, returning, or navigating complex co-parenting — who want a structured, accountable path to improvement." },
  { label: "Schools", desc: "Districts seeking a research-backed model to activate father engagement in their student population — with outcome data to demonstrate impact." },
  { label: "Churches", desc: "Faith communities ready to deploy a structured mentorship infrastructure within their congregation — supported by I.T.S. training and data tools." },
  { label: "Community Partners", desc: "Organizations running fatherhood programming who want to upgrade from activity-based models to outcome-tracked cohort deployment." },
];

export default function MetaDADPage() {
  return (
    <>
      {/* HERO */}
      <section className="bg-stone-900 text-white section-padding relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none" aria-hidden="true">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid2" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#4A90D9" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid2)" />
          </svg>
        </div>
        <div className="container-narrow relative">
          <p className="text-xs font-sans font-semibold tracking-[0.3em] uppercase text-blue-400 mb-6">
            The Activation Layer
          </p>
          <h1 className="text-5xl md:text-6xl font-serif text-white leading-tight mb-6 max-w-4xl">
            MetaDAD is not a program. It&apos;s how the platform turns data into measurable change.
          </h1>
          <p className="font-sans text-stone-300 text-lg max-w-2xl leading-relaxed mb-10">
            A structured mentor/mentee cohort model that takes fathers from intake assessment
            to measurable outcome — and feeds every data point back into the I.T.S. intelligence platform.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="https://form.jotform.com/253554464301049"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Apply to Join a Cohort
            </Link>
            <Link href="/partners" className="btn-secondary border-stone-600 text-stone-300 hover:bg-stone-800 hover:text-white">
              Partner to Deploy MetaDAD
            </Link>
          </div>
        </div>
      </section>

      {/* WHAT METADAD IS */}
      <section className="section-padding bg-white">
        <div className="container-narrow">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            <div>
              <h2 className="text-4xl font-serif text-stone-900 mb-6">What MetaDAD Is</h2>
              <div className="flex flex-col gap-5 font-sans text-stone-600 leading-relaxed">
                <p>
                  MetaDAD is the structured intervention engine at the center of the I.T.S.
                  Fatherhood platform. It pairs fathers with trained mentors in research-backed
                  cohort groups — moving them through a 12-week curriculum designed to activate
                  engagement, build stability, and produce measurable outcome data.
                </p>
                <p>
                  Unlike one-off workshops or standalone support groups, MetaDAD is designed
                  as a longitudinal model. Every cohort generates intake data, progress markers,
                  and outcome assessments — all of which flow back into the platform and
                  inform the next cohort&apos;s design.
                </p>
                <p>
                  This is the difference between a program and a platform: MetaDAD doesn&apos;t
                  just serve fathers. It learns from them — and improves with every cohort.
                </p>
              </div>
            </div>
            <div className="bg-stone-50 border border-stone-200 p-8">
              <h3 className="text-lg font-serif text-stone-900 mb-6">Measured Outcomes</h3>
              <div className="flex flex-col gap-4">
                {outcomes.map((outcome) => (
                  <div key={outcome} className="flex items-start gap-3">
                    <CheckCircle size={18} className="text-navy-500 flex-shrink-0 mt-0.5" />
                    <span className="font-sans text-sm text-stone-700">{outcome}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COHORT MODEL */}
      <section className="section-padding bg-stone-50 border-t border-stone-200">
        <div className="container-narrow">
          <p className="text-xs font-sans font-semibold tracking-[0.3em] uppercase text-navy-500 mb-4">
            The Cohort Model
          </p>
          <h2 className="text-4xl font-serif text-stone-900 mb-4 max-w-3xl">
            From intake to outcome in 18 weeks.
          </h2>
          <p className="font-sans text-stone-500 max-w-2xl mb-12">
            Every MetaDAD cohort moves through four structured phases — each one generating data, building accountability, and feeding intelligence back into the platform.
          </p>

          <div className="flex flex-col gap-5">
            {cohortPhases.map((phase) => (
              <div key={phase.phase} className="bg-white border border-stone-200 p-7 flex gap-6 items-start">
                <div className="flex-shrink-0">
                  <div className="text-3xl font-serif text-stone-200 font-bold leading-none">{phase.phase}</div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3 flex-wrap">
                    <h3 className="text-xl font-serif text-stone-900">{phase.title}</h3>
                    <span className="text-xs font-sans font-semibold tracking-[0.2em] uppercase text-stone-400 bg-stone-100 px-3 py-1">
                      {phase.duration}
                    </span>
                  </div>
                  <p className="font-sans text-sm text-stone-600 leading-relaxed">{phase.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT CONNECTS TO DATA */}
      <section className="section-padding bg-navy-500">
        <div className="container-narrow">
          <p className="text-xs font-sans font-semibold tracking-[0.3em] uppercase text-blue-300 mb-4">
            Data Connection
          </p>
          <h2 className="text-4xl font-serif text-white mb-6 max-w-3xl">
            Every cohort makes the platform smarter.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-10">
            {[
              { title: "Intake feeds the baseline", desc: "Every participant&apos;s intake assessment contributes to the platform&apos;s growing dataset — establishing baselines that make outcome measurement possible." },
              { title: "Progress builds the model", desc: "Weekly check-ins and mid-program assessments surface what&apos;s working and what isn&apos;t — in real time, not just at graduation." },
              { title: "Outcomes publish the intelligence", desc: "Post-program data is scored, compared, and distilled into platform intelligence — informing the next cohort, the next partner, and the next publication." },
            ].map((item) => (
              <div key={item.title} className="bg-navy-600 border border-navy-400 p-6">
                <h3 className="font-serif text-white text-lg mb-3">{item.title}</h3>
                <p className="font-sans text-sm text-navy-200 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FIT */}
      <section className="section-padding bg-white border-t border-stone-200">
        <div className="container-narrow">
          <p className="text-xs font-sans font-semibold tracking-[0.3em] uppercase text-navy-500 mb-4">
            Who MetaDAD Serves
          </p>
          <h2 className="text-4xl font-serif text-stone-900 mb-4 max-w-3xl">
            Built for fathers. Deployable anywhere in the ecosystem.
          </h2>
          <p className="font-sans text-stone-500 max-w-2xl mb-12">
            MetaDAD can be deployed as a standalone cohort program or embedded within partner organizations.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {fitGroups.map((group) => (
              <div key={group.label} className="border border-stone-200 p-7">
                <h3 className="text-lg font-serif text-stone-900 mb-3">For {group.label}</h3>
                <p className="text-sm font-sans text-stone-500 leading-relaxed">{group.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-stone-900">
        <div className="container-narrow text-center">
          <h2 className="text-4xl font-serif text-white mb-4">Ready to activate your community?</h2>
          <p className="font-sans text-stone-400 mb-8 max-w-xl mx-auto">
            Join a MetaDAD cohort as a father, or partner with us to deploy MetaDAD in your organization.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="https://form.jotform.com/253554464301049"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Take the Survey to Get Started
            </Link>
            <Link href="/partners" className="btn-secondary border-stone-600 text-stone-300 hover:bg-stone-800 hover:text-white">
              Partner to Deploy <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
