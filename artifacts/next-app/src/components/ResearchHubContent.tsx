"use client";

import { useState } from "react";
import Link from "next/link";

type TabType = "insight" | "article" | "brief" | "report";

const contentTypes = [
  {
    id: "insight" as TabType,
    emoji: "💡",
    label: "Insight",
    tagline: "Data-Informed Analysis",
    sub: "Research applied to real life.",
    color: "#b85c00",
    bgColor: "#fdf0e5",
    definition:
      "An Insight piece analyzes trends, survey data, or program outcomes and connects them to practical strategies. It's the bridge between raw research and real-world decision-making — for coaches, mentors, and engaged fathers.",
    traits: [
      "6–12 pages with charts, graphs, or data tables",
      "Includes narrative context and interpretation",
      "Draws on surveys, program data, or interviews",
      "Closes with strategies for practitioners",
    ],
    chips: ["⏱ 10–15 min read", "👥 Mentors & coaches", "📄 6–12 pages"],
  },
  {
    id: "article" as TabType,
    emoji: "✍️",
    label: "Article",
    tagline: "Narrative Editorial Piece",
    sub: "Stories that teach and inspire.",
    color: "#7a39bb",
    bgColor: "#f0eaf9",
    definition:
      "An Article is a longer-form editorial piece — written with narrative voice, personal perspective, and real-world examples. Articles explore fatherhood topics through storytelling, lived experience, and cultural context.",
    traits: [
      "800–2,000 words; editorial magazine style",
      "Combines personal story with broader context",
      "Written in first or second person; conversational",
      "Shareable on blog, social media, and newsletter",
    ],
    chips: ["⏱ 5–8 min read", "👥 All fathers", "📝 Blog / Newsletter"],
  },
  {
    id: "brief" as TabType,
    emoji: "📋",
    label: "Brief",
    tagline: "Quick-Read Summary",
    sub: "The essential findings — fast.",
    color: "#1B3A5C",
    bgColor: "#e8ecf4",
    definition:
      "A Brief is a concise 2–4 page document that distills complex research into clear, actionable points. Written for fathers on the go, program staff, or community leaders who need trusted information without the deep dive.",
    traits: [
      "Concise: 2–4 pages, scan-friendly format",
      "Written in plain language for general audiences",
      "Ends with 3–5 immediate action steps",
      "Designed to share easily with other fathers",
    ],
    chips: ["⏱ 3–5 min read", "👥 Fathers & families", "📄 2–4 pages"],
  },
  {
    id: "report" as TabType,
    emoji: "📊",
    label: "Report",
    tagline: "Full Research Report",
    sub: "Comprehensive. Cited. Authoritative.",
    color: "#1a6b4a",
    bgColor: "#e5f4ed",
    definition:
      "A Report is I.T.S.'s flagship research publication — a full-length study with methodology, participant data, literature review, findings, and policy recommendations. Built for nonprofits, government partners, and academic audiences.",
    traits: [
      "15–40 pages with full methodology section",
      "Peer-reviewed citations and data appendix",
      "Includes policy & program recommendations",
      "Suitable for grant applications and advocacy",
    ],
    chips: ["⏱ 45–90 min read", "👥 Partners & policymakers", "📄 15–40 pages"],
  },
];

const spectrumNodes = [
  {
    id: "insight",
    emoji: "💡",
    name: "Insight",
    oneLiner: '"Data meets real decisions."',
    dims: [
      { key: "Length", val: "6–12 pp" },
      { key: "Read Time", val: "15 min" },
      { key: "Evidence", val: "Analyzed" },
      { key: "Audience", val: "Practitioners" },
      { key: "Action", val: "Program" },
    ],
    borderColor: "rgba(232,160,106,0.5)",
    bgColor: "rgba(232,160,106,0.15)",
  },
  {
    id: "article",
    emoji: "✍️",
    name: "Article",
    oneLiner: '"Stories that move fathers forward."',
    dims: [
      { key: "Length", val: "800–2K wds" },
      { key: "Read Time", val: "6 min" },
      { key: "Evidence", val: "Narrative" },
      { key: "Audience", val: "All fathers" },
      { key: "Action", val: "Inspire" },
    ],
    borderColor: "rgba(168,111,223,0.5)",
    bgColor: "rgba(168,111,223,0.15)",
  },
  {
    id: "brief",
    emoji: "📋",
    name: "Brief",
    oneLiner: '"The essentials, right now."',
    dims: [
      { key: "Length", val: "2–4 pp" },
      { key: "Read Time", val: "5 min" },
      { key: "Evidence", val: "Summary" },
      { key: "Audience", val: "Fathers" },
      { key: "Action", val: "Personal" },
    ],
    borderColor: "rgba(107,144,212,0.5)",
    bgColor: "rgba(107,144,212,0.15)",
  },
  {
    id: "report",
    emoji: "📊",
    name: "Report",
    oneLiner: '"The full picture, documented."',
    dims: [
      { key: "Length", val: "15–40 pp" },
      { key: "Read Time", val: "90 min" },
      { key: "Evidence", val: "Cited" },
      { key: "Audience", val: "Partners" },
      { key: "Action", val: "Policy" },
    ],
    borderColor: "rgba(93,184,138,0.5)",
    bgColor: "rgba(93,184,138,0.15)",
  },
];

