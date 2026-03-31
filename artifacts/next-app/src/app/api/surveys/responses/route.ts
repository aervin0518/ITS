import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const ALLOWED = ["Admin", "Program Admin", "Researcher"];

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("user_profiles")
    .select("user_roles(roles(name))")
    .eq("id", user.id)
    .single();

  const role = (profile as any)?.user_roles?.[0]?.roles?.name;
  if (!role || !ALLOWED.includes(role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const surveyId = searchParams.get("survey_id");
  const completionStatus = searchParams.get("completion_status");
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const limit = 50;
  const from = (page - 1) * limit;

  let query = admin
    .from("survey_responses")
    .select("id, survey_id, father_profile_id, submission_source, submitted_at, completion_status, surveys(name, source_system)", { count: "exact" })
    .order("submitted_at", { ascending: false })
    .range(from, from + limit - 1);

  if (surveyId) query = query.eq("survey_id", surveyId);
  if (completionStatus) query = query.eq("completion_status", completionStatus);

  const { data, error, count } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ responses: data, total: count, page });
}
