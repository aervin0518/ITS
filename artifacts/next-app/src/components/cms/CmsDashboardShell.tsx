"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { UserWithRole, UserRole } from "@/types/auth";
import {
  LayoutDashboard,
  Users,
  FileText,
  BookOpen,
  Handshake,
  LogOut,
  Settings,
  Star,
} from "lucide-react";

const ROLE_LABELS: Record<UserRole, string> = {
  "Admin": "Administrator",
  "Program Admin": "Program Admin",
  "Researcher": "Researcher",
  "Partner": "Partner",
  "Subscriber": "Subscriber",
};

const ROLE_ICONS: Record<UserRole, React.ReactNode> = {
  "Admin": <LayoutDashboard className="w-5 h-5" />,
  "Program Admin": <FileText className="w-5 h-5" />,
  "Researcher": <BookOpen className="w-5 h-5" />,
  "Partner": <Handshake className="w-5 h-5" />,
  "Subscriber": <Star className="w-5 h-5" />,
};

const COMING_SOON_FEATURES: Record<UserRole, string[]> = {
  "Admin": [
    "User management & role assignment",
    "Invite new platform users",
    "Site content management",
    "Analytics & reporting",
    "System settings",
  ],
  "Program Admin": [
    "Program metrics dashboard",
    "Participant tracking",
    "Report generation",
    "Resource management",
  ],
  "Researcher": [
    "Research data access",
    "Publication management",
    "Dataset explorer",
    "Collaboration tools",
  ],
  "Partner": [
    "Partnership overview",
    "Shared resources",
    "Impact reports",
    "Communication hub",
  ],
  "Subscriber": [
    "Research updates",
    "Exclusive publications",
    "Newsletter archive",
    "Event access",
  ],
};

interface Props {
  profile: UserWithRole | null;
  title: string;
  role: UserRole;
}

export default function CmsDashboardShell({ profile, title, role }: Props) {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Top Bar */}
      <header className="bg-[#152A4A] text-white px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-[#C8963E] p-2 rounded-lg">
            {ROLE_ICONS[role]}
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">{title}</h1>
            <p className="text-blue-200 text-xs">I.T.S. Fatherhood Platform</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium">
              {[profile?.first_name, profile?.last_name].filter(Boolean).join(" ") || profile?.email || "User"}
            </p>
            <p className="text-blue-300 text-xs">{ROLE_LABELS[role]}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg text-sm transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Welcome Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-[#152A4A] text-white p-4 rounded-xl">
              {ROLE_ICONS[role]}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#111114]">
                Welcome back{profile?.first_name ? `, ${profile.first_name}` : ""}
              </h2>
              <p className="text-gray-500">
                You are signed in as{" "}
                <span className="font-semibold text-[#152A4A]">
                  {ROLE_LABELS[role]}
                </span>
              </p>
            </div>
          </div>

          <div className="bg-[#FAF8F5] rounded-xl p-4 border border-amber-100">
            <div className="flex items-center gap-2 mb-1">
              <Settings className="w-4 h-4 text-[#C8963E]" />
              <span className="text-sm font-semibold text-[#111114]">
                CMS Dashboard — Coming Soon
              </span>
            </div>
            <p className="text-sm text-gray-600">
              The full CMS interface is being built. Authentication and role
              management are active. Content modules will be added next.
            </p>
          </div>
        </div>

        {/* Features Preview */}
        <div>
          <h3 className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-4">
            Modules being built for your role
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {COMING_SOON_FEATURES[role].map((feature) => (
              <div
                key={feature}
                className="bg-white rounded-xl border border-gray-100 px-5 py-4 flex items-center gap-3 shadow-sm"
              >
                <div className="w-2 h-2 rounded-full bg-[#C8963E] shrink-0" />
                <span className="text-sm text-[#111114]">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Admin: User Management Placeholder */}
        {role === "Admin" && (
          <div className="mt-8 bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-5 h-5 text-[#152A4A]" />
              <h3 className="font-bold text-[#111114]">User Management</h3>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              As an Admin, you can invite users and assign roles. Full user
              management interface is being built.
            </p>
            <div className="bg-[#152A4A]/5 rounded-xl p-4">
              <p className="text-xs font-mono text-gray-400">
                📋 To invite a user now: Go to your Supabase project → Authentication
                → Users → Invite User. Assign their role in the{" "}
                <code className="bg-gray-200 px-1 rounded">profiles</code> table
                after they accept the invitation.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