const tabExamples: Record<TabType, {
  eyebrow: string;
  heading: string;
  desc: string;
  facts: { label: string; value: string; colored?: boolean }[];
  docId: string;
  docTitle: string;
  docMeta: string[];
  abstract: string;
  findingLabel: string;
  findingText: string;
  sections: string[];
  ctaText: string;
  ctaLabel: string;
  color: string;
  bgColor: string;
  badgeEmoji: string;
}> = {
  insight: {
    eyebrow: "Insight · Example",
    heading: "What an Insight looks like",
    desc: "Insight pieces translate survey and program data into practical strategies for fathers, coaches, and mentors — connecting evidence to everyday decisions.",
    facts: [
      { label: "Format", value: "PDF with infographics", colored: true },
      { label: "Audience", value: "Mentors & Coaches" },
      { label: "Read Time", value: "~12 minutes" },
      { label: "Ends With", value: "Practitioner strategies", colored: true },
    ],
    docId: "ITS-IN-2025-02",
    docTitle: "Digital Barriers to Fatherhood Engagement: What the Data Tells Us",
    docMeta: ["📅 February 2025", "✍️ Gabriel Ervin, I.T.S.", "📄 8 pages · 4 charts", "⏱ 12 min read"],
    abstract:
      "Drawing on survey responses from 210 MetaDad participants (2024), this Insight analyzes where digital tools help fathers stay engaged — and where they create friction, distraction, or disconnection from their children.",
    findingLabel: "Data Finding",
    findingText:
      "68% of fathers surveyed reported that screen time,  their own and their child's , was their #1 challenge to meaningful daily connection. Yet 74% said they had never received guidance on family digital boundaries.",
    sections: [
      "Survey Methodology & Participant Profile",
      "Where Digital Tools Help (Charts A & B)",
      "Where Digital Tools Harm Connection (Chart C)",
      "Strategies for Coaches: 6 Proven Approaches",
      "Recommended Resources & Next Steps",
    ],
    ctaText: "For program staff & coaches",
    ctaLabel: "Read Full Insight →",
    color: "#b85c00",
    bgColor: "#fdf0e5",
    badgeEmoji: "💡",
  },
  article: {
    eyebrow: "Article · Example",
    heading: "What an Article looks like",
    desc: "Articles are editorial, narrative pieces — written with voice, personal story, and cultural context. They meet fathers where they are and invite reflection through real experiences.",
    facts: [
      { label: "Format", value: "Blog / Web page", colored: true },
      { label: "Audience", value: "All Fathers" },
      { label: "Read Time", value: "~6 minutes" },
      { label: "Ends With", value: "Reflection question", colored: true },
    ],
    docId: "ITS-AR-2025-07",
    docTitle: "The Day I Put My Phone Down and Actually Saw My Son",
    docMeta: ["📅 March 2025", "✍️ Gabriel Ervin", "📝 ~1,400 words", "⏱ 6 min read"],
    abstract:
      "I remember the exact moment. My son had just scored his first goal in a rec league game — and I was looking at my phone. He turned around looking for my face in the crowd. I wasn't there for him, even though I was physically there. That moment changed everything about how I father.",
    findingLabel: "The Point of This Article",
    findingText:
      "Presence isn't about proximity — it's about attention. This article explores what it really means to 'show up' for your children, through one father's honest reckoning with distraction, pride, and missed moments.",
    sections: [
      "The Moment That Changed Everything",
      "What 'Being There' Really Means",
      "Three Patterns of Distracted Fatherhood",
      "The Shift: From Present to Purposeful",
      "A Question to Sit With Tonight",
    ],
    ctaText: "Shareable with fathers in your network",
    ctaLabel: "Read Full Article →",
    color: "#7a39bb",
    bgColor: "#f0eaf9",
    badgeEmoji: "✍️",
  },
  brief: {
    eyebrow: "Brief · Example",
    heading: "What a Brief looks like",
    desc: "Briefs are designed for fathers who need the most important findings immediately — concise, plain-language, and built to share. No academic jargon, just clear action steps.",
    facts: [
      { label: "Format", value: "PDF one-pager", colored: true },
      { label: "Audience", value: "Fathers & Families" },
      { label: "Read Time", value: "~4 minutes" },
      { label: "Ends With", value: "Action checklist", colored: true },
    ],
    docId: "ITS-BR-2025-04",
    docTitle: "Fear of Vulnerability: A Father's Guide to Emotional Honesty",
    docMeta: ["📅 March 2025", "✍️ I.T.S. Research", "📄 2 pages", "⏱ 4 min read"],
    abstract:
      "Fear of emotional vulnerability is one of the most underreported barriers to deep father-child connection. This Brief unpacks the research on why fathers pull back emotionally — and offers five concrete steps for building honest, open relationships with your children.",
    findingLabel: "Key Finding",
    findingText:
      "Fathers who regularly express vulnerability with their children report 40% higher scores on trust-based relationship measures. Emotional honesty, not emotional distance, is what builds lasting bonds.",
    sections: [
      "Why Vulnerability Feels Risky",
      "What Research Says About Emotional Honesty",
      "The 5-Step Vulnerability Practice",
      "This Week's Action Checklist",
    ],
    ctaText: "Share with fathers in your community",
    ctaLabel: "Read Full Brief →",
    color: "#1B3A5C",
    bgColor: "#e8ecf4",
    badgeEmoji: "📋",
  },
  report: {
    eyebrow: "Report · Example",
    heading: "What a Report looks like",
    desc: "Reports are I.T.S.'s most rigorous publications — cited, peer-reviewed ready, and built for the audiences who fund, legislate, and design programs around fatherhood.",
    facts: [
      { label: "Format", value: "28-page Research PDF", colored: true },
      { label: "Audience", value: "Funders & Policymakers" },
      { label: "Read Time", value: "~60 minutes" },
      { label: "Ends With", value: "Policy recommendations", colored: true },
    ],
    docId: "ITS-RP-2025-01",
    docTitle: "Redefining Fatherhood in the Digital Era: A Study of Engaged Father Programs in Georgia, 2022–2024",
    docMeta: ["📅 January 2025", "✍️ I.T.S. Research Division", "📄 28 pages · Appendix", "⏱ 60 min read"],
    abstract:
      "This longitudinal study examines outcomes from 310 fathers enrolled in I.T.S. programs between 2022 and 2024, measuring changes in father-child engagement, financial literacy, digital literacy, and community involvement. Using mixed-methods analysis, the report identifies programmatic factors most predictive of sustained engagement.",
    findingLabel: "Primary Finding",
    findingText:
      "Fathers who completed all three components of the C3 Approach (Classes + Courses + Coaching) showed a 2.3× increase in self-reported father-child engagement at 6-month follow-up vs. single-component participants (p < 0.01).",
    sections: [
      "Executive Summary",
      "Literature Review: Fatherhood Research 2015–2024",
      "Research Design & Methodology",
      "Participant Demographics & Program Data",
      "Findings: Engagement Outcomes (6 Figures)",
      "Policy & Program Recommendations",
      "Appendix: Survey Instruments, Data Tables",
    ],
    ctaText: "Cite in grant applications & advocacy",
    ctaLabel: "Download Report →",
    color: "#1a6b4a",
    bgColor: "#e5f4ed",
    badgeEmoji: "📊",
  },
};

