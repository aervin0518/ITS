"use client";

import Link from "next/link";
import {
  Users, FileText, ScrollText, Mic, ClipboardList, FlaskConical,
  Layers, BookOpen, ArrowRight, Activity, AlertCircle,
} from "lucide-react";

interface Stats {
  userCount: number;
  fatherCount: number;
  publicationCount: number;
  transcriptCount: number;
  surveyCount: number;
  interviewCount: number;
  assessmentCount: number;
  programCount: number;
  pendingTranscripts: number;
  pendingInterviews: number;
}

interface Props {
  profile: { id: string; email: string; first_name: string | null; last_name: string | null; role: string };
  stats: Stats;
}

const ROLE_QUICK_LINKS: Record<string, { label: string; href: string; icon: React.ReactNode; color: string }[]> = {
  Admin: [
    { label: "Father Profiles", href: "/cms/father-profiles", icon: <Users size={20} />, color: "bg-purple-100 text-purple-700" },
    { label: "Transcripts", href: "/cms/transcripts", icon: <ScrollText size={20} />, color: "bg-green-100 text-green-700" },
    { label: "Programs", href: "/cms/programs", icon: <Layers size={20} />, color: "bg-teal-100 text-teal-700" },
    { label: "Publications", href: "/cms/publications", icon: <BookOpen size={20} />, color: "bg-amber-100 text-amber-700" },
  ],
  "Program Admin": [
    { label: "Father Profiles", href: "/cms/father-profiles", icon: <Users size={20} />, color: "bg-purple-100 text-purple-700" },
    { label: "Programs", href: "/cms/programs", icon: <Layers size={20} />, color: "bg-teal-100 text-teal-700" },
    { label: "Publications", href: "/cms/publications", icon: <BookOpen size={20} />, color: "bg-amber-100 text-amber-700" },
    { label: "Reports", href: "/cms/reports", icon: <FlaskConical size={20} />, color: "bg-green-100 text-green-700" },
  ],
  Researcher: [
    { label: "Father Profiles", href: "/cms/father-profiles", icon: <Users size={20} />, color: "bg-purple-100 text-purple-700" },
    { label: "Transcripts", href: "/cms/transcripts", icon: <ScrollText size={20} />, color: "bg-green-100 text-green-700" },
    { label: "Interviews", href: "/cms/interviews", icon: <Mic size={20} />, color: "bg-blue-100 text-blue-700" },
    { label: "Surveys", href: "/cms/surveys", icon: <ClipboardList size={20} />, color: "bg-teal-100 text-teal-700" },
  ],
  Partner: [
    { label: "Reports", href: "/cms/reports", icon: <FlaskConical size={20} />, color: "bg-green-100 text-green-700" },
  ],
  Subscriber: [
    { label: "Published Content", href: "/cms/subscriber-content", icon: <BookOpen size={20} />, color: "bg-amber-100 text-amber-700" },
    { label: "Research Insights", href: "/cms/subscriber-insights", icon: <Activity size={20} />, color: "bg-purple-100 text-purple-700" },
  ],
};

const ROLE_DESCRIPTION: Record<string, string> = {
  Admin: "Full system access — manage users, content, research data, and platform settings.",
  "Program Admin": "Manage your program area, approve content, and track outcomes.",
  Researcher: "Upload transcripts, manage research data, and generate insights.",
  Partner: "View assigned reports and shared resources.",
  Subscriber: "Access published content and research insights.",
};

