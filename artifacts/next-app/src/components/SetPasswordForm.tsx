"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { updatePasswordAction } from "@/app/auth/set-password/actions";

export default function SetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const result = await updatePasswordAction(password);
    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    setSuccess(true);
    // Use a hard navigation so the browser picks up the cleared session cookies
    // that were set by the server action's signOut() call. router.push() reuses
    // the existing request context and can still appear authenticated to the
    // middleware, causing it to redirect back to the dashboard.
    setTimeout(() => { window.location.href = "/login"; }, 2500);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5]">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-[#152A4A] px-8 py-10 text-center">
            <div className="flex justify-center mb-4">
              <Image
                src="/logo-light.png"
                alt="I.T.S. Fatherhood"
                width={65}
                height={50}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
            <h1 className="text-white text-2xl font-bold tracking-tight mt-2">
              Welcome — Set Your Password
            </h1>
            <p className="text-blue-200 text-sm mt-1">
              Choose a strong password to activate your account
            </p>
          </div>

          <div className="px-8 py-8">
            {success ? (
              <div className="text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                  <svg
                    className="w-7 h-7 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-[#111114] font-semibold">
                  Account activated!
                </p>
                <p className="text-gray-500 text-sm">
                  Your password has been set. Redirecting to sign in…
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="new-password"
                    className="block text-sm font-medium text-[#111114] mb-1.5"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="new-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="new-password"
                      placeholder="Min. 8 characters"
                      className="w-full px-4 py-2.5 pr-11 border border-gray-200 rounded-lg text-[#111114] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#152A4A] focus:border-transparent transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-[#152A4A] transition-colors"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="confirm-password"
                    className="block text-sm font-medium text-[#111114] mb-1.5"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirm-password"
                      type={showConfirm ? "text" : "password"}
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      required
                      autoComplete="new-password"
                      placeholder="Re-enter your password"
                      className="w-full px-4 py-2.5 pr-11 border border-gray-200 rounded-lg text-[#111114] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#152A4A] focus:border-transparent transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-[#152A4A] transition-colors"
                      aria-label={
                        showConfirm ? "Hide password" : "Show password"
                      }
                    >
                      {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                    {error === "session_missing" ? (
                      <p className="text-red-700 text-sm">
                        Your session has expired. Please click the invite link
                        in your email again, or{" "}
                        <a href="/contact" className="underline font-medium">
                          contact us
                        </a>{" "}
                        to request a new one.
                      </p>
                    ) : (
                      <p className="text-red-700 text-sm">{error}</p>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#C8963E] hover:bg-[#b3832c] text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? "Activating…" : "Set Password & Continue"}
                </button>
              </form>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          © {new Date().getFullYear()} I.T.S. Fatherhood. All rights reserved.
        </p>
      </div>
    </div>
  );
}
