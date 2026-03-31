import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import CmsPageShell from "@/components/cms/CmsPageShell";
import FatherProfilesManager from "@/components/cms/FatherProfilesManager";
import { Users } from "lucide-react";

export const metadata = { title: "Father Profiles — I.T.S. CMS" };

const ALLOWED = ["Admin", "Program Admin", "Researcher"];

export default async function FatherProfilesPage() {
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
      title="Father Profiles"
      description="Participant records linked to surveys, interviews, and assessments."
      icon={<Users size={20} />}
    >
      <FatherProfilesManager />
    </CmsPageShell>
  );
}
