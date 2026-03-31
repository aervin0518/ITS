"use client";

import { useEffect } from "react";

export default function SetPasswordCallbackPage() {
  useEffect(() => {
    async function handleCallback() {
      // Supabase invite links deliver tokens in the URL hash fragment:
      // #access_token=...&refresh_token=...&type=invite
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      const access_token = params.get("access_token");
      const refresh_token = params.get("refresh_token");

      if (access_token && refresh_token) {
        // Exchange tokens server-side to avoid the browser auth-lock race
        // condition that occurs when the client Supabase instance and the
        // middleware's server instance compete for the same lock simultaneously.
        const res = await fetch("/api/auth/set-invite-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ access_token, refresh_token }),
          credentials: "include",
        });

        if (res.ok) {
          // Hard navigation so the server receives the fresh session cookies
          // set by the API route above.
          window.location.href = "/auth/set-password";
          return;
        }
      }

      // No tokens found or exchange failed
      window.location.href = "/login?error=invite_failed";
    }

    handleCallback();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5]">
      <div className="text-center space-y-3">
        <svg
          className="w-8 h-8 animate-spin text-[#152A4A] mx-auto"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          />
        </svg>
        <p className="text-gray-500 text-sm">Activating your account…</p>
      </div>
    </div>
  );
}
