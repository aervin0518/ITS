import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import TagsManager from "@/components/cms/TagsManager";

export const metadata = { title: "Tags — I.T.S. CMS" };

export default async function TagsPage() {
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
  if (!role || !["Admin", "Program Admin"].includes(role)) redirect("/cms/dashboard");

  return <TagsManager />;
}
