import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { insertAuditLog } from "@/lib/audit";

async function getAuth(userId: string) {
  const admin = createAdminClient();
  const { data } = await admin
    .from("user_profiles")
    .select("email, user_roles(roles(name))")
    .eq("id", userId)
    .single();
  return {
    role: (data as any)?.user_roles?.[0]?.roles?.name ?? null,
    email: (data as any)?.email ?? null,
  };
}

const ALLOWED = ["Admin", "Program Admin"];

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { role } = await getAuth(user.id);
  if (!role) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const q = searchParams.get("q");

  const admin = createAdminClient();
  let query = admin.from("programs").select("*").order("name", { ascending: true });
  if (status) query = query.eq("status", status);
  if (q) query = query.ilike("name", `%${q}%`);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ programs: data });
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { role, email } = await getAuth(user.id);
  if (!role || !ALLOWED.includes(role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const { name, program_type, status } = body;
  if (!name) return NextResponse.json({ error: "name is required" }, { status: 400 });

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("programs")
    .insert({ name, program_type: program_type ?? null, status: status ?? "active" })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await insertAuditLog({
    user_id: user.id,
    action: "program.create",
    entity_type: "program",
    entity_id: data.id,
    details_json: { actor_email: email, name },
  });

  return NextResponse.json({ program: data }, { status: 201 });
}
