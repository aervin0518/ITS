import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const CreateUserSchema = z.object({
  email: z.string().email(),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  role_id: z.string().uuid("Invalid role"),
});

async function getCallerRole(userId: string): Promise<string | null> {
  const admin = createAdminClient();
  const { data } = await admin
    .from("user_profiles")
    .select("id, user_roles(role_id, roles(name))")
    .eq("id", userId)
    .single();
  return (data as any)?.user_roles?.[0]?.roles?.name ?? null;
}

export async function POST(request: NextRequest) {
  // Verify caller is authenticated admin
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const callerRole = await getCallerRole(user.id);
  if (callerRole !== "Admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Validate request body
  const body = await request.json();
  const result = CreateUserSchema.safeParse(body);

  if (!result.success) {
    const firstError = result.error.errors[0]?.message ?? "Invalid input";
    return NextResponse.json({ error: firstError }, { status: 400 });
  }

  const { email, first_name, last_name, role_id } = result.data;

  const adminClient = createAdminClient();

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

  // STEP A + B: Invite user — Supabase sends password-set email automatically
  // user_metadata is passed so the trigger can populate user_profiles
  const { data: inviteData, error: inviteError } = await adminClient.auth.admin.inviteUserByEmail(
    email,
    {
      data: { first_name, last_name },
      redirectTo: `${origin}/auth/set-password-callback`,
    }
  );

  if (inviteError) {
    return NextResponse.json({ error: inviteError.message }, { status: 400 });
  }

  const newUserId = inviteData.user.id;

  // STEP C: Upsert user_profiles in case trigger hasn't fired yet
  await adminClient.from("user_profiles").upsert({
    id: newUserId,
    email,
    first_name,
    last_name,
    status: "active",
  }, { onConflict: "id" });

  // STEP D: Assign role in user_roles table
  await adminClient.from("user_roles").delete().eq("user_id", newUserId);
  const { error: roleError } = await adminClient.from("user_roles").insert({
    user_id: newUserId,
    role_id,
  });

  if (roleError) {
    return NextResponse.json({
      error: "User invited but role assignment failed: " + roleError.message,
    }, { status: 500 });
  }

  return NextResponse.json({ success: true, userId: newUserId });
}
