import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import CmsShell from "@/components/cms/CmsShell";

export default async function CmsLayout({ children }: { children: React.ReactNode }) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return <>{children}</>;
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("user_profiles")
    .select("id, email, first_name, last_name, user_roles(roles(name))")
    .eq("id", user.id)
    .single();

  const role = (profile as any)?.user_roles?.[0]?.roles?.name ?? "Subscriber";

  return (
    <CmsShell
      profile={{
        id: (profile as any)?.id ?? user.id,
        email: (profile as any)?.email ?? user.email ?? "",
        first_name: (profile as any)?.first_name ?? null,
        last_name: (profile as any)?.last_name ?? null,
        role,
      }}
    >
      {children}
    </CmsShell>
  );
}
