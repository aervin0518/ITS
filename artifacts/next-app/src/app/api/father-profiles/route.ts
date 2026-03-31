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
  const search = searchParams.get("search");
  const consentStatus = searchParams.get("consent_status");
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const limit = 50;
  const from = (page - 1) * limit;

  const admin = createAdminClient();
  let query = admin
    .from("father_profiles")
    .select(
      "id, external_profile_code, first_name, last_name, display_name, city, state, consent_status, justice_involved_flag, young_father_flag, created_at",
      { count: "exact" }
    )
    .order("created_at", { ascending: false })
    .range(from, from + limit - 1);

  if (consentStatus) query = query.eq("consent_status", consentStatus);
  if (search) {
    query = query.or(
      `first_name.ilike.%${search}%,last_name.ilike.%${search}%,display_name.ilike.%${search}%,external_profile_code.ilike.%${search}%`
    );
  }

  const { data, error, count } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ profiles: data, total: count, page });
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { role, email } = await getAuth(user.id);
  if (!role || !["Admin", "Program Admin"].includes(role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const {
    external_profile_code, first_name, last_name, display_name,
    date_of_birth, city, state, zip_code, county, metro_area,
    demographic_group, justice_involved_flag, young_father_flag, consent_status,
  } = body;

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("father_profiles")
    .insert({
      external_profile_code: external_profile_code?.trim() || null,
      first_name: first_name?.trim() || null,
      last_name: last_name?.trim() || null,
      display_name: display_name?.trim() || null,
      date_of_birth: date_of_birth || null,
      city: city?.trim() || null,
      state: state?.trim() || null,
      zip_code: zip_code?.trim() || null,
      county: county?.trim() || null,
      metro_area: metro_area?.trim() || null,
      demographic_group: demographic_group?.trim() || null,
      justice_involved_flag: justice_involved_flag ?? false,
      young_father_flag: young_father_flag ?? false,
      consent_status: consent_status ?? "pending",
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await insertAuditLog({
    userId: user.id,
    actorEmail: email ?? undefined,
    action: "father_profile.create",
    entityType: "father_profile",
    entityId: data.id,
    details: { display_name: data.display_name ?? `${first_name} ${last_name}` },
  });

  return NextResponse.json({ profile: data });
}
