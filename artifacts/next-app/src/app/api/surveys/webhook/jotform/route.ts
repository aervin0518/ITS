import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { insertAuditLog } from "@/lib/audit";

const JOTFORM_FORM_ID = "253554464301049";

export async function POST(req: NextRequest) {
  const secret = process.env.JOTFORM_WEBHOOK_SECRET;
  if (secret) {
    const incoming = req.headers.get("x-jotform-secret");
    if (incoming !== secret) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  let rawPayload: Record<string, unknown> = {};
  const contentType = req.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    rawPayload = await req.json();
  } else {
    const text = await req.text();
    const params = new URLSearchParams(text);
    for (const [k, v] of params.entries()) {
      try { rawPayload[k] = JSON.parse(v); } catch { rawPayload[k] = v; }
    }
  }

  const submissionId = (rawPayload.submissionID ?? rawPayload.submission_id ?? "") as string;

  const admin = createAdminClient();

  // Look up or create the surveys record for JotForm
  let surveyId: string | null = null;
  const { data: existing } = await admin
    .from("surveys")
    .select("id")
    .eq("source_system", "JotForm")
    .eq("name", `JotForm ${JOTFORM_FORM_ID}`)
    .single();

  if (existing) {
    surveyId = existing.id;
  } else {
    const { data: created } = await admin
      .from("surveys")
      .insert({ name: `JotForm ${JOTFORM_FORM_ID}`, source_system: "JotForm", active_flag: true })
      .select("id")
      .single();
    surveyId = created?.id ?? null;
  }

  const { data, error } = await admin
    .from("survey_responses")
    .upsert(
      {
        survey_id: surveyId,
        submission_source: "JotForm",
        submitted_at: new Date().toISOString(),
        raw_payload_json: rawPayload,
        normalized_payload_json: {},
        completion_status: "complete",
      },
      { onConflict: "submission_id", ignoreDuplicates: false }
    )
    .select()
    .single();

  if (error) {
    console.error("Survey webhook error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await insertAuditLog({
    action: "survey.received",
    entityType: "survey_response",
    entityId: data?.id,
    details: { survey_id: surveyId, submission_id: submissionId },
  });

  return NextResponse.json({ success: true, id: data?.id });
}
