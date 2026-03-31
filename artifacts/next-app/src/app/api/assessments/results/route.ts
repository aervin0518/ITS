import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { insertAuditLog } from "@/lib/audit";

const ALLOWED = ["Admin", "Program Admin", "Researcher"];

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

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { role } = await getAuth(user.id);
  if (!role || !ALLOWED.includes(role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const assessmentId = searchParams.get("assessment_id");
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const limit = 50;
  const from = (page - 1) * limit;

  const admin = createAdminClient();
  let query = admin
    .from("assessment_results")
    .select("*, assessments(name, version, scoring_model)", { count: "exact" })
    .order("submitted_at", { ascending: false })
    .range(from, from + limit - 1);

  if (assessmentId) query = query.eq("assessment_id", assessmentId);

  const { data, error, count } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ results: data, total: count, page });
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { role, email } = await getAuth(user.id);
  if (!role || !ALLOWED.includes(role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const { assessment_id, father_profile_id, score_total, score_breakdown_json, interpretation_text, submitted_at } = body;

  if (!assessment_id) {
    return NextResponse.json({ error: "assessment_id is required" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("assessment_results")
    .insert({
      assessment_id,
      father_profile_id: father_profile_id ?? null,
      score_total: score_total ?? null,
      score_breakdown_json: score_breakdown_json ?? {},
      interpretation_text: interpretation_text ?? null,
      submitted_at: submitted_at ?? new Date().toISOString(),
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await insertAuditLog({
    userId: user.id,
    actorEmail: email ?? undefined,
    action: "assessment.create",
    entityType: "assessment_result",
    entityId: data.id,
    details: { assessment_id, score_total },
  });

  return NextResponse.json({ result: data });
}
