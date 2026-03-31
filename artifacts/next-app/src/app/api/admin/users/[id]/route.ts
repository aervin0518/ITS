import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { insertAuditLog } from "@/lib/audit";

const UpdateSchema = z.object({
  role: z.string().optional(),
  status: z.enum(["active", "inactive"]).optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
});

async function getCallerInfo(userId: string) {
  const admin = createAdminClient();
  const { data } = await admin
    .from("user_profiles")
    .select("email, user_roles(role_id, roles(name))")
    .eq("id", userId)
    .single();
  return {
    role: (data as any)?.user_roles?.[0]?.roles?.name ?? null,
    email: (data as any)?.email ?? null,
  };
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { role: callerRole, email: callerEmail } = await getCallerInfo(user.id);
  if (callerRole !== "Admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json();
  const result = UpdateSchema.safeParse(body);
  if (!result.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const adminClient = createAdminClient();

  const profileUpdates: Record<string, unknown> = {};
  if (result.data.status !== undefined) profileUpdates.status = result.data.status;
  if (result.data.first_name !== undefined) profileUpdates.first_name = result.data.first_name;
  if (result.data.last_name !== undefined) profileUpdates.last_name = result.data.last_name;

  if (Object.keys(profileUpdates).length > 0) {
    const { error } = await adminClient.from("user_profiles").update(profileUpdates).eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    if (result.data.status !== undefined) {
      await insertAuditLog({
        userId: user.id,
        actorEmail: callerEmail ?? undefined,
        action: "user.status_change",
        entityType: "user",
        entityId: id,
        details: { new_status: result.data.status },
      });
    } else {
      await insertAuditLog({
        userId: user.id,
        actorEmail: callerEmail ?? undefined,
        action: "user.update",
        entityType: "user",
        entityId: id,
        details: profileUpdates,
      });
    }
  }

  if (result.data.role !== undefined) {
    const { data: roleData, error: roleError } = await adminClient
      .from("roles")
      .select("id")
      .eq("name", result.data.role)
      .single();

    if (roleError || !roleData) {
      return NextResponse.json({ error: `Role "${result.data.role}" not found` }, { status: 400 });
    }

    await adminClient.from("user_roles").delete().eq("user_id", id);
    const { error: insertError } = await adminClient.from("user_roles").insert({
      user_id: id,
      role_id: roleData.id,
    });
    if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 });

    await insertAuditLog({
      userId: user.id,
      actorEmail: callerEmail ?? undefined,
      action: "user.role_change",
      entityType: "user",
      entityId: id,
      details: { new_role: result.data.role },
    });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (user.id === id) {
    return NextResponse.json({ error: "Cannot delete your own account" }, { status: 400 });
  }

  const { role: callerRole, email: callerEmail } = await getCallerInfo(user.id);
  if (callerRole !== "Admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const adminClient = createAdminClient();

  // Grab target email before deletion for audit
  const { data: target } = await adminClient
    .from("user_profiles")
    .select("email")
    .eq("id", id)
    .single();

  const { error } = await adminClient.auth.admin.deleteUser(id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await insertAuditLog({
    userId: user.id,
    actorEmail: callerEmail ?? undefined,
    action: "user.delete",
    entityType: "user",
    entityId: id,
    details: { deleted_email: (target as any)?.email },
  });

  return NextResponse.json({ success: true });
}
