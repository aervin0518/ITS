import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CmsPageShell from "@/components/cms/CmsPageShell";
import { Tag, Plus } from "lucide-react";

export const metadata = { title: "Categories — I.T.S. CMS" };

const SAMPLE_CATEGORIES = [
  { name: "Fatherhood Research", count: 0, color: "#152A4A" },
  { name: "Community Outreach", count: 0, color: "#C8963E" },
  { name: "Program Reports", count: 0, color: "#1E3A5F" },
  { name: "Policy & Advocacy", count: 0, color: "#6A9EC5" },
  { name: "Field Interviews", count: 0, color: "#111114" },
];

export default async function CategoriesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <CmsPageShell
      title="Categories"
      description="Organize content with categories and tags."
      icon={<Tag size={20} />}
      action={{ label: "Add Category", icon: <Plus size={16} /> }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SAMPLE_CATEGORIES.map((cat) => (
          <div key={cat.name} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition cursor-pointer group">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
              <span className="font-semibold text-[#111114]">{cat.name}</span>
            </div>
            <p className="text-sm text-gray-400">{cat.count} items</p>
          </div>
        ))}
        <div className="bg-gray-50 rounded-xl border border-dashed border-gray-300 p-5 flex items-center justify-center cursor-pointer hover:bg-gray-100 transition">
          <div className="text-center text-gray-400">
            <Plus size={20} className="mx-auto mb-1" />
            <span className="text-sm">New category</span>
          </div>
        </div>
      </div>
    </CmsPageShell>
  );
}
