import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import CmsPageShell from "@/components/cms/CmsPageShell";
import { BarChart3, Download, Users, ScrollText, Mic, ClipboardList, FlaskConical, BookOpen, Layers } from "lucide-react";

export const metadata = { title: "Reports & Analytics — I.T.S. CMS" };

export default async function ReportsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();

  const [
    { count: fatherCount },
    { count: interviewCount },
    { count: surveyCount },
    { count: transcriptCount },
    { count: assessmentCount },
    { count: pubCount },
    { count: programCount },
    { count: pendingTranscripts },
    { count: completedInterviews },
    { count: consentedFathers },
  ] = await Promise.all([
    admin.from("father_profiles").select("id", { count: "exact", head: true }),
    admin.from("interviews").select("id", { count: "exact", head: true }),
    admin.from("survey_responses").select("id", { count: "exact", head: true }),
    admin.from("transcripts").select("id", { count: "exact", head: true }),
    admin.from("assessment_results").select("id", { count: "exact", head: true }),
    admin.from("publications").select("id", { count: "exact", head: true }),
    admin.from("programs").select("id", { count: "exact", head: true }),
    admin.from("transcripts").select("id", { count: "exact", head: true }).eq("processed_flag", false),
    admin.from("interviews").select("id", { count: "exact", head: true }).eq("status", "complete"),
    admin.from("father_profiles").select("id", { count: "exact", head: true }).eq("consent_status", "consented"),
  ]);

  const statCards = [
    { label: "Father Profiles", value: fatherCount ?? 0, sub: `${consentedFathers ?? 0} consented`, icon: <Users size={20} />, color: "bg-purple-50 text-purple-700", export: "father-profiles" },
    { label: "Interviews Logged", value: interviewCount ?? 0, sub: `${completedInterviews ?? 0} completed`, icon: <Mic size={20} />, color: "bg-blue-50 text-blue-700", export: "interviews" },
    { label: "Survey Responses", value: surveyCount ?? 0, sub: "total submissions", icon: <ClipboardList size={20} />, color: "bg-teal-50 text-teal-700", export: "survey-responses" },
    { label: "Transcripts", value: transcriptCount ?? 0, sub: `${pendingTranscripts ?? 0} pending review`, icon: <ScrollText size={20} />, color: "bg-green-50 text-green-700", export: "transcripts" },
    { label: "Assessments", value: assessmentCount ?? 0, sub: "results recorded", icon: <FlaskConical size={20} />, color: "bg-orange-50 text-orange-700", export: "assessment-results" },
    { label: "Publications", value: pubCount ?? 0, sub: "items", icon: <BookOpen size={20} />, color: "bg-amber-50 text-amber-700", export: "publications" },
    { label: "Programs", value: programCount ?? 0, sub: "active programs", icon: <Layers size={20} />, color: "bg-indigo-50 text-indigo-700", export: null },
  ];

  return (
    <CmsPageShell
      title="Reports & Analytics"
      description="Live operational metrics across all research and content modules."
      icon={<BarChart3 size={20} />}
    >
      {/* Live stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${card.color}`}>{card.icon}</div>
              {card.export && (
                <a
                  href={`/api/cms/export?type=${card.export}`}
                  download
                  className="flex items-center gap-1 text-xs text-gray-400 hover:text-[#152A4A] transition"
                  title={`Export ${card.label} as CSV`}
                >
                  <Download size={13} /> CSV
                </a>
              )}
            </div>
            <p className="text-3xl font-bold text-[#111114]">{card.value}</p>
            <p className="text-sm font-medium text-gray-700 mt-0.5">{card.label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Export all section */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
          <Download size={16} className="text-[#C8963E]" />
          <h2 className="font-semibold text-[#111114]">Export Data</h2>
        </div>
        <div className="p-6">
          <p className="text-sm text-gray-500 mb-4">
            Download complete datasets as CSV for analysis in Excel, SPSS, or Power BI.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: "Father Profiles", type: "father-profiles" },
              { label: "Interviews", type: "interviews" },
              { label: "Survey Responses", type: "survey-responses" },
              { label: "Assessment Results", type: "assessment-results" },
              { label: "Transcripts", type: "transcripts" },
              { label: "Publications", type: "publications" },
            ].map((e) => (
              <a
                key={e.type}
                href={`/api/cms/export?type=${e.type}`}
                download
                className="flex items-center gap-2 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 hover:border-[#152A4A] hover:text-[#152A4A] transition"
              >
                <Download size={14} className="text-gray-400" />
                {e.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </CmsPageShell>
  );
}
