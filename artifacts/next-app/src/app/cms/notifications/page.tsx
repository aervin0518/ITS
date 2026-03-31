import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CmsPageShell from "@/components/cms/CmsPageShell";
import { Bell } from "lucide-react";

export const metadata = { title: "Notifications — I.T.S. CMS" };

export default async function NotificationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <CmsPageShell
      title="Notifications"
      description="Content approvals, research updates, and system alerts."
      icon={<Bell size={20} />}
    >
      <div className="space-y-3">
        {[
          { title: "Content approval workflow", desc: "Alerts when content moves through Draft → In Review → Published stages.", tag: "Content", tagColor: "bg-amber-100 text-amber-700" },
          { title: "New transcript uploads", desc: "Notified when a researcher uploads a new transcript.", tag: "Research", tagColor: "bg-green-100 text-green-700" },
          { title: "System notifications", desc: "Platform updates and administrative alerts.", tag: "System", tagColor: "bg-gray-100 text-gray-700" },
        ].map((n) => (
          <div key={n.title} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm flex items-start gap-4">
            <div className="w-2 h-2 rounded-full bg-gray-300 mt-2 shrink-0" />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="font-medium text-[#111114] text-sm">{n.title}</p>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${n.tagColor}`}>{n.tag}</span>
              </div>
              <p className="text-xs text-gray-500">{n.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="text-center text-sm text-gray-400 mt-8">No new notifications. Live alerts will appear here.</p>
    </CmsPageShell>
  );
}
