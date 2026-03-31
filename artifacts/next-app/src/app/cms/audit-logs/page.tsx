import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import CmsPageShell from "@/components/cms/CmsPageShell";
import AuditLogViewer from "@/components/cms/AuditLogViewer";
import { Shield } from "lucide-react";

export const metadata = { title: "Audit Log — I.T.S. CMS" };

export default async function AuditLogsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("user_profiles")
    .select("user_roles(roles(name))")
    .eq("id", user.id)
    .single();

  const role = (profile as any)?.user_roles?.[0]?.roles?.name;
  if (role !== "Admin") redirect("/cms/dashboard");

  return (
    <CmsPageShell
      title="Audit Log"
      description="Full record of login, user management, and data events across the platform."
      icon={<Shield size={20} />}
    >
      <AuditLogViewer />
    </CmsPageShell>
  );
}
