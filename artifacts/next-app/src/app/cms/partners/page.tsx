import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CmsPageShell from "@/components/cms/CmsPageShell";
import { Handshake, Plus, ExternalLink } from "lucide-react";

export const metadata = { title: "Partners — I.T.S. CMS" };

export default async function PartnersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <CmsPageShell
      title="Partners"
      description="Manage partner access, shared reports, and assigned resources."
      icon={<Handshake size={20} />}
      action={{ label: "Add Partner", icon: <Plus size={16} /> }}
    >
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-[#111114]">Active Partners</h2>
        </div>
        <div className="p-8 text-center text-gray-400">
          <Handshake size={36} className="mx-auto mb-3 text-gray-300" />
          <p className="font-medium text-gray-500">No partners yet</p>
          <p className="text-sm mt-1">Invite partner organisations to share selected reports and publications.</p>
        </div>
      </div>
    </CmsPageShell>
  );
}
