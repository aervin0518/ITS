"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { ROLE_DASHBOARDS } from "@/types/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export async function loginAction(
  _prevState: { error: string } | null,
  formData: FormData
): Promise<{ error: string }> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  // Use SSR client to sign in — this sets the session cookie properly
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message };
  }

  const userId = data.user.id;

  // Use service role client to bypass RLS for profile/role lookup
  const admin = createAdminClient();

  const { data: profile } = await admin
    .from("user_profiles")
    .select("status, user_roles(roles(name))")
    .eq("id", userId)
    .maybeSingle();

  if ((profile as any)?.status === "inactive") {
    await supabase.auth.signOut();
    return { error: "Your account has been deactivated. Please contact an administrator." };
  }

  const roleName = (profile as any)?.user_roles?.[0]?.roles?.name ?? "Subscriber";
  const destination = ROLE_DASHBOARDS[roleName] ?? "/cms/dashboard";

  redirect(destination);
}

export async function forgotPasswordAction(
  _prevState: { error?: string; success?: boolean } | null,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const email = (formData.get("email") as string)?.trim().toLowerCase();

  if (!email) {
    return { error: "Please enter your email address." };
  }

  // Check if this email exists in user_profiles
  const admin = createAdminClient();
  const { data: profile, error: lookupError } = await admin
    .from("user_profiles")
    .select("id, status")
    .eq("email", email)
    .maybeSingle();

  if (lookupError) {
    return { error: "Something went wrong. Please try again." };
  }

  if (!profile) {
    return { error: "No account found with that email address." };
  }

  if (profile.status === "inactive") {
    return { error: "This account has been deactivated. Contact an administrator for help." };
  }

  // Determine the public-facing origin from the actual request headers.
  // In Replit's proxied environment the x-forwarded-host header always carries
  // the real public hostname (e.g. bcebf006-....picard.replit.dev), which is
  // more reliable than process.env vars that may not survive the Next.js build.
  const reqHeaders = await headers();
  const forwardedHost = reqHeaders.get("x-forwarded-host");
  const forwardedProto = reqHeaders.get("x-forwarded-proto") ?? "https";
  const host = reqHeaders.get("host") ?? "";

  let origin: string;
  if (forwardedHost && !forwardedHost.includes("localhost")) {
    origin = `${forwardedProto}://${forwardedHost}`;
  } else if (host && !host.includes("localhost")) {
    origin = `https://${host}`;
  } else {
    // Last-resort: env vars (may still be localhost in some environments)
    origin =
      (process.env.REPLIT_DEV_DOMAIN
        ? `https://${process.env.REPLIT_DEV_DOMAIN}`
        : null) ??
      process.env.NEXT_PUBLIC_SITE_URL ??
      `https://${host}`;
  }

  const redirectTo = `${origin}/auth/callback?next=/auth/reset-password`;

  const supabase = await createClient();
  const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });

  if (resetError) {
    const msg = resetError.message ?? "";
    const lower = msg.toLowerCase();

    // Supabase's built-in SMTP has a project-level email rate limit (typically
    // 2–30 emails/hour on the free plan).  This fires regardless of how many
    // different email addresses are used — it is a per-project cap, not a
    // per-user cap.  Surface a message that makes this distinction clear.
    const isProjectRateLimit =
      lower.includes("rate limit") ||
      lower.includes("email rate") ||
      resetError.status === 429;

    // Supabase also imposes a per-address 60-second cooldown and returns:
    // "For security purposes, you can only request this after X seconds."
    const isSecurityCooldown = lower.includes("for security purposes");

    if (isProjectRateLimit) {
      return {
        error:
          "Our email service has reached its hourly sending limit. This is a " +
          "platform-level limit, not specific to your account. Please wait " +
          "an hour and try again, or contact an administrator for immediate assistance.",
      };
    }

    if (isSecurityCooldown) {
      // Extract the wait time from the message if present (e.g. "after 54 seconds")
      const match = msg.match(/after (\d+ \w+)/i);
      const waitHint = match ? ` Please wait ${match[1]} before trying again.` : " Please wait a moment before trying again.";
      return { error: `For security purposes, reset emails are rate-limited per address.${waitHint}` };
    }

    // Generic fallback
    return { error: "Failed to send reset email. Please try again or contact support." };
  }

  return { success: true };
}
