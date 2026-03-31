import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import CmsPageShell from "@/components/cms/CmsPageShell";
import SurveysManager from "@/components/cms/SurveysManager";
import { ClipboardList } from "lucide-react";

export const metadata = { title: "Surveys & Assessments — I.T.S. CMS" };

const ALLOWED = ["Admin", "Program Admin", "Researcher"];

export default async function SurveysPage() {
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
      title="Surveys & Assessments"
      description="JotForm survey responses and participant assessment results."
      icon={<ClipboardList size={20} />}
    >
      <SurveysManager />
    </CmsPageShell>
  );
}
