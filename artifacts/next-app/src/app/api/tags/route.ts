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

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { role } = await getAuth(user.id);
  if (!role) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");
  const tag_group = searchParams.get("tag_group");

  const admin = createAdminClient();
  let query = admin.from("tags").select("*").order("tag_group").order("name");
  if (q) query = query.ilike("name", `%${q}%`);
  if (tag_group) query = query.eq("tag_group", tag_group);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ tags: data });
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
  const { name, tag_group } = body;
  if (!name?.trim()) return NextResponse.json({ error: "name is required" }, { status: 400 });

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("tags")
    .insert({ name: name.trim(), tag_group: tag_group?.trim() || null })
    .select()
    .single();

  if (error) {
    if (error.message.includes("unique")) {
      return NextResponse.json({ error: "A tag with this name already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await insertAuditLog({
    user_id: user.id,
    action: "tag.create",
    entity_type: "tag",
    entity_id: data.id,
    details_json: { actor_email: email, name, tag_group },
  });

  return NextResponse.json({ tag: data }, { status: 201 });
}
