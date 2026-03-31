import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";
import { ROLE_DASHBOARDS } from "@/types/auth";

function getPublicOrigin(request: NextRequest): string {
  // In Replit's proxied env the internal request.url uses localhost.
  // x-forwarded-host carries the real public hostname the browser used.
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto") ?? "https";
  const host = request.headers.get("host") ?? "";

  if (forwardedHost && !forwardedHost.includes("localhost")) {
    return `${forwardedProto}://${forwardedHost}`;
  }
  if (host && !host.includes("localhost")) {
    return `https://${host}`;
  }
  // Fall back to the internal origin only as a last resort
  return new URL(request.url).origin;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const origin = getPublicOrigin(request);
  const code = searchParams.get("code");
  const next = searchParams.get("next");

  if (code) {
    const supabase = await createClient();

    // Exchange the auth code for a session
    const { data: sessionData, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && sessionData?.user) {
      // If next is explicitly set (e.g. reset-password), go there directly
      if (next) {
        return NextResponse.redirect(`${origin}${next}`);
      }

      const userId = sessionData.user.id;

      // Use admin client to bypass RLS for role lookup
      const admin = createAdminClient();
      const { data: profile } = await admin
        .from("user_profiles")
        .select("id, user_roles(roles(name))")
        .eq("id", userId)
        .single();

      const roleName = (profile as any)?.user_roles?.[0]?.roles?.name ?? null;
      const destination = roleName ? (ROLE_DASHBOARDS[roleName] ?? "/cms/dashboard") : "/cms/dashboard";

      return NextResponse.redirect(`${origin}${destination}`);
    }
  }

  // If something went wrong, send to login with an error message
  return NextResponse.redirect(`${origin}/login?error=callback_failed`);
}
