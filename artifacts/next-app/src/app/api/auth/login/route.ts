import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { ROLE_DASHBOARDS } from "@/types/auth";
import { NextRequest, NextResponse } from "next/server";
import { insertAuditLog } from "@/lib/audit";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  const cookieStore = await cookies();

  // Collect cookies the Supabase client wants to set
  const pendingCookies: Array<{ name: string; value: string; options: Record<string, unknown> }> = [];

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          // Collect — we'll apply them to the response below
          cookiesToSet.forEach((c) => pendingCookies.push(c));
        },
      },
    }
  );

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  const userId = data.user.id;

  // Fetch profile + role
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("status, user_roles(roles(name))")
    .eq("id", userId)
    .single();

  console.log("[login] profile:", JSON.stringify(profile));

  if ((profile as any)?.status === "inactive") {
    await supabase.auth.signOut();
    return NextResponse.json(
      { error: "Your account has been deactivated. Please contact an administrator." },
      { status: 403 }
    );
  }

  const roleName = (profile as any)?.user_roles?.[0]?.roles?.name ?? "Subscriber";
  console.log("[login] roleName:", roleName);
  const destination = ROLE_DASHBOARDS[roleName] ?? "/cms/dashboard";

  // Fire audit log (non-blocking)
  insertAuditLog({
    userId: data.user.id,
    actorEmail: email,
    action: "login",
    details: { role: roleName },
  });

  // Build the response and attach all Supabase auth cookies directly to it
  const response = NextResponse.json({ destination });
  pendingCookies.forEach(({ name, value, options }) => {
    response.cookies.set(name, value, options as Parameters<typeof response.cookies.set>[2]);
  });

  return response;
}
