import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const InviteSchema = z.object({
  email: z.string().email(),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  role: z.string().min(1),
});

async function getCallerRole(userId: string): Promise<string | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("user_profiles")
    .select("id, user_roles(role_id, roles(name))")
    .eq("id", userId)
    .single();
  return (data as any)?.user_roles?.[0]?.roles?.name ?? null;
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const callerRole = await getCallerRole(user.id);
  if (callerRole !== "Admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const result = InviteSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: "Invalid input", details: result.error.flatten() },
      { status: 400 }
    );
  }

  const { email, first_name, last_name, role } = result.data;

  const adminClient = createAdminClient();

  // Look up the role_id from the roles table
  const { data: roleData, error: roleError } = await adminClient
    .from("roles")
    .select("id")
    .eq("name", role)
    .single();

  if (roleError || !roleData) {
    return NextResponse.json({ error: `Role "${role}" not found` }, { status: 400 });
  }

  // Resolve the correct public origin from request headers (Replit proxy sets x-forwarded-host)
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto") ?? "https";
  const host = request.headers.get("host") ?? "";
  const origin =
    forwardedHost && !forwardedHost.includes("localhost")
      ? `${forwardedProto}://${forwardedHost}`
      : host && !host.includes("localhost")
        ? `https://${host}`
        : process.env.NEXT_PUBLIC_SITE_URL ?? `https://${host}`;

  // Invite user — Supabase sends invitation email
  const { data: inviteData, error: inviteError } = await adminClient.auth.admin.inviteUserByEmail(email, {
    data: { first_name, last_name },
    redirectTo: `${origin}/auth/set-password-callback`,
  });

  if (inviteError) {
    return NextResponse.json({ error: inviteError.message }, { status: 400 });
  }

  const newUserId = inviteData.user.id;

  // Insert into user_profiles
  await adminClient.from("user_profiles").upsert({
    id: newUserId,
    email: inviteData.user.email ?? email,
    first_name,
    last_name,
    status: "active",
  });

  // Delete any existing role and insert new one
  await adminClient.from("user_roles").delete().eq("user_id", newUserId);
  await adminClient.from("user_roles").insert({
    user_id: newUserId,
    role_id: roleData.id,
  });

  return NextResponse.json({ success: true, userId: newUserId });
}
