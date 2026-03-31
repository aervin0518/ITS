import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BarChart3, Database, Cpu, Network } from "lucide-react";
import MetricCard from "@/components/MetricCard";
import { metrics } from "@/data/metrics";
import { insights } from "@/data/insights";
import { audienceSegments } from "@/data/audienceSegments";
import { howItWorksSteps } from "@/data/platformPillars";

export const metadata: Metadata = {
  title: "I.T.S. Fatherhood | Fatherhood Impact & Intelligence Platform",
  description:
    "I.T.S. Fatherhood is a Fatherhood Impact & Intelligence Platform that measures, tracks, and improves fatherhood outcomes using data, mentorship, and technology.",
};

const comparisonRows = [
  { category: "Approach", traditional: "Isolated events and programs", platform: "Integrated data + intervention system" },
  { category: "Measurement", traditional: "Attendance counts", platform: "Longitudinal outcome tracking" },
  { category: "Evidence", traditional: "Anecdotal success stories", platform: "Structured data and published findings" },
  { category: "Scale", traditional: "One site, one program", platform: "Multi-site ecosystem deployment" },
  { category: "Output", traditional: "Participant lists", platform: "Intelligence briefs and outcome reports" },
  { category: "Value to Funders", traditional: "Activity reports", platform: "Measurable impact evidence" },
];

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  BarChart3,
  Database,
  Cpu,
  Network,
};

