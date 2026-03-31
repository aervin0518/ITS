import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const ALLOWED = ["Admin", "Program Admin", "Researcher"];

export async function GET() {
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

  const { data, error } = await admin
    .from("assessments")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ assessments: data });
}

export async function POST(req: NextRequest) {
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
  if (role !== "Admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { name, version, scoring_model } = await req.json();
  if (!name?.trim()) return NextResponse.json({ error: "Name is required" }, { status: 400 });

  const { data, error } = await admin
    .from("assessments")
    .insert({ name: name.trim(), version, scoring_model })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ assessment: data });
}
