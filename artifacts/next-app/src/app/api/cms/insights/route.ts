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

const ALLOWED = ["Admin", "Program Admin", "Researcher", "Partner", "Subscriber"];

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const role = await getRole(user.id);
  if (!role || !ALLOWED.includes(role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const admin = createAdminClient();

  const [
    { count: programCount },
    { count: fatherCount },
    { count: publicationCount },
    { count: interviewCount },
    { count: assessmentCount },
    { data: programTypes },
    { data: recentPublications },
  ] = await Promise.all([
    admin.from("programs").select("id", { count: "exact", head: true }).eq("status", "active"),
    admin.from("father_profiles").select("id", { count: "exact", head: true }).eq("consent_status", "consented"),
    admin.from("publications").select("id", { count: "exact", head: true }).eq("status", "published"),
    admin.from("interviews").select("id", { count: "exact", head: true }),
    admin.from("assessment_results").select("id", { count: "exact", head: true }),
    admin.from("programs").select("program_type").eq("status", "active"),
    admin.from("publications")
      .select("id, title, publication_type, abstract, published_at")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(3),
  ]);

  // Aggregate program types
  const typeCounts: Record<string, number> = {};
  for (const p of programTypes ?? []) {
    if (p.program_type) typeCounts[p.program_type] = (typeCounts[p.program_type] ?? 0) + 1;
  }

  return NextResponse.json({
    insights: {
      activePrograms: programCount ?? 0,
      consentedFathers: fatherCount ?? 0,
      publishedResearch: publicationCount ?? 0,
      interviewsConducted: interviewCount ?? 0,
      assessmentsCompleted: assessmentCount ?? 0,
      programTypeBreakdown: typeCounts,
      recentPublications: recentPublications ?? [],
    },
  });
}