export default function DashboardOverview({ profile, stats }: Props) {
  const firstName = profile.first_name ?? profile.email.split("@")[0];
  const quickLinks = ROLE_QUICK_LINKS[profile.role] ?? [];
  const isAdmin = profile.role === "Admin";
  const isResearcher = ["Admin", "Program Admin", "Researcher"].includes(profile.role);

  const hasPendingWork = stats.pendingTranscripts > 0 || stats.pendingInterviews > 0;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#111114]">Good day, {firstName}</h1>
        <p className="text-gray-500 mt-1">{ROLE_DESCRIPTION[profile.role]}</p>
      </div>

      {/* Pending work alerts */}
      {isResearcher && hasPendingWork && (
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl px-5 py-4">
          <div className="flex items-start gap-3">
            <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-amber-800">Pending Review</p>
              <div className="flex flex-wrap gap-4 mt-1">
                {stats.pendingTranscripts > 0 && (
                  <Link href="/cms/transcripts" className="text-sm text-amber-700 hover:underline">
                    {stats.pendingTranscripts} transcript{stats.pendingTranscripts !== 1 ? "s" : ""} awaiting review
                  </Link>
                )}
                {stats.pendingInterviews > 0 && (
                  <Link href="/cms/interviews" className="text-sm text-amber-700 hover:underline">
                    {stats.pendingInterviews} scheduled interview{stats.pendingInterviews !== 1 ? "s" : ""}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats row — Admin */}
      {isAdmin && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Users", value: stats.userCount, icon: <Users size={18} />, color: "text-purple-600", bg: "bg-purple-50", href: "/cms/users" },
            { label: "Father Profiles", value: stats.fatherCount, icon: <Users size={18} />, color: "text-blue-600", bg: "bg-blue-50", href: "/cms/father-profiles" },
            { label: "Publications", value: stats.publicationCount, icon: <BookOpen size={18} />, color: "text-amber-600", bg: "bg-amber-50", href: "/cms/publications" },
            { label: "Programs", value: stats.programCount, icon: <Layers size={18} />, color: "text-teal-600", bg: "bg-teal-50", href: "/cms/programs" },
          ].map((stat) => (
            <Link key={stat.label} href={stat.href} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition">
              <div className={`${stat.bg} ${stat.color} w-9 h-9 rounded-lg flex items-center justify-center mb-3`}>
                {stat.icon}
              </div>
              <p className="text-2xl font-bold text-[#111114]">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-0.5">{stat.label}</p>
            </Link>
          ))}
        </div>
      )}

      {/* Research stats row */}
      {isResearcher && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Interviews", value: stats.interviewCount, icon: <Mic size={18} />, color: "text-blue-600", bg: "bg-blue-50", href: "/cms/interviews" },
            { label: "Transcripts", value: stats.transcriptCount, icon: <ScrollText size={18} />, color: "text-green-600", bg: "bg-green-50", href: "/cms/transcripts" },
            { label: "Survey Responses", value: stats.surveyCount, icon: <ClipboardList size={18} />, color: "text-teal-600", bg: "bg-teal-50", href: "/cms/surveys" },
            { label: "Assessments", value: stats.assessmentCount, icon: <FlaskConical size={18} />, color: "text-purple-600", bg: "bg-purple-50", href: "/cms/surveys" },
          ].map((stat) => (
            <Link key={stat.label} href={stat.href} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition">
              <div className={`${stat.bg} ${stat.color} w-9 h-9 rounded-lg flex items-center justify-center mb-3`}>
                {stat.icon}
              </div>
              <p className="text-2xl font-bold text-[#111114]">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-0.5">{stat.label}</p>
            </Link>
          ))}
        </div>
      )}

      {/* Quick access */}
      {quickLinks.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-4">Quick Access</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md hover:border-gray-200 transition-all group"
              >
                <div className={`${link.color} w-10 h-10 rounded-lg flex items-center justify-center mb-3`}>
                  {link.icon}
                </div>
                <p className="text-sm font-semibold text-[#111114]">{link.label}</p>
                <div className="flex items-center gap-1 mt-1 text-xs text-gray-400 group-hover:text-[#C8963E] transition-colors">
                  <span>Open</span>
                  <ArrowRight size={12} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Recent Activity — audit log entries */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity size={16} className="text-[#C8963E]" />
            <h2 className="font-semibold text-[#111114]">Platform Summary</h2>
          </div>
        </div>
        <div className="divide-y divide-gray-50">
          {((): { label: string; value: number; sub: string; href: string }[] => {
            if (["Subscriber", "Partner"].includes(profile.role)) {
              return [
                { label: "Published resources", value: stats.publicationCount, sub: "publications", href: "/cms/subscriber-content" },
                { label: "Active programs", value: stats.programCount, sub: "total", href: "/cms/subscriber-insights" },
              ];
            }
            return [
              { label: "Father profiles on record", value: stats.fatherCount, sub: "total", href: "/cms/father-profiles" },
              { label: "Transcripts uploaded", value: stats.transcriptCount, sub: `${stats.pendingTranscripts} pending review`, href: "/cms/transcripts" },
              { label: "Interviews logged", value: stats.interviewCount, sub: `${stats.pendingInterviews} scheduled`, href: "/cms/interviews" },
              { label: "Published resources", value: stats.publicationCount, sub: "publications", href: "/cms/publications" },
            ];
          })().map((row) => (
            <Link key={row.label} href={row.href} className="flex items-center justify-between px-6 py-3.5 hover:bg-gray-50 transition group">
              <span className="text-sm text-gray-600">{row.label}</span>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400">{row.sub}</span>
                <span className="text-sm font-bold text-[#111114] w-8 text-right">{row.value}</span>
                <ArrowRight size={13} className="text-gray-300 group-hover:text-[#C8963E] transition" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
