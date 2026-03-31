"use server";

import { createClient } from "@/lib/supabase/server";

const FRIENDLY_ERRORS: Record<string, string> = {
  "Auth session missing!": "session_missing",
  "JWT expired": "session_missing",
  "invalid JWT": "session_missing",
  "New password should be different from the old password.":
    "Password must be different from your previous password. Please choose a new one.",
  "Password should be at least 6 characters.":
    "Password must be at least 8 characters.",
};

export async function updatePasswordAction(password: string) {
  const supabase = await createClient();

  // Verify session is still valid before attempting update
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "session_missing" };
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    const friendly = FRIENDLY_ERRORS[error.message];
    if (friendly) return { error: friendly };
    // Return a safe, generic message for any unrecognised error
    return { error: "Unable to set your password. Please try again or contact support." };
  }

  // Sign out the invite session server-side so the browser cookies are cleared
  // before the client navigates to /login — prevents middleware from bouncing
  // the user back to the dashboard.
  await supabase.auth.signOut();

  return { error: null };
}