const browseCards = [
  { type: "brief" as TabType, emoji: "📋", title: "Fear of Vulnerability: A Father's Guide to Emotional Honesty", excerpt: "How embracing vulnerability — not avoiding it — builds deeper trust with your children and strengthens your identity as a father.", date: "Mar 2025 · 2 pp" },
  { type: "insight" as TabType, emoji: "💡", title: "Digital Barriers to Fatherhood Engagement: What the Data Tells Us", excerpt: "Survey findings from 210 MetaDad participants reveal where technology helps and where it hurts father-child connection.", date: "Feb 2025 · 8 pp" },
  { type: "article" as TabType, emoji: "✍️", title: "The Day I Put My Phone Down and Actually Saw My Son", excerpt: "One father's honest account of distraction, missed moments, and the three small shifts that transformed his daily presence.", date: "Mar 2025 · 6 min" },
  { type: "report" as TabType, emoji: "📊", title: "Redefining Fatherhood in the Digital Era: A 2-Year Study of Engaged Father Programs", excerpt: "Longitudinal outcomes from 310 fathers enrolled in I.T.S. programs, 2022–2024, with policy recommendations.", date: "Jan 2025 · 28 pp" },
  { type: "brief" as TabType, emoji: "📋", title: "Leadership in Fatherhood: Leading by Example for Your Kids", excerpt: "Four principles from the Fatherhood Toolbox translated into a simple daily checklist for fathers building their leadership.", date: "Dec 2024 · 3 pp" },
  { type: "article" as TabType, emoji: "✍️", title: "What My Father Never Said — And Why I Say It Every Day to My Kids", excerpt: "A personal reflection on breaking cycles of emotional silence in fatherhood, and the power of three words spoken daily.", date: "Nov 2024 · 5 min" },
  { type: "report" as TabType, emoji: "📊", title: "Journey 2 Manhood: Two-Year Mentorship Outcomes for Fatherless Youth", excerpt: "A comprehensive evaluation of the J2M program, measuring life skills development, academic performance, and mentor relationship quality.", date: "Oct 2024 · 34 pp" },
];