export default function HomePage() {
  const featuredInsights = insights.filter((i) => i.featured).slice(0, 3);

  return (
    <>
      {/* HERO */}
      <section className="bg-stone-900 text-white section-padding relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none" aria-hidden="true">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#4A90D9" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        <div className="container-narrow relative">
          <div className="max-w-4xl">
            <p className="text-xs font-sans font-semibold tracking-[0.3em] uppercase text-blue-400 mb-6">
              Fatherhood Impact & Intelligence Platform
            </p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-white leading-[1.05] mb-8">
              We Don&apos;t Just Support Fathers.{" "}
              <span className="text-blue-400">We Build Systems That Improve Fatherhood Outcomes.</span>
            </h1>
            <p className="text-lg md:text-xl font-sans text-stone-300 max-w-3xl leading-relaxed mb-10">
              I.T.S. Fatherhood combines research, mentorship, technology, and ecosystem
              partnerships to measure, activate, and scale fatherhood outcomes.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="https://form.jotform.com/253554464301049"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                Take the Survey
              </Link>
              <Link href="/partners" className="btn-secondary border-stone-500 text-stone-300 hover:bg-stone-800 hover:text-white">
                Partner With Us
              </Link>
              <Link href="/platform-model" className="btn-secondary border-stone-500 text-stone-300 hover:bg-stone-800 hover:text-white">
                Explore the Platform
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* THE SYSTEM GAP */}
      <section className="section-padding bg-white">
        <div className="container-narrow">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <p className="text-xs font-sans font-semibold tracking-[0.3em] uppercase text-navy-500 mb-4">
                The System Gap
              </p>
              <h2 className="text-4xl md:text-5xl font-serif text-stone-900 leading-tight mb-6">
                Fatherhood is discussed everywhere. Measured almost nowhere.
              </h2>
              <div className="flex flex-col gap-4 font-sans text-stone-600 leading-relaxed">
                <p>
                  Billions flow into fatherhood programs every year. Communities run workshops,
                  host events, and count attendance. But when funders ask what changed — what
                  actually improved — most organizations have no answer.
                </p>
                <p>
                  The gap isn&apos;t motivation. It&apos;s infrastructure. There is no
                  longitudinal data. No outcome framework. No shared intelligence. Just
                  activity without evidence.
                </p>
                <p className="font-medium text-stone-800">
                  I.T.S. Fatherhood was built to close that gap — by building the
                  measurement infrastructure that fatherhood has always needed.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Fatherhood programs in the U.S.", value: "4,000+", sub: "Without a shared outcome framework" },
                { label: "Annual public investment", value: "$140M+", sub: "With limited longitudinal data" },
                { label: "Father-child contact improvement", value: "Unmeasured", sub: "In most existing programs" },
                { label: "Outcome data available", value: "<5%", sub: "Of programs track real outcomes" },
              ].map((stat) => (
                <div key={stat.label} className="bg-stone-50 border border-stone-200 p-6">
                  <div className="text-2xl md:text-3xl font-serif text-navy-500 font-bold mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm font-sans text-stone-800 font-medium mb-1">{stat.label}</div>
                  <div className="text-xs font-sans text-stone-400">{stat.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PLATFORM OVERVIEW — HOW IT WORKS */}
      <section className="section-padding bg-stone-900">
        <div className="container-narrow">
          <p className="text-xs font-sans font-semibold tracking-[0.3em] uppercase text-blue-400 mb-4">
            How the Platform Works
          </p>
          <h2 className="text-4xl md:text-5xl font-serif text-white leading-tight mb-4 max-w-3xl">
            Data. Activation. Intelligence. Community Impact.
          </h2>
          <p className="font-sans text-stone-400 max-w-2xl mb-14">
            Four interconnected functions that transform fatherhood support from a program into a platform.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border border-stone-700">
            {howItWorksSteps.map((step, i) => (
              <div
                key={step.id}
                className={`p-8 ${i < howItWorksSteps.length - 1 ? "border-b lg:border-b-0 lg:border-r border-stone-700" : ""}`}
              >
                <div className="text-4xl font-serif text-stone-700 font-bold mb-4">{step.step}</div>
                <h3 className="text-xl font-serif text-white mb-3">{step.title}</h3>
                <p className="text-sm font-sans text-stone-400 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <Link href="/platform-model" className="btn-secondary border-stone-600 text-stone-300 hover:bg-stone-800 hover:text-white">
              Explore the Full Platform Model <ArrowRight size={14} className="ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* DIFFERENTIATOR COMPARISON */}
      <section className="section-padding bg-white border-t border-stone-200">
        <div className="container-narrow">
          <p className="text-xs font-sans font-semibold tracking-[0.3em] uppercase text-navy-500 mb-4">
            From Program to Platform
          </p>
          <h2 className="text-4xl md:text-5xl font-serif text-stone-900 leading-tight mb-4 max-w-3xl">
            The difference is infrastructure.
          </h2>
          <p className="font-sans text-stone-500 max-w-2xl mb-12">
            Most fatherhood efforts are programs. I.T.S. Fatherhood is a platform — built for measurement, scale, and defensible impact.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left py-4 px-5 bg-stone-50 border border-stone-200 font-sans text-xs font-semibold tracking-[0.2em] uppercase text-stone-400 w-1/4">
                    Category
                  </th>
                  <th className="text-left py-4 px-5 bg-stone-50 border border-stone-200 font-sans text-xs font-semibold tracking-[0.2em] uppercase text-stone-400">
                    Traditional Approach
                  </th>
                  <th className="text-left py-4 px-5 bg-navy-500 border border-navy-400 font-sans text-xs font-semibold tracking-[0.2em] uppercase text-navy-200">
                    I.T.S. Platform
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr key={row.category}>
                    <td className={`py-4 px-5 border border-stone-200 font-sans text-sm font-semibold text-stone-500 ${i % 2 === 0 ? "bg-white" : "bg-stone-50"}`}>
                      {row.category}
                    </td>
                    <td className={`py-4 px-5 border border-stone-200 font-sans text-sm text-stone-600 ${i % 2 === 0 ? "bg-white" : "bg-stone-50"}`}>
                      {row.traditional}
                    </td>
                    <td className="py-4 px-5 border border-navy-400 bg-navy-500 font-sans text-sm text-white font-medium">
                      {row.platform}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* IMPACT METRICS */}
      <section className="section-padding bg-stone-900">
        <div className="container-narrow">
          <p className="text-xs font-sans font-semibold tracking-[0.3em] uppercase text-blue-400 mb-4">
            Proof & Impact Trajectory
          </p>
          <h2 className="text-4xl font-serif text-white mb-14 max-w-2xl">
            Real numbers from real systems.
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {metrics.map((metric) => (
              <MetricCard key={metric.id} metric={metric} />
            ))}
          </div>
        </div>
      </section>

      {/* AUDIENCE SEGMENTS */}
      <section className="section-padding bg-white border-t border-stone-200">
        <div className="container-narrow">
          <p className="text-xs font-sans font-semibold tracking-[0.3em] uppercase text-navy-500 mb-4">
            Who This Platform Serves
          </p>
          <h2 className="text-4xl md:text-5xl font-serif text-stone-900 leading-tight mb-4 max-w-3xl">
            Built for everyone in the fatherhood ecosystem.
          </h2>
          <p className="font-sans text-stone-500 max-w-2xl mb-12">
            Whether you&apos;re a father, a funder, a school, or a faith community — the I.T.S. platform has a role for you.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {audienceSegments.map((segment) => (
              <div
                key={segment.id}
                className="border border-stone-200 p-7 hover:border-navy-300 hover:shadow-sm transition-all group"
              >
                <h3 className="text-xl font-serif text-stone-900 mb-3 group-hover:text-navy-600 transition-colors">
                  {segment.title}
                </h3>
                <p className="text-sm font-sans text-stone-500 leading-relaxed mb-5">
                  {segment.description}
                </p>
                <Link
                  href={segment.ctaHref}
                  className="inline-flex items-center gap-1.5 text-sm font-sans font-medium text-navy-500 hover:text-navy-700 transition-colors"
                >
                  {segment.ctaText} <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED INSIGHTS */}
      <section className="section-padding bg-stone-50 border-t border-stone-200">
        <div className="container-narrow">
          <div className="flex items-end justify-between mb-12 gap-4 flex-wrap">
            <div>
              <p className="text-xs font-sans font-semibold tracking-[0.3em] uppercase text-navy-500 mb-3">
                Intelligence Library
              </p>
              <h2 className="text-4xl font-serif text-stone-900">Featured Insights</h2>
            </div>
            <Link
              href="/research"
              className="text-sm font-sans font-medium text-navy-500 hover:text-navy-700 transition-colors whitespace-nowrap"
            >
              Visit the Research Hub →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredInsights.map((insight) => (
              <div key={insight.id} className="bg-white border border-stone-200 p-6 flex flex-col gap-4 hover:border-navy-300 hover:shadow-sm transition-all">
                <span className="inline-block text-xs font-sans font-semibold tracking-[0.2em] uppercase text-navy-500 bg-navy-50 px-3 py-1 self-start">
                  {insight.category}
                </span>
                <h3 className="font-serif text-stone-900 text-lg leading-snug">{insight.title}</h3>
                <p className="text-sm font-sans text-stone-500 leading-relaxed flex-1">{insight.excerpt}</p>
                <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                  <span className="text-xs font-sans text-stone-400">{insight.readTime} read</span>
                  <Link
                    href="/research"
                    className="text-xs font-sans font-medium text-navy-500 hover:text-navy-700 transition-colors"
                  >
                    Read →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="section-padding bg-navy-500">
        <div className="container-narrow text-center">
          <h2 className="text-4xl md:text-5xl font-serif text-white mb-6 max-w-3xl mx-auto">
            Ready to measure what actually matters?
          </h2>
          <p className="text-navy-200 font-sans text-lg max-w-2xl mx-auto mb-10">
            Take the Fatherhood Impact Survey. Explore a deployment partnership. Or dive into the research.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="https://form.jotform.com/253554464301049"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-navy-500 font-sans font-medium text-sm tracking-wide uppercase hover:bg-stone-100 transition-colors"
            >
              Take the Survey
            </Link>
            <Link
              href="/partners"
              className="inline-flex items-center gap-2 px-8 py-4 border border-navy-300 text-white font-sans font-medium text-sm tracking-wide uppercase hover:bg-navy-600 transition-colors"
            >
              Partner With Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
