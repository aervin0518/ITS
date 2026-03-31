import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

async function getCallerRole(userId: string): Promise<string | null> {
  const admin = createAdminClient();
  const { data } = await admin
    .from("user_profiles")
    .select("id, user_roles(role_id, roles(name))")
    .eq("id", userId)
    .single();
  return (data as any)?.user_roles?.[0]?.roles?.name ?? null;
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const callerRole = await getCallerRole(user.id);
  if (callerRole !== "Admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const adminClient = createAdminClient();
  const { data: profiles, error } = await adminClient
    .from("user_profiles")
    .select("*, user_roles(role_id, roles(id, name))")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Flatten the role join into a simple field
  const users = (profiles ?? []).map((p: any) => ({
    id: p.id,
    email: p.email,
    first_name: p.first_name,
    last_name: p.last_name,
    status: p.status,
    created_at: p.created_at,
    updated_at: p.updated_at,
    role: p.user_roles?.[0]?.roles?.name ?? null,
    role_id: p.user_roles?.[0]?.roles?.id ?? null,
  }));

  return NextResponse.json({ users });
}
