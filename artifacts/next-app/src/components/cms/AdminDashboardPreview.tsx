"use client";

import { useState } from "react";
import Link from "next/link";
import { UserRole } from "@/types/auth";
import {
  Users,
  UserPlus,
  Shield,
  ChevronDown,
  X,
  CheckCircle,
  Loader2,
  ToggleLeft,
  ToggleRight,
  Trash2,
  LogOut,
  AlertCircle,
} from "lucide-react";

const ROLE_LABELS: Record<UserRole, string> = {
  admin: "Administrator",
  program_admin: "Program Admin",
  researcher: "Researcher",
  partner: "Partner",
  subscriber: "Subscriber",
};

const ROLE_COLORS: Record<UserRole, string> = {
  admin: "bg-purple-100 text-purple-800",
  program_admin: "bg-blue-100 text-blue-800",
  researcher: "bg-green-100 text-green-800",
  partner: "bg-amber-100 text-amber-800",
  subscriber: "bg-gray-100 text-gray-700",
};

const MOCK_USERS = [
  {
    id: "1",
    email: "admin@itsfatherhood.org",
    full_name: "Marcus Thompson",
    role: "admin" as UserRole,
    is_active: true,
    created_at: "2025-01-15T00:00:00Z",
  },
  {
    id: "2",
    email: "program@itsfatherhood.org",
    full_name: "Denise Williams",
    role: "program_admin" as UserRole,
    is_active: true,
    created_at: "2025-02-03T00:00:00Z",
  },
  {
    id: "3",
    email: "researcher@itsfatherhood.org",
    full_name: "Dr. James Okafor",
    role: "researcher" as UserRole,
    is_active: true,
    created_at: "2025-02-20T00:00:00Z",
  },
  {
    id: "4",
    email: "partner@unitedway.org",
    full_name: "Sarah Chen",
    role: "partner" as UserRole,
    is_active: true,
    created_at: "2025-03-01T00:00:00Z",
  },
  {
    id: "5",
    email: "subscriber@example.com",
    full_name: "Robert Davis",
    role: "subscriber" as UserRole,
    is_active: false,
    created_at: "2025-03-10T00:00:00Z",
  },
];

