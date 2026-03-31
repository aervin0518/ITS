"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Mail, Search, LogIn, LayoutDashboard, LogOut } from "lucide-react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { ROLE_DASHBOARDS } from "@/types/auth";

const navLinks = [
  { href: "/about", label: "About" },
  { href: "/platform-model", label: "Platform Model" },
  { href: "/research", label: "Research Hub" },
  { href: "/metadad", label: "MetaDAD" },
  { href: "/partners", label: "Partners" },
  { href: "/donate", label: "Invest In A Father" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [dashboardPath, setDashboardPath] = useState("/cms/dashboard");

  useEffect(() => {
    // Skip all Supabase browser-client initialization on /auth/* pages.
    // Auth pages exchange invite/reset tokens via a server-side API route.
    // If the browser Supabase client acquires the Web Locks API
    // "sb-...-auth-token" lock at the same time, one of them prints:
    //   "Lock '...' was released because another request stole it"
    // Keeping the browser client completely idle on auth pages eliminates
    // the race condition.
    if (pathname.startsWith("/auth/")) return;

    // Only run if Supabase is properly configured with a valid URL
    if (!isSupabaseConfigured()) return;

    const supabase = createClient();

    const fetchUser = async () => {
      try {
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        setUser(currentUser);

        if (currentUser) {
          const { data: profile } = await supabase
            .from("user_profiles")
            .select("id, user_roles(roles(name))")
            .eq("id", currentUser.id)
            .maybeSingle();
          const roleName = (profile as any)?.user_roles?.[0]?.roles?.name ?? null;
          if (roleName) {
            setDashboardPath(ROLE_DASHBOARDS[roleName] ?? "/cms/dashboard");
          }
        }
      } catch {
        // Supabase not yet configured — silently skip auth state
      }
    };

    fetchUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          const { data: profile } = await supabase
            .from("user_profiles")
            .select("id, user_roles(roles(name))")
            .eq("id", session.user.id)
            .maybeSingle();
          const roleName = (profile as any)?.user_roles?.[0]?.roles?.name ?? null;
          if (roleName) {
            setDashboardPath(ROLE_DASHBOARDS[roleName] ?? "/cms/dashboard");
          }
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [pathname]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    window.location.href = "/";
  };

  return (
    <header className="bg-white border-b border-stone-200 sticky top-0 z-50">
      {/* Top Utility Bar */}
      <div className="bg-stone-100 border-b border-stone-200">
        <div className="container-wide flex items-center justify-end gap-6 py-1.5">
          <Link
            href="/contact"
            className="flex items-center gap-1.5 text-xs font-sans text-stone-500 hover:text-navy-500 transition-colors"
          >
            <Mail size={12} />
            Contact
          </Link>
          <Link
            href="#"
            className="flex items-center gap-1.5 text-xs font-sans text-stone-500 hover:text-navy-500 transition-colors"
          >
            <Search size={12} />
            Search
          </Link>
          <Link
            href="/get-involved#newsletter"
            className="text-xs font-sans text-stone-500 hover:text-navy-500 transition-colors"
          >
            Newsletter
          </Link>

          {/* Auth — Login / Dashboard + Logout. Shown immediately; updates silently once session check resolves. */}
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                href={dashboardPath}
                className="flex items-center gap-1.5 text-xs font-sans font-semibold text-[#152A4A] hover:text-[#C8963E] transition-colors"
              >
                <LayoutDashboard size={12} />
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-xs font-sans text-stone-500 hover:text-red-600 transition-colors"
              >
                <LogOut size={12} />
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 text-xs font-sans font-semibold text-[#152A4A] hover:text-[#C8963E] transition-colors"
            >
              <LogIn size={12} />
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Main Nav */}
      <nav className="container-wide" aria-label="Main navigation">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5 group" aria-label="I.T.S. Fatherhood home">
            <Image
              src="/logo-light.png"
              alt="I.T.S. Fatherhood"
              width={52}
              height={40}
              className="flex-shrink-0"
              priority
            />
            <div className="flex flex-col leading-none">
              <span className="text-base font-serif font-bold text-stone-900 group-hover:text-navy-600 transition-colors tracking-wide">
                I.T.S. Fatherhood
              </span>
              <span className="text-[8px] font-sans font-semibold tracking-[0.3em] uppercase text-stone-400 mt-0.5">
                Impact & Intelligence Platform
              </span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm font-sans text-stone-600 hover:text-navy-500 hover:bg-stone-50 transition-colors rounded"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="https://form.jotform.com/253554464301049"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary ml-3"
            >
              Take the Survey
            </Link>
          </div>

          <button
            className="lg:hidden p-2 text-stone-600 hover:text-navy-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-400 focus-visible:ring-offset-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-stone-200" id="mobile-menu">
          <div className="container-wide py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-3 text-sm font-sans text-stone-700 hover:text-navy-500 hover:bg-stone-50 transition-colors rounded"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="https://form.jotform.com/253554464301049"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mt-3 self-start"
              onClick={() => setMobileOpen(false)}
            >
              Take the Survey
            </Link>

            {/* Mobile auth */}
            <div className="border-t border-stone-100 mt-3 pt-3">
              {user ? (
                <div className="flex flex-col gap-2">
                  <Link
                    href={dashboardPath}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-[#152A4A] hover:bg-stone-50 rounded"
                    onClick={() => setMobileOpen(false)}
                  >
                    <LayoutDashboard size={14} />
                    Dashboard
                  </Link>
                  <button
                    onClick={() => { handleLogout(); setMobileOpen(false); }}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-stone-500 hover:text-red-600 hover:bg-stone-50 rounded text-left"
                  >
                    <LogOut size={14} />
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-[#152A4A] hover:bg-stone-50 rounded"
                  onClick={() => setMobileOpen(false)}
                >
                  <LogIn size={14} />
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
