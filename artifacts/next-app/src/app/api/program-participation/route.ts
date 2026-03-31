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

const ALLOWED = ["Admin", "Program Admin", "Researcher"];

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { role } = await getAuth(user.id);
  if (!role || !ALLOWED.includes(role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const fatherProfileId = searchParams.get("father_profile_id");
  const programId = searchParams.get("program_id");

  const admin = createAdminClient();
  let query = admin
    .from("program_participation")
    .select("*, programs(id, name, program_type), father_profiles(id, display_name, first_name, last_name)")
    .order("start_date", { ascending: false });

  if (fatherProfileId) query = query.eq("father_profile_id", fatherProfileId);
  if (programId) query = query.eq("program_id", programId);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ participation: data });
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { role, email } = await getAuth(user.id);
  if (!role || !ALLOWED.includes(role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const { father_profile_id, program_id, participation_role, start_date, end_date, status } = body;

  if (!father_profile_id || !program_id) {
    return NextResponse.json({ error: "father_profile_id and program_id are required" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("program_participation")
    .insert({
      father_profile_id,
      program_id,
      participation_role: participation_role || null,
      start_date: start_date || null,
      end_date: end_date || null,
      status: status || "active",
    })
    .select("*, programs(id, name, program_type)")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await insertAuditLog({
    user_id: user.id,
    action: "program_participation.create",
    entity_type: "program_participation",
    entity_id: data.id,
    details_json: { actor_email: email, father_profile_id, program_id },
  });

  return NextResponse.json({ participation: data }, { status: 201 });
}
