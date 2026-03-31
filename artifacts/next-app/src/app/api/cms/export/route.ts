import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

async function getRole(userId: string) {
  const admin = createAdminClient();
  const { data } = await admin
    .from("user_profiles")
    .select("user_roles(roles(name))")
    .eq("id", userId)
    .single();
  return (data as any)?.user_roles?.[0]?.roles?.name ?? null;
}

function toCSV(rows: Record<string, unknown>[]): string {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const escape = (v: unknown) => {
    const s = v == null ? "" : String(v).replace(/"/g, '""');
    return `"${s}"`;
  };
  const lines = [
    headers.map(escape).join(","),
    ...rows.map((r) => headers.map((h) => escape(r[h])).join(",")),
  ];
  return lines.join("\n");
}

const ALLOWED = ["Admin", "Program Admin", "Researcher"];

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const role = await getRole(user.id);
  if (!role || !ALLOWED.includes(role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") ?? "father-profiles";

  const admin = createAdminClient();
  let csv = "";
  let filename = "export.csv";

  if (type === "father-profiles") {
    const { data } = await admin
      .from("father_profiles")
      .select("id, external_profile_code, first_name, last_name, display_name, date_of_birth, city, state, zip_code, county, metro_area, demographic_group, justice_involved_flag, young_father_flag, consent_status, created_at")
      .order("created_at", { ascending: false });
    csv = toCSV(data ?? []);
    filename = `father-profiles-${new Date().toISOString().slice(0, 10)}.csv`;

  } else if (type === "interviews") {
    const { data } = await admin
      .from("interviews")
      .select("id, interview_date, status, notes, father_profile_id, program_id, interviewer_user_id, created_at")
      .order("interview_date", { ascending: false });
    csv = toCSV(data ?? []);
    filename = `interviews-${new Date().toISOString().slice(0, 10)}.csv`;

  } else if (type === "survey-responses") {
    const { data } = await admin
      .from("survey_responses")
      .select("id, survey_id, father_profile_id, submission_source, submitted_at, completion_status, created_at")
      .order("submitted_at", { ascending: false });
    csv = toCSV(data ?? []);
    filename = `survey-responses-${new Date().toISOString().slice(0, 10)}.csv`;

  } else if (type === "assessment-results") {
    const { data } = await admin
      .from("assessment_results")
      .select("id, assessment_id, father_profile_id, submitted_at, score_total, interpretation_text, created_at")
      .order("submitted_at", { ascending: false });
    csv = toCSV(data ?? []);
    filename = `assessment-results-${new Date().toISOString().slice(0, 10)}.csv`;

  } else if (type === "publications") {
    const { data } = await admin
      .from("publications")
      .select("id, title, publication_type, slug, status, published_at, created_at")
      .order("created_at", { ascending: false });
    csv = toCSV(data ?? []);
    filename = `publications-${new Date().toISOString().slice(0, 10)}.csv`;

  } else if (type === "transcripts") {
    const { data } = await admin
      .from("transcripts")
      .select("id, source_type, language, processed_flag, interview_id, father_profile_id, created_at")
      .order("created_at", { ascending: false });
    csv = toCSV(data ?? []);
    filename = `transcripts-${new Date().toISOString().slice(0, 10)}.csv`;

  } else {
    return NextResponse.json({ error: "Unknown export type" }, { status: 400 });
  }

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
