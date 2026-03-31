"use client";

import { useActionState, useState } from "react";
import { loginAction, forgotPasswordAction } from "@/app/(public)/login/actions";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";

export default function LoginForm({ urlError }: { urlError?: string | null }) {
  const [state, formAction, pending] = useActionState(loginAction, null);
  const [forgotState, forgotFormAction, forgotPending] = useActionState(forgotPasswordAction, null);

  const [showPassword, setShowPassword] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5]">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
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
              Platform Sign In
            </h1>
            <p className="text-blue-200 text-sm mt-1">
              I.T.S. Fatherhood Intelligence Platform
            </p>
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            {urlError && (
              <div className="mb-5 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
                <p className="text-amber-800 text-sm">{urlError}</p>
              </div>
            )}
            {!showForgot ? (
              <>
                <form action={formAction} className="space-y-5">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-[#111114] mb-1.5"
                    >
                      Email Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="you@example.com"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-[#111114] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#152A4A] focus:border-transparent transition"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-[#111114] mb-1.5"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        autoComplete="current-password"
                        placeholder="••••••••"
                        className="w-full px-4 py-2.5 pr-11 border border-gray-200 rounded-lg text-[#111114] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#152A4A] focus:border-transparent transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-[#152A4A] transition-colors"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <div className="flex justify-end mt-1.5">
                      <button
                        type="button"
                        onClick={() => setShowForgot(true)}
                        className="text-xs text-[#152A4A] hover:underline font-medium"
                      >
                        Forgot password?
                      </button>
                    </div>
                  </div>

                  {state?.error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                      <p className="text-red-700 text-sm">{state.error}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={pending}
                    className="w-full bg-[#C8963E] hover:bg-[#b3832c] text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {pending ? "Signing in…" : "Sign In"}
                  </button>
                </form>

                <p className="text-center text-sm text-gray-400 mt-6">
                  Access is by invitation only.{" "}
                  <a
                    href="/contact"
                    className="text-[#152A4A] hover:underline font-medium"
                  >
                    Contact us
                  </a>{" "}
                  to request access.
                </p>
              </>
            ) : (
              /* Forgot Password Panel */
              <>
                <button
                  type="button"
                  onClick={() => setShowForgot(false)}
                  className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#152A4A] mb-5 transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                  Back to sign in
                </button>

                <h2 className="text-lg font-bold text-[#111114] mb-1">Reset your password</h2>
                <p className="text-sm text-gray-500 mb-5">
                  Enter your registered email address and we'll send you a reset link.
                </p>

                {forgotState?.success ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-4">
                    <p className="text-green-800 text-sm font-medium">Check your inbox</p>
                    <p className="text-green-700 text-sm mt-0.5">
                      If that email is registered, a reset link is on its way. Check your spam folder if you don't see it.
                    </p>
                  </div>
                ) : (
                  <form action={forgotFormAction} className="space-y-4">
                    <div>
                      <label
                        htmlFor="forgot-email"
                        className="block text-sm font-medium text-[#111114] mb-1.5"
                      >
                        Email Address
                      </label>
                      <input
                        id="forgot-email"
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        placeholder="you@example.com"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-[#111114] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#152A4A] focus:border-transparent transition"
                      />
                    </div>

                    {forgotState?.error && (
                      <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                        <p className="text-red-700 text-sm">{forgotState.error}</p>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={forgotPending}
                      className="w-full bg-[#152A4A] hover:bg-[#1E3A5F] text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {forgotPending ? "Sending…" : "Send Reset Link"}
                    </button>
                  </form>
                )}
              </>
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
