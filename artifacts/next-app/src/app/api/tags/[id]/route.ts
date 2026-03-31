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

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { role, email } = await getAuth(user.id);
  if (!role || !["Admin", "Program Admin"].includes(role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const updates: Record<string, unknown> = {};
  if ("name" in body) updates.name = body.name?.trim() || null;
  if ("tag_group" in body) updates.tag_group = body.tag_group?.trim() || null;

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("tags")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await insertAuditLog({
    user_id: user.id,
    action: "tag.update",
    entity_type: "tag",
    entity_id: id,
    details_json: { actor_email: email, changes: updates },
  });

  return NextResponse.json({ tag: data });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { role, email } = await getAuth(user.id);
  if (!role || !["Admin", "Program Admin"].includes(role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const admin = createAdminClient();
  const { error } = await admin.from("tags").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await insertAuditLog({
    user_id: user.id,
    action: "tag.delete",
    entity_type: "tag",
    entity_id: id,
    details_json: { actor_email: email },
  });

  return NextResponse.json({ success: true });
}
