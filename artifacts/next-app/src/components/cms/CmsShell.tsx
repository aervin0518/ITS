"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, Bell, LogOut, ChevronDown } from "lucide-react";
import CmsSidebar from "./CmsSidebar";

interface Profile {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: string;
}

interface Props {
  profile: Profile;
  children: React.ReactNode;
}

export default function CmsShell({ profile, children }: Props) {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const fullName = [profile.first_name, profile.last_name].filter(Boolean).join(" ") || profile.email;

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="flex h-screen bg-[#FAF8F5] overflow-hidden">
      {/* Sidebar */}
      <CmsSidebar role={profile.role} collapsed={collapsed} />

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shrink-0">
          <button
            onClick={() => setCollapsed((v) => !v)}
            className="p-2 rounded-lg text-gray-400 hover:text-[#111114] hover:bg-gray-100 transition"
            aria-label="Toggle sidebar"
          >
            <Menu size={20} />
          </button>

          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg text-gray-400 hover:text-[#111114] hover:bg-gray-100 transition">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#C8963E] rounded-full" />
            </button>

            <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
              <div className="w-8 h-8 rounded-full bg-[#152A4A] flex items-center justify-center text-white text-xs font-bold">
                {(profile.first_name?.[0] ?? profile.email[0]).toUpperCase()}
              </div>
              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold text-[#111114] leading-tight">{fullName}</p>
                <p className="text-xs text-gray-400">{profile.role}</p>
              </div>
              <ChevronDown size={14} className="text-gray-400" />
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-600 px-3 py-2 rounded-lg hover:bg-red-50 transition ml-1"
              title="Sign out"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
