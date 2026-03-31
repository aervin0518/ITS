import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CmsPageShell from "@/components/cms/CmsPageShell";
import { FileText, Plus, Search, Filter } from "lucide-react";

export const metadata = { title: "Content — I.T.S. CMS" };

const CONTENT_TYPES = ["Article", "Report", "Event", "Resource", "Publication", "Insight", "Brief"];
const STATUSES = ["Draft", "In Review", "Published", "Archived"];

export default async function ContentPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <CmsPageShell
      title="Content"
      description="Create and manage articles, reports, events, resources, and publications."
      icon={<FileText size={20} />}
      action={{ label: "New Content", icon: <Plus size={16} /> }}
    >
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search content..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#152A4A]"
          />
        </div>
        <div className="flex gap-2">
          <select className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#152A4A]">
            <option value="">All Types</option>
            {CONTENT_TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
          <select className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#152A4A]">
            <option value="">All Statuses</option>
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Status tabs */}
      <div className="flex gap-1 mb-6 border-b border-gray-200">
        {["All", ...STATUSES].map((s) => (
          <button
            key={s}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              s === "All"
                ? "border-[#152A4A] text-[#152A4A]"
                : "border-transparent text-gray-500 hover:text-[#111114]"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Empty state */}
      <div className="text-center py-16 text-gray-400">
        <FileText size={40} className="mx-auto mb-3 text-gray-300" />
        <p className="font-medium text-gray-500">No content yet</p>
        <p className="text-sm mt-1">Create your first article, report, or resource.</p>
        <button className="mt-4 bg-[#152A4A] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#1E3A5F] transition">
          + New Content
        </button>
      </div>
    </CmsPageShell>
  );
}