export default function ResearchHubPage() {
  const [activeTab, setActiveTab] = useState<TabType>("insight");

  const typeMap: Record<TabType, { color: string; bgColor: string }> = {
    insight: { color: "#b85c00", bgColor: "#fdf0e5" },
    article: { color: "#7a39bb", bgColor: "#f0eaf9" },
    brief: { color: "#1B3A5C", bgColor: "#e8ecf4" },
    report: { color: "#1a6b4a", bgColor: "#e5f4ed" },
  };

  const example = tabExamples[activeTab];

  return (
    <>
      {/* ── HERO ── */}
      <section className="bg-navy-500 text-white overflow-hidden relative" style={{ paddingBlock: "clamp(4rem,10vw,6rem)" }}>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 80% 50%, rgba(74,144,217,0.15) 0%, transparent 60%), radial-gradient(ellipse 40% 50% at 10% 80%, rgba(232,87,42,0.12) 0%, transparent 60%)",
          }}
        />
        <div className="container-wide relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <div
                className="inline-flex items-center gap-2 px-4 py-1 rounded-full text-xs font-semibold tracking-widest uppercase mb-5"
                style={{ background: "rgba(232,87,42,0.2)", border: "1px solid rgba(232,87,42,0.35)", color: "#f89f82" }}
              >
                <svg width="10" height="10" viewBox="0 0 12 12" fill="currentColor"><circle cx="6" cy="6" r="5"/></svg>
                Research &amp; Knowledge Hub
              </div>
              <h1 className="text-5xl md:text-6xl font-serif text-white mb-5 leading-tight">
                Know the Difference.<br />Find What You{" "}
                <span style={{ color: "#E8572A" }}>Need.</span>
              </h1>
              <p className="font-sans text-lg mb-8 max-w-xl leading-relaxed" style={{ color: "rgba(255,255,255,0.75)" }}>
                I.T.S. publishes four distinct types of content — Insights, Articles, Briefs, and Reports. Each serves a different purpose, audience, and depth. This guide helps you find the right resource for where you are in your fatherhood journey.
              </p>
              <div className="flex flex-wrap gap-4 mb-10">
                <a
                  href="#compare"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm text-white transition-all hover:-translate-y-0.5"
                  style={{ background: "#E8572A" }}
                >
                  Compare Content Types
                </a>
                <a
                  href="#examples"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all"
                  style={{ border: "1.5px solid rgba(255,255,255,0.25)", color: "rgba(255,255,255,0.85)" }}
                >
                  See Examples ↓
                </a>
              </div>
              <div className="flex gap-10 pt-6" style={{ borderTop: "1px solid rgba(255,255,255,0.12)" }}>
                {[
                  { num: "4", label: "Content Types" },
                  { num: "40+", label: "Publications" },
                  { num: "5K+", label: "Fathers Reached" },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="text-3xl font-serif font-bold text-white">{s.num}</div>
                    <div className="font-sans text-xs mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3" aria-hidden="true">
              {[
                { emoji: "💡", label: "Insight", desc: "Data-informed analysis with practical takeaways. Connects research to real fatherhood decisions.", color: "rgba(232,160,106,0.25)", labelColor: "#e8a06a" },
                { emoji: "✍️", label: "Article", desc: "Narrative-driven editorial pieces exploring fatherhood through personal story and cultural context.", color: "rgba(168,111,223,0.25)", labelColor: "#a86fdf" },
                { emoji: "📋", label: "Brief", desc: "2–4 page rapid summary. Key findings, fast action. Perfect for busy fathers who need the essentials now.", color: "rgba(107,144,212,0.25)", labelColor: "#7ba3e0" },
                { emoji: "📊", label: "Report", desc: "Comprehensive research with methodology, findings, and policy recommendations. Built for partners and advocates.", color: "rgba(93,184,138,0.25)", labelColor: "#5db88a" },
              ].map((card) => (
                <div
                  key={card.label}
                  className="flex items-start gap-4 p-4 rounded-xl transition-all"
                  style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-lg"
                    style={{ background: card.color }}
                  >
                    {card.emoji}
                  </div>
                  <div>
                    <div className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: card.labelColor }}>{card.label}</div>
                    <div className="font-sans text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>{card.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── COMPARE ── */}
      <section id="compare" className="section-padding bg-stone-50">
        <div className="container-wide">
          <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-navy-500 mb-4">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="10" height="10" rx="2"/><path d="M5 7h4M7 5v4"/></svg>
            Content Types Explained
          </div>
          <h2 className="text-4xl font-serif text-stone-900 mb-3">Four Types. One Mission.</h2>
          <p className="font-sans text-stone-500 max-w-2xl mb-10 leading-relaxed">
            Every publication from I.T.S. is designed to empower fathers — but at different levels of depth, for different needs and audiences. Here's what sets each apart.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">
            {contentTypes.map((ct) => (
              <div
                key={ct.id}
                className="rounded-xl overflow-hidden border border-stone-200 bg-white shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200"
              >
                <div className="p-5 border-b border-stone-100">
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase mb-4"
                    style={{ background: ct.bgColor, color: ct.color }}
                  >
                    {ct.emoji} {ct.label}
                  </span>
                  <h3 className="font-serif text-lg text-stone-900 mb-1">{ct.tagline}</h3>
                  <p className="font-sans text-sm text-stone-400 italic">{ct.sub}</p>
                </div>
                <div className="p-5">
                  <p className="font-sans text-sm text-stone-600 leading-relaxed mb-4">{ct.definition}</p>
                  <ul className="flex flex-col gap-2 mb-4">
                    {ct.traits.map((t, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm font-sans text-stone-500">
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5" style={{ background: ct.color }} />
                        {t}
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-stone-100">
                    {ct.chips.map((chip) => (
                      <span key={chip} className="text-xs text-stone-500 bg-stone-50 border border-stone-200 px-2.5 py-1 rounded-full">{chip}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Comparison table */}
          <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse font-sans text-sm">
                <thead>
                  <tr>
                    <th className="p-4 text-left text-xs font-bold tracking-wider uppercase text-stone-500 bg-stone-50 border-b border-stone-200">Dimension</th>
                    {[
                      { label: "💡 Insight", color: "#b85c00" },
                      { label: "✍️ Article", color: "#7a39bb" },
                      { label: "📋 Brief", color: "#1B3A5C" },
                      { label: "📊 Report", color: "#1a6b4a" },
                    ].map((h) => (
                      <th key={h.label} className="p-4 text-left text-xs font-bold tracking-wider uppercase bg-stone-50 border-b border-stone-200" style={{ color: h.color, borderTop: `3px solid ${h.color}` }}>{h.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { dim: "Primary Audience", vals: ["Program staff, coaches, mentors", "All fathers; general public", "Fathers, family members, community", "Nonprofits, policymakers, funders"] },
                    { dim: "Length", vals: ["6–12 pages", "800–2,000 words", "2–4 pages", "15–40 pages"] },
                    { dim: "Reading Time", vals: ["10–15 minutes", "5–8 minutes", "3–5 minutes", "45–90 minutes"] },
                    { dim: "Data & Evidence", vals: ["Charts, graphs, survey excerpts", "Anecdotal; light citations", "Summary-level; no citations required", "Full methodology, literature review"] },
                    { dim: "Tone", vals: ["Analytical, informative, balanced", "Personal, narrative, conversational", "Encouraging, plain language, direct", "Academic, formal, objective"] },
                    { dim: "Best Used For", vals: ["Program planning; training workshops", "Blog, newsletter, social sharing", "Sharing with fathers; quick reference", "Grant applications; policy advocacy"] },
                    { dim: "Output Format", vals: ["PDF with infographics", "Web page, blog post, PDF", "PDF, social card, one-pager", "PDF report with full appendix"] },
                  ].map((row, i) => (
                    <tr key={row.dim} className={i % 2 === 0 ? "bg-white" : "bg-stone-50/50"}>
                      <td className="p-4 font-semibold text-stone-700 text-xs uppercase tracking-wide border-b border-stone-100 bg-stone-50">{row.dim}</td>
                      {row.vals.map((val, j) => (
                        <td key={j} className="p-4 text-stone-600 border-b border-stone-100">{val}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ── AT A GLANCE ── */}
      <section className="bg-navy-500 text-white" style={{ paddingBlock: "clamp(4rem,9vw,6rem)" }}>
        <div className="container-wide">
          <div className="text-center mb-12">
            <div className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#f89f82" }}>At a Glance</div>
            <h2 className="text-4xl font-serif text-white mb-3">Quick Dimensions</h2>
            <p className="font-sans max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.65)" }}>
              From a quick reference to a full investigation — pick the format that matches your depth of need.
            </p>
          </div>

          <div className="h-1.5 rounded-full mb-16" style={{ background: "linear-gradient(to right, rgba(232,160,106,0.8), rgba(168,111,223,0.8), rgba(107,144,212,0.8), rgba(93,184,138,0.8))" }} />

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {spectrumNodes.map((node) => (
              <div
                key={node.id}
                className="text-center p-6 rounded-xl border transition-all"
                style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.12)" }}
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl border-2"
                  style={{ background: node.bgColor, borderColor: node.borderColor }}
                >
                  {node.emoji}
                </div>
                <div className="text-xl font-serif text-white mb-1">{node.name}</div>
                <div className="font-sans text-sm italic mb-5 leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>{node.oneLiner}</div>
                <div className="flex flex-col gap-2 text-left">
                  {node.dims.map((d) => (
                    <div key={d.key} className="flex justify-between items-center px-3 py-2 rounded-md text-xs" style={{ background: "rgba(255,255,255,0.04)" }}>
                      <span className="font-semibold uppercase tracking-wide" style={{ color: "rgba(255,255,255,0.45)" }}>{d.key}</span>
                      <span className="font-semibold" style={{ color: "rgba(255,255,255,0.8)" }}>{d.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EXAMPLES (Tabbed) ── */}
      <section id="examples" className="section-padding bg-stone-100">
        <div className="container-wide">
          <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-navy-500 mb-4">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7h8M3 4h8M3 10h5"/></svg>
            Real Examples
          </div>
          <h2 className="text-4xl font-serif text-stone-900 mb-3">See Each Type in Action</h2>
          <p className="font-sans text-stone-500 max-w-2xl mb-8 leading-relaxed">
            Click each content type below to see how a real I.T.S. Fatherhood topic looks in that format. You can see a quick brief to a full research report.
          </p>

          {/* Tabs */}
          <div className="flex gap-2 mb-10 bg-stone-200 p-1 rounded-full w-fit flex-wrap" role="tablist">
            {(["insight", "article", "brief", "report"] as TabType[]).map((tab) => {
              const ct = contentTypes.find((c) => c.id === tab)!;
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveTab(tab)}
                  className="px-5 py-2 rounded-full text-sm font-semibold transition-all"
                  style={
                    isActive
                      ? { background: ct.color, color: "#fff" }
                      : { color: "#6b7280", background: "transparent" }
                  }
                >
                  {ct.emoji} {ct.label}
                </button>
              );
            })}
          </div>

          {/* Tab panel */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10 items-start">
            <div className="lg:col-span-2 lg:sticky" style={{ top: "calc(64px + 1.5rem)" }}>
              <div className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: example.color }}>
                {example.eyebrow}
              </div>
              <h3 className="text-2xl font-serif text-stone-900 mb-3">{example.heading}</h3>
              <p className="font-sans text-stone-500 leading-relaxed mb-5">{example.desc}</p>
              <div className="flex flex-col gap-2">
                {example.facts.map((f) => (
                  <div key={f.label} className="flex items-center justify-between px-4 py-3 bg-white rounded-lg border border-stone-200">
                    <span className="text-xs font-semibold uppercase tracking-wide text-stone-400">{f.label}</span>
                    <span className="text-sm font-semibold" style={{ color: f.colored ? example.color : "#374151" }}>{f.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-3 bg-white rounded-xl border border-stone-200 shadow-md overflow-hidden">
              <div className="p-6 border-b border-stone-100">
                <div className="flex items-center gap-3 mb-5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase" style={{ background: example.bgColor, color: example.color }}>
                    {example.badgeEmoji} {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                  </span>
                  <span className="text-xs font-bold tracking-wide text-stone-300">{example.docId}</span>
                </div>
                <h4 className="font-serif text-lg text-stone-900 leading-snug mb-3">{example.docTitle}</h4>
                <div className="flex flex-wrap gap-3">
                  {example.docMeta.map((m) => (
                    <span key={m} className="text-xs text-stone-400">{m}</span>
                  ))}
                </div>
              </div>
              <div className="p-6">
                <p className="font-sans text-sm text-stone-700 leading-relaxed mb-4">{example.abstract}</p>
                <div className="p-4 rounded-lg mb-4" style={{ background: example.bgColor, borderLeft: `3px solid ${example.color}` }}>
                  <div className="text-xs font-bold tracking-wide uppercase mb-1" style={{ color: example.color }}>{example.findingLabel}</div>
                  <div className="font-sans text-sm text-stone-700 leading-relaxed">{example.findingText}</div>
                </div>
                <p className="font-sans text-sm font-bold text-stone-800 mb-2">
                  {activeTab === "report" ? "Table of Contents:" : "What you'll read:"}
                </p>
                <ol className="flex flex-col gap-2">
                  {example.sections.map((s, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm font-sans text-stone-500 pb-2 border-b border-stone-100 last:border-0">
                      <span className="text-xs font-bold text-stone-300 w-5 flex-shrink-0">{String(i + 1).padStart(2, "0")}</span>
                      {s}
                    </li>
                  ))}
                </ol>
              </div>
              <div className="px-6 py-4 flex items-center justify-between gap-4 flex-wrap bg-stone-50 border-t border-stone-100">
                <span className="text-sm text-stone-400">{example.ctaText}</span>
                <span
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold text-white"
                  style={{ background: example.color }}
                >
                  {example.ctaLabel}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BROWSE ALL ── */}
      <section id="browse" className="section-padding bg-white">
        <div className="container-wide">
          <div className="text-xs font-bold tracking-widest uppercase text-navy-500 mb-4">Browse Recent Publications</div>
          <h2 className="text-4xl font-serif text-stone-900 mb-3">Latest from the Research Hub</h2>
          <p className="font-sans text-stone-500 max-w-xl mb-10 leading-relaxed">
            Sample publications showing what each content type looks like in the library.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-10">
            {browseCards.map((card, i) => {
              const colors = typeMap[card.type];
              return (
                <article key={i} className="bg-white rounded-xl border border-stone-200 p-5 flex flex-col gap-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase" style={{ background: colors.bgColor, color: colors.color }}>
                      {card.emoji} {card.type.charAt(0).toUpperCase() + card.type.slice(1)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-serif text-stone-900 text-base leading-snug mb-2">{card.title}</h3>
                    <p className="font-sans text-sm text-stone-500 leading-relaxed line-clamp-2">{card.excerpt}</p>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                    <span className="text-xs text-stone-300">{card.date}</span>
                    <a href="https://www.itsfatherhood.org" target="_blank" rel="noopener noreferrer" className="text-xs font-bold flex items-center gap-1 hover:gap-2 transition-all" style={{ color: colors.color }}>
                      Read {card.type.charAt(0).toUpperCase() + card.type.slice(1)} →
                    </a>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="text-center pt-4">
            <Link href="/publications" className="btn-primary">
              View All Publications
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
