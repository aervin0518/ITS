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
  const interviewId = searchParams.get("interview_id");
  const fatherProfileId = searchParams.get("father_profile_id");
  const reviewed = searchParams.get("reviewed"); // "true" | "false" | null
  const q = searchParams.get("q");
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const limit = 50;
  const from = (page - 1) * limit;

  const admin = createAdminClient();
  let query = admin
    .from("transcripts")
    .select(
      "id, interview_id, father_profile_id, source_type, file_url, language, processed_flag, raw_text, created_at",
      { count: "exact" }
    )
    .order("created_at", { ascending: false })
    .range(from, from + limit - 1);

  if (interviewId) query = query.eq("interview_id", interviewId);
  if (fatherProfileId) query = query.eq("father_profile_id", fatherProfileId);
  if (reviewed === "true") query = query.eq("processed_flag", true);
  if (reviewed === "false") query = query.eq("processed_flag", false);
  if (q) query = query.ilike("source_type", `%${q}%`);

  const { data, error, count } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Generate signed URLs for transcripts with a storage path
  const transcripts = await Promise.all(
    (data ?? []).map(async (t: any) => {
      let signedUrl: string | null = null;
      if (t.file_url) {
        const { data: signed } = await admin.storage
          .from("transcripts")
          .createSignedUrl(t.file_url, 3600); // 1-hour expiry
        signedUrl = signed?.signedUrl ?? null;
      }
      return { ...t, signed_url: signedUrl };
    })
  );

  return NextResponse.json({ transcripts, total: count, page });
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { role, email } = await getAuth(user.id);
  if (!role || !ALLOWED.includes(role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const { interview_id, father_profile_id, source_type, file_url, raw_text, cleaned_text, language } = body;

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("transcripts")
    .insert({
      interview_id: interview_id || null,
      father_profile_id: father_profile_id || null,
      source_type: source_type || null,
      file_url: file_url || null,
      raw_text: raw_text || null,
      cleaned_text: cleaned_text || null,
      language: language || "en",
      processed_flag: false,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await insertAuditLog({
    user_id: user.id,
    action: "transcript.create",
    entity_type: "transcript",
    entity_id: data.id,
    details_json: { actor_email: email, source_type },
  });

  return NextResponse.json({ transcript: data }, { status: 201 });
}
