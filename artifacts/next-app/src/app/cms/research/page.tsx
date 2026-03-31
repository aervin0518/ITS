import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CmsPageShell from "@/components/cms/CmsPageShell";
import { FlaskConical, Upload, Database, FileDown } from "lucide-react";

export const metadata = { title: "Research Data — I.T.S. CMS" };

export default async function ResearchPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <CmsPageShell
      title="Research Data"
      description="Central repository for structured research data, survey responses, and assessment profiles."
      icon={<FlaskConical size={20} />}
      action={{ label: "Upload Data", icon: <Upload size={16} /> }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Survey Responses", value: "—", icon: <Database size={20} />, color: "bg-teal-50 text-teal-700" },
          { label: "Assessment Profiles", value: "—", icon: <FlaskConical size={20} />, color: "bg-blue-50 text-blue-700" },
          { label: "Fatherhood Profiles", value: "—", icon: <FileDown size={20} />, color: "bg-purple-50 text-purple-700" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${s.color}`}>{s.icon}</div>
            <p className="text-2xl font-bold text-[#111114]">{s.value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-[#111114]">Data Sets</h2>
          <button className="text-sm text-[#152A4A] font-medium hover:underline flex items-center gap-1">
            <FileDown size={14} /> Export CSV
          </button>
        </div>
        <div className="p-8 text-center text-gray-400">
          <Database size={36} className="mx-auto mb-3 text-gray-300" />
          <p className="font-medium text-gray-500">No data sets yet</p>
          <p className="text-sm mt-1">Upload survey responses or connect the Jotform integration.</p>
        </div>
      </div>
    </CmsPageShell>
  );
}
