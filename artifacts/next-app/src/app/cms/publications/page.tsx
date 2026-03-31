import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import CmsPageShell from "@/components/cms/CmsPageShell";
import PublicationsManager from "@/components/cms/PublicationsManager";
import { BookOpen } from "lucide-react";

export const metadata = { title: "Publications — I.T.S. CMS" };

const ALLOWED = ["Admin", "Program Admin"];

export default async function PublicationsPage() {
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
  if (!role || !ALLOWED.includes(role)) redirect("/cms/dashboard");

  return (
    <CmsPageShell
      title="Publications"
      description="Manage reports, briefs, research findings, policy documents, and blog posts."
      icon={<BookOpen size={20} />}
    >
      <PublicationsManager />
    </CmsPageShell>
  );
}
