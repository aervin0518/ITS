"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Tag,
  Image,
  FlaskConical,
  ScrollText,
  BarChart3,
  Users,
  Handshake,
  Bell,
  Settings,
  ChevronRight,
  Mic,
  ClipboardList,
  Shield,
  BookOpen,
  UserCheck,
  Layers,
  TrendingUp,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  roles: string[];
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/cms/dashboard", icon: <LayoutDashboard size={18} />, roles: ["Admin", "Program Admin", "Researcher", "Partner", "Subscriber"] },

  // Content
  { label: "Content", href: "/cms/content", icon: <FileText size={18} />, roles: ["Admin", "Program Admin"] },
  { label: "Publications", href: "/cms/publications", icon: <BookOpen size={18} />, roles: ["Admin", "Program Admin"] },
  { label: "Tags", href: "/cms/tags", icon: <Tag size={18} />, roles: ["Admin", "Program Admin"] },
  { label: "Media Library", href: "/cms/media", icon: <Image size={18} />, roles: ["Admin", "Program Admin", "Researcher"] },

  // Research
  { label: "Father Profiles", href: "/cms/father-profiles", icon: <UserCheck size={18} />, roles: ["Admin", "Program Admin", "Researcher"] },
  { label: "Programs", href: "/cms/programs", icon: <Layers size={18} />, roles: ["Admin", "Program Admin"] },
  { label: "Interviews", href: "/cms/interviews", icon: <Mic size={18} />, roles: ["Admin", "Program Admin", "Researcher"] },
  { label: "Transcripts", href: "/cms/transcripts", icon: <ScrollText size={18} />, roles: ["Admin", "Program Admin", "Researcher"] },
  { label: "Surveys & Assessments", href: "/cms/surveys", icon: <ClipboardList size={18} />, roles: ["Admin", "Program Admin", "Researcher"] },
  { label: "Research Data", href: "/cms/research", icon: <FlaskConical size={18} />, roles: ["Admin", "Program Admin", "Researcher"] },

  // Analytics
  { label: "Reports & Analytics", href: "/cms/reports", icon: <BarChart3 size={18} />, roles: ["Admin", "Program Admin", "Researcher", "Partner"] },

  // Subscriber
  { label: "Published Content", href: "/cms/subscriber-content", icon: <BookOpen size={18} />, roles: ["Subscriber", "Partner"] },
  { label: "Research Insights", href: "/cms/subscriber-insights", icon: <TrendingUp size={18} />, roles: ["Subscriber", "Partner"] },

  // Admin
  { label: "Users", href: "/cms/users", icon: <Users size={18} />, roles: ["Admin"] },
  { label: "Audit Log", href: "/cms/audit-logs", icon: <Shield size={18} />, roles: ["Admin"] },
  { label: "Partners", href: "/cms/partners", icon: <Handshake size={18} />, roles: ["Admin", "Partner"] },
  { label: "Notifications", href: "/cms/notifications", icon: <Bell size={18} />, roles: ["Admin", "Program Admin", "Researcher", "Partner", "Subscriber"] },
  { label: "Settings", href: "/cms/settings", icon: <Settings size={18} />, roles: ["Admin"] },
];

const SECTION_DIVIDERS: Record<string, string> = {
  "/cms/content": "Content",
  "/cms/father-profiles": "Research",
  "/cms/reports": "Analytics",
  "/cms/subscriber-content": "My Access",
  "/cms/users": "Administration",
  "/cms/notifications": "System",
};

interface Props {
  role: string;
  collapsed: boolean;
}

export default function CmsSidebar({ role, collapsed }: Props) {
  const pathname = usePathname();

  const visibleItems = NAV_ITEMS.filter((item) => item.roles.includes(role));

  return (
    <nav className={`h-full flex flex-col bg-[#111114] transition-all duration-200 ${collapsed ? "w-16" : "w-60"}`}>
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-white/10 ${collapsed ? "justify-center" : ""}`}>
        <div className="w-8 h-8 rounded-lg bg-[#C8963E] flex items-center justify-center shrink-0">
          <span className="text-white font-black text-xs">ITS</span>
        </div>
        {!collapsed && (
          <div>
            <p className="text-white text-sm font-bold leading-tight">I.T.S. Fatherhood</p>
            <p className="text-gray-500 text-[10px] uppercase tracking-widest">Platform CMS</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-3 space-y-0.5 px-2">
        {visibleItems.map((item, idx) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const dividerLabel = SECTION_DIVIDERS[item.href];

          return (
            <div key={item.href}>
              {!collapsed && dividerLabel && idx !== 0 && (
                <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-600 px-3 pt-4 pb-1">
                  {dividerLabel}
                </p>
              )}
              <Link
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all group
                  ${isActive
                    ? "bg-[#C8963E]/15 text-[#C8963E]"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                  }
                  ${collapsed ? "justify-center" : ""}
                `}
              >
                <span className={`shrink-0 ${isActive ? "text-[#C8963E]" : ""}`}>{item.icon}</span>
                {!collapsed && <span className="flex-1 font-medium">{item.label}</span>}
                {!collapsed && isActive && <ChevronRight size={14} className="text-[#C8963E]" />}
              </Link>
            </div>
          );
        })}
      </div>

      {/* Role badge */}
      {!collapsed && (
        <div className="px-4 py-3 border-t border-white/10">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-600">{role}</span>
        </div>
      )}
    </nav>
  );
}