export default function AdminDashboardPreview() {
  const [users, setUsers] = useState(MOCK_USERS);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"users" | "overview">("users");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [inviteRole, setInviteRole] = useState<UserRole>("subscriber");
  const [inviting, setInviting] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "info"; message: string } | null>(null);

  const showToast = (type: "success" | "info", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const handleInviteDemo = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviting(true);
    await new Promise((r) => setTimeout(r, 1200));
    setUsers((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        email: inviteEmail,
        full_name: inviteName,
        role: inviteRole,
        is_active: true,
        created_at: new Date().toISOString(),
      },
    ]);
    showToast("success", `Demo: Invitation would be sent to ${inviteEmail}`);
    setShowInviteModal(false);
    setInviteEmail("");
    setInviteName("");
    setInviteRole("subscriber");
    setInviting(false);
  };

  const handleToggleActive = (userId: string, current: boolean) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, is_active: !current } : u))
    );
    showToast("success", `User ${!current ? "activated" : "deactivated"}`);
  };

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
    showToast("success", "Role updated");
  };

  const handleDelete = (userId: string) => {
    if (userId === "1") return;
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    showToast("success", "User removed");
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Preview Banner */}
      <div className="bg-amber-500 text-white text-center text-xs font-semibold py-2 px-4 flex items-center justify-center gap-2">
        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
        PREVIEW MODE — This is a demo with sample data. Connect Supabase to activate the live system.
        <Link href="/login" className="underline ml-1">
          Go to Login →
        </Link>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium bg-green-50 text-green-800 border border-green-200">
          <CheckCircle className="w-4 h-4 shrink-0" />
          {toast.message}
        </div>
      )}

      {/* Header */}
      <header className="bg-[#152A4A] text-white px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-[#C8963E] p-2 rounded-lg">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">Admin Dashboard</h1>
            <p className="text-blue-200 text-xs">I.T.S. Fatherhood Platform</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium">Marcus Thompson</p>
            <p className="text-blue-300 text-xs">Administrator</p>
          </div>
          <Link
            href="/login"
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg text-sm transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </Link>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-gray-200 bg-white px-6">
        <div className="max-w-6xl mx-auto flex">
          {[
            { key: "users", label: "User Management", icon: <Users className="w-4 h-4" /> },
            { key: "overview", label: "Overview", icon: <Shield className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as "users" | "overview")}
              className={`flex items-center gap-2 px-5 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? "border-[#152A4A] text-[#152A4A]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* USER MANAGEMENT TAB */}
        {activeTab === "users" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-[#111114]">Platform Users</h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  {users.length} users · {users.filter((u) => u.is_active).length} active
                </p>
              </div>
              <button
                onClick={() => setShowInviteModal(true)}
                className="flex items-center gap-2 bg-[#C8963E] hover:bg-[#b3832c] text-white font-semibold px-4 py-2.5 rounded-lg transition-colors text-sm"
              >
                <UserPlus className="w-4 h-4" />
                Invite User
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
                      <th className="px-5 py-3" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-4">
                          <p className="font-medium text-[#111114]">
                            {u.full_name}
                            {u.id === "1" && (
                              <span className="ml-2 text-xs text-gray-400">(you)</span>
                            )}
                          </p>
                          <p className="text-gray-500 text-xs mt-0.5">{u.email}</p>
                        </td>
                        <td className="px-5 py-4">
                          {u.id === "1" ? (
                            <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${ROLE_COLORS[u.role]}`}>
                              {ROLE_LABELS[u.role]}
                            </span>
                          ) : (
                            <div className="relative inline-block">
                              <select
                                value={u.role}
                                onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                                className={`appearance-none pr-7 pl-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer border-0 focus:outline-none focus:ring-2 focus:ring-[#152A4A] ${ROLE_COLORS[u.role]}`}
                              >
                                {Object.entries(ROLE_LABELS).map(([val, label]) => (
                                  <option key={val} value={val}>{label}</option>
                                ))}
                              </select>
                              <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none" />
                            </div>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          {u.id === "1" ? (
                            <span className="text-xs text-green-700 font-medium">Active</span>
                          ) : (
                            <button
                              onClick={() => handleToggleActive(u.id, u.is_active)}
                              className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
                                u.is_active ? "text-green-700 hover:text-red-600" : "text-gray-400 hover:text-green-700"
                              }`}
                            >
                              {u.is_active ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                              {u.is_active ? "Active" : "Inactive"}
                            </button>
                          )}
                        </td>
                        <td className="px-5 py-4 text-gray-400 text-xs">
                          {new Date(u.created_at).toLocaleDateString("en-US", {
                            month: "short", day: "numeric", year: "numeric",
                          })}
                        </td>
                        <td className="px-5 py-4">
                          {u.id !== "1" && (
                            <button
                              onClick={() => handleDelete(u.id)}
                              className="text-gray-300 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(Object.entries(ROLE_LABELS) as [UserRole, string][]).map(([role, label]) => {
              const count = users.filter((u) => u.role === role).length;
              return (
                <div key={role} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                  <p className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-1">{label}</p>
                  <p className="text-3xl font-bold text-[#111114]">{count}</p>
                  <span className={`inline-block mt-2 px-2 py-0.5 rounded-full text-xs font-semibold ${ROLE_COLORS[role]}`}>
                    {role}
                  </span>
                </div>
              );
            })}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <p className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-1">Total Users</p>
              <p className="text-3xl font-bold text-[#111114]">{users.length}</p>
              <p className="text-xs text-gray-400 mt-2">
                {users.filter((u) => u.is_active).length} active
              </p>
            </div>
          </div>
        )}
      </main>

      {/* INVITE MODAL */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div>
                <h3 className="font-bold text-[#111114]">Invite New User</h3>
                <p className="text-xs text-gray-500 mt-0.5">They'll receive an email to set their password.</p>
              </div>
              <button onClick={() => setShowInviteModal(false)} className="text-gray-400 hover:text-gray-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleInviteDemo} className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#111114] mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  required
                  placeholder="Jane Smith"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#152A4A] transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#111114] mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  required
                  placeholder="jane@example.com"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#152A4A] transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#111114] mb-1.5">Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as UserRole)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#152A4A] transition bg-white"
                >
                  {Object.entries(ROLE_LABELS).map(([val, label]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
                <p className="text-xs text-gray-400 mt-1.5">
                  {inviteRole === "admin" && "Full platform access including user management."}
                  {inviteRole === "program_admin" && "Access to program metrics and participant data."}
                  {inviteRole === "researcher" && "Access to research data and publications."}
                  {inviteRole === "partner" && "Access to partner resources and impact reports."}
                  {inviteRole === "subscriber" && "Access to subscriber content and newsletter archive."}
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={inviting}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#C8963E] hover:bg-[#b3832c] text-white font-semibold px-4 py-2.5 rounded-lg text-sm transition disabled:opacity-60"
                >
                  {inviting ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</>
                  ) : (
                    <><UserPlus className="w-4 h-4" /> Send Invitation</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
