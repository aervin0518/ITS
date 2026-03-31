import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";
import LeadershipResearchEcosystemSection from "@/components/leadership/LeadershipResearchEcosystemSection";

export const metadata: Metadata = {
  title: "About | I.T.S. Fatherhood Impact & Intelligence Platform",
  description:
    "I.T.S. Fatherhood exists to build infrastructure for measuring and improving fatherhood outcomes — not just running programs. Learn why the category matters.",
};

const differentiators = [
  "We measure outcomes, not just activity",
  "We build systems, not just programs",
  "We generate intelligence, not just anecdotes",
  "We deploy at scale, not just locally",
  "We connect ecosystem partners with shared data",
  "We center structural causes, not character deficits",
];

const traditionalProblems = [
  {
    label: "Activity-based measurement",
    detail: "Most fatherhood programs count who showed up — not what changed. Attendance is not impact.",
  },
  {
    label: "Anecdotal evidence",
    detail: "Success stories are powerful but unscalable. Funders and policymakers need data they can defend.",
  },
  {
    label: "Program isolation",
    detail: "Thousands of fatherhood efforts operate in silos — no shared frameworks, no data exchange, no collective intelligence.",
  },
  {
    label: "Deficit-based framing",
    detail: "The research literature and the program world often pathologize fathers rather than build on demonstrated strengths and structural context.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* HERO */}
      <section className="bg-navy-500 text-white section-padding">
        <div className="container-narrow">
          <p className="text-xs font-sans font-semibold tracking-[0.3em] uppercase text-blue-300 mb-6">
            Why We Exist
          </p>
          <h1 className="text-5xl md:text-6xl font-serif text-white leading-tight mb-6 max-w-4xl">
            This is infrastructure for fatherhood — not another program about fathers.
          </h1>
          <p className="text-navy-200 font-sans text-lg max-w-2xl leading-relaxed">
            I.T.S. Fatherhood was built to fill a gap that no program can fill: the gap between
            what happens in fatherhood initiatives and what actually gets measured, understood,
            and improved.
          </p>
        </div>
      </section>

      {/* WHY WE EXIST */}
      <section className="section-padding bg-white">
        <div className="container-narrow">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            <div>
              <h2 className="text-4xl font-serif text-stone-900 mb-6">Why We Exist</h2>
              <div className="flex flex-col gap-5 font-sans text-stone-600 leading-relaxed">
                <p>
                  The fatherhood field has no shortage of conviction. It has a shortage of
                  infrastructure. Programs run. Fathers attend. Communities cheer. And then
                  the funding cycle resets — with no real evidence that anything durably changed.
                </p>
                <p>
                  I.T.S. Fatherhood was founded by Gabriel Allen Ervin Sr. after years of direct
                  fatherhood work — and years of frustration watching outcomes go unmeasured. The
                  question that drove everything: <em>"What if we actually tracked what changes?"</em>
                </p>
                <p>
                  The answer is this platform. A system designed to collect community-based data,
                  deploy structured interventions, generate published intelligence, and connect
                  ecosystem partners around shared outcome goals.
                </p>
              </div>
            </div>
            <div className="bg-stone-50 border border-stone-200 p-8">
              <h3 className="text-lg font-serif text-stone-900 mb-6">What Makes I.T.S. Different</h3>
              <div className="flex flex-col gap-4">
                {differentiators.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle size={18} className="text-navy-500 flex-shrink-0 mt-0.5" />
                    <span className="font-sans text-sm text-stone-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THE PROBLEM WITH TRADITIONAL APPROACHES */}
      <section className="section-padding bg-stone-50 border-t border-stone-200">
        <div className="container-narrow">
          <p className="text-xs font-sans font-semibold tracking-[0.3em] uppercase text-navy-500 mb-4">
            The Problem with Traditional Approaches
          </p>
          <h2 className="text-4xl font-serif text-stone-900 mb-4 max-w-3xl">
            Most fatherhood work is sincere. Almost none of it is measurable.
          </h2>
          <p className="font-sans text-stone-500 max-w-2xl mb-12">
            That&apos;s not a criticism of organizations — it&apos;s a systems failure. Here is what&apos;s missing.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {traditionalProblems.map((problem) => (
              <div key={problem.label} className="bg-white border border-stone-200 p-7">
                <h3 className="text-lg font-serif text-stone-900 mb-3">{problem.label}</h3>
                <p className="text-sm font-sans text-stone-500 leading-relaxed">{problem.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOUNDER VISION */}
      <section className="section-padding bg-navy-500">
        <div className="container-narrow">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xs font-sans font-semibold tracking-[0.3em] uppercase text-blue-300 mb-8">
              Founder Vision
            </p>
            <blockquote className="text-3xl md:text-4xl font-serif text-white leading-snug mb-8">
              &ldquo;We don&apos;t need more programs. We need infrastructure. A system that tracks
              outcomes, connects communities, and builds the evidence base that fatherhood has
              always deserved.&rdquo;
            </blockquote>
            <p className="font-sans font-semibold text-navy-200">Gabriel Allen Ervin Sr.</p>
            <p className="font-sans text-sm text-navy-300">
              Founder, I.T.S. Fatherhood Impact & Intelligence Platform
            </p>
          </div>
        </div>
      </section>

      {/* STRATEGIC FUTURE */}
      <section className="section-padding bg-white border-t border-stone-200">
        <div className="container-narrow">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            <div>
              <p className="text-xs font-sans font-semibold tracking-[0.3em] uppercase text-navy-500 mb-4">
                Strategic Future
              </p>
              <h2 className="text-4xl font-serif text-stone-900 mb-6">
                Where we&apos;re going — and why it matters.
              </h2>
              <div className="flex flex-col gap-5 font-sans text-stone-600 leading-relaxed">
                <p>
                  The immediate work is deploying the platform — collecting data, activating
                  MetaDAD cohorts, building ecosystem partnerships, and publishing findings that
                  move the field forward.
                </p>
                <p>
                  The long-term vision is larger: a national fatherhood intelligence infrastructure
                  that any community can deploy, that any researcher can access, and that any
                  funder can use to evaluate where investment drives real outcomes.
                </p>
                <p>
                  We are building the category that fatherhood outcomes have always needed. The
                  infrastructure didn&apos;t exist. We&apos;re building it.
                </p>
              </div>
              <div className="flex flex-wrap gap-4 mt-8">
                <Link href="/platform-model" className="btn-primary">
                  Explore the Platform <ArrowRight size={14} />
                </Link>
                <Link href="/partners" className="btn-secondary">
                  Partner With Us
                </Link>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              {[
                { horizon: "Now", title: "Platform Deployment", desc: "Data collection, MetaDAD cohorts, ecosystem partner activation across 14 community sites." },
                { horizon: "Next", title: "National Expansion", desc: "Multi-city deployment with shared outcome frameworks and cross-site data comparison." },
                { horizon: "Future", title: "Intelligence Infrastructure", desc: "NLP-assisted pattern analysis, funder intelligence dashboards, and open research datasets." },
              ].map((item) => (
                <div key={item.horizon} className="border border-stone-200 p-6 flex gap-5">
                  <div className="text-xs font-sans font-semibold tracking-[0.25em] uppercase text-navy-500 min-w-[48px] pt-1">{item.horizon}</div>
                  <div>
                    <h3 className="font-serif text-stone-900 text-lg mb-2">{item.title}</h3>
                    <p className="font-sans text-sm text-stone-500 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ECOSYSTEM / TEAM */}
      <LeadershipResearchEcosystemSection />
    </>
  );
}
