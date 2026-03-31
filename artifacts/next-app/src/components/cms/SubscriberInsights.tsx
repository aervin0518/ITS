"use client";

import { useState, useEffect } from "react";
import { BarChart3, Users, BookOpen, Mic, ClipboardList, Layers, ArrowRight, Loader2, TrendingUp } from "lucide-react";
import Link from "next/link";

interface Insights {
  activePrograms: number;
  consentedFathers: number;
  publishedResearch: number;
  interviewsConducted: number;
  assessmentsCompleted: number;
  programTypeBreakdown: Record<string, number>;
  recentPublications: Array<{ id: string; title: string; publication_type: string | null; abstract: string | null; published_at: string | null }>;
}

const TYPE_COLORS = [
  "bg-blue-500", "bg-purple-500", "bg-teal-500",
  "bg-amber-500", "bg-green-500", "bg-pink-500",
];

export default function SubscriberInsights() {
  const [insights, setInsights] = useState<Insights | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/cms/insights")
      .then(r => r.json())
      .then(d => {
        if (d.error) throw new Error(d.error);
        setInsights(d.insights);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-8 max-w-5xl mx-auto text-center py-24">
        <Loader2 size={32} className="mx-auto animate-spin text-gray-300 mb-3" />
        <p className="text-sm text-gray-400">Loading research insights…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-5xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: "Active Programs",
      value: insights?.activePrograms ?? 0,
      icon: <Layers size={22} />,
      color: "bg-teal-50 text-teal-700",
      description: "Currently running fatherhood programs",
    },
    {
      label: "Fathers Engaged",
      value: insights?.consentedFathers ?? 0,
      icon: <Users size={22} />,
      color: "bg-blue-50 text-blue-700",
      description: "Consented participants in the platform",
    },
    {
      label: "Published Research",
      value: insights?.publishedResearch ?? 0,
      icon: <BookOpen size={22} />,
      color: "bg-amber-50 text-amber-700",
      description: "Research briefs, reports, and publications",
    },
    {
      label: "Interviews Conducted",
      value: insights?.interviewsConducted ?? 0,
      icon: <Mic size={22} />,
      color: "bg-purple-50 text-purple-700",
      description: "Qualitative research interviews logged",
    },
    {
      label: "Assessments Completed",
      value: insights?.assessmentsCompleted ?? 0,
      icon: <ClipboardList size={22} />,
      color: "bg-green-50 text-green-700",
      description: "Individual father assessments recorded",
    },
  ];

  const programTypes = Object.entries(insights?.programTypeBreakdown ?? {});
  const maxProgramCount = Math.max(...programTypes.map(([, v]) => v), 1);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-700">
          <BarChart3 size={20} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-[#111114]">Research Insights</h1>
          <p className="text-sm text-gray-500">Aggregate data and impact metrics from I.T.S. Fatherhood programs and research.</p>
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-sm transition">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
              {s.icon}
            </div>
            <p className="text-3xl font-bold text-[#111114] tabular-nums">{s.value.toLocaleString()}</p>
            <p className="text-sm font-semibold text-gray-700 mt-0.5">{s.label}</p>
            <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{s.description}</p>
          </div>
        ))}
      </div>

      {/* Program Type Breakdown */}
      {programTypes.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp size={16} className="text-[#152A4A]" />
            <h2 className="font-bold text-[#111114]">Active Programs by Type</h2>
          </div>
          <div className="space-y-3">
            {programTypes.map(([type, count], i) => (
              <div key={type}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-700">{type}</span>
                  <span className="text-sm font-semibold text-[#111114]">{count}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${TYPE_COLORS[i % TYPE_COLORS.length]} transition-all duration-700`}
                    style={{ width: `${(count / maxProgramCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Publications */}
      {(insights?.recentPublications?.length ?? 0) > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <BookOpen size={16} className="text-[#152A4A]" />
              <h2 className="font-bold text-[#111114]">Latest Research</h2>
            </div>
            <Link
              href="/cms/subscriber-content"
              className="flex items-center gap-1 text-xs font-semibold text-[#C8963E] hover:underline"
            >
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-4">
            {insights?.recentPublications.map(pub => (
              <div key={pub.id} className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center shrink-0 mt-0.5">
                  <BookOpen size={14} className="text-amber-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#111114] leading-snug">{pub.title}</p>
                  {pub.publication_type && (
                    <p className="text-xs text-gray-400 mt-0.5">{pub.publication_type}</p>
                  )}
                  {pub.abstract && (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-1">{pub.abstract}</p>
                  )}
                </div>
                {pub.published_at && (
                  <p className="text-xs text-gray-400 shrink-0">
                    {new Date(pub.published_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state for insights */}
      {stats.every(s => s.value === 0) && programTypes.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 mt-4">
          <BarChart3 size={44} className="mx-auto mb-3 text-gray-200" />
          <p className="font-medium text-gray-500">Research data is being collected</p>
          <p className="text-sm text-gray-400 mt-1">Insights will appear here as the platform grows.</p>
        </div>
      )}
    </div>
  );
}
