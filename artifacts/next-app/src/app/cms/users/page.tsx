import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import AdminDashboard from "@/components/cms/AdminDashboard";
import { UserWithRole } from "@/types/auth";

export const metadata = { title: "Users — I.T.S. CMS" };

export default async function UsersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();
  const { data: profileData } = await admin
    .from("user_profiles")
    .select("*, user_roles(role_id, roles(id, name))")
    .eq("id", user.id)
    .single();

  const role = (profileData as any)?.user_roles?.[0]?.roles?.name ?? null;
  if (role !== "Admin") redirect("/cms/dashboard");

  const profile: UserWithRole = {
    id: profileData.id,
    email: profileData.email,
    first_name: profileData.first_name,
    last_name: profileData.last_name,
    status: profileData.status,
    created_at: profileData.created_at,
    updated_at: profileData.updated_at,
    role,
    role_id: (profileData as any)?.user_roles?.[0]?.roles?.id ?? null,
  };

  return <AdminDashboard profile={profile} />;
}
