import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { insertAuditLog } from "@/lib/audit";

async function getRole(userId: string) {
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

const ALLOWED_ROLES = ["Admin", "Program Admin", "Researcher"];

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { role } = await getRole(user.id);
  if (!role || !ALLOWED_ROLES.includes(role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const fatherProfileId = searchParams.get("father_profile_id");
  const programId = searchParams.get("program_id");
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const limit = 50;
  const from = (page - 1) * limit;

  const admin = createAdminClient();
  let query = admin
    .from("interviews")
    .select("*, programs(id, name, program_type)", { count: "exact" })
    .order("interview_date", { ascending: false })
    .range(from, from + limit - 1);

  if (status) query = query.eq("status", status);
  if (fatherProfileId) query = query.eq("father_profile_id", fatherProfileId);
  if (programId) query = query.eq("program_id", programId);

  const { data, error, count } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ interviews: data, total: count, page });
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { role, email } = await getRole(user.id);
  if (!role || !ALLOWED_ROLES.includes(role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const { interview_date, status, notes, father_profile_id, program_id } = body;

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("interviews")
    .insert({
      interview_date: interview_date || null,
      status: status ?? "scheduled",
      notes: notes?.trim() || null,
      father_profile_id: father_profile_id || null,
      program_id: program_id || null,
      interviewer_user_id: user.id,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await insertAuditLog({
    userId: user.id,
    actorEmail: email ?? undefined,
    action: "interview.create",
    entityType: "interview",
    entityId: data.id,
    details: { status, interview_date },
  });

  return NextResponse.json({ interview: data });
}
