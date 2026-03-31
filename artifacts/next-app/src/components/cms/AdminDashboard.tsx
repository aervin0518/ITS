"use client";

import { useState, useEffect, useCallback } from "react";
import { UserWithRole } from "@/types/auth";
import {
  Users,
  UserPlus,
  Shield,
  ChevronDown,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  ToggleLeft,
  ToggleRight,
  Trash2,
  Mail,
} from "lucide-react";

const ROLE_COLORS: Record<string, string> = {
  "Admin": "bg-purple-100 text-purple-800",
  "Program Admin": "bg-blue-100 text-blue-800",
  "Researcher": "bg-green-100 text-green-800",
  "Partner": "bg-amber-100 text-amber-800",
  "Subscriber": "bg-gray-100 text-gray-700",
};

function roleColor(role: string | null) {
  return ROLE_COLORS[role ?? ""] ?? "bg-gray-100 text-gray-600";
}

interface Toast {
  type: "success" | "error";
  message: string;
}

interface Role {
  id: string;
  name: string;
}

function fullName(u: { first_name: string | null; last_name: string | null }) {
  return [u.first_name, u.last_name].filter(Boolean).join(" ") || "—";
}

export default function AdminDashboard({ profile }: { profile: UserWithRole }) {
  // Users state
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  // Roles for dropdown
  const [roles, setRoles] = useState<Role[]>([]);

  // Modal + tabs
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const [activeTab, setActiveTab] = useState<"users" | "overview">("users");

  // Create user form state
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    role_id: "",
  });
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 5000);
  };

  const fetchUsers = useCallback(async () => {
    setLoadingUsers(true);
    const res = await fetch("/api/admin/users");
    const data = await res.json();
    if (res.ok) setUsers(data.users ?? []);
    setLoadingUsers(false);
  }, []);

  const fetchRoles = useCallback(async () => {
    const res = await fetch("/api/admin/roles");
    const data = await res.json();
    if (res.ok && data.roles?.length) {
      setRoles(data.roles);
      setForm((f) => ({ ...f, role_id: data.roles[0].id }));
    }
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, [fetchUsers, fetchRoles]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setFormError(null);

    const res = await fetch("/api/admin/create-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      showToast("success", `Invitation sent to ${form.email}`);
      setShowCreateModal(false);
      setFormError(null);
      setForm({ first_name: "", last_name: "", email: "", role_id: roles[0]?.id ?? "" });
      fetchUsers();
    } else {
      setFormError(data.error ?? "Failed to send invitation. Please try again.");
    }

    setCreating(false);
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    const matchedRole = roles.find((r) => r.name === newRole);
    if (!matchedRole) return;

    const res = await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });

    if (res.ok) {
      showToast("success", "Role updated");
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
    } else {
      showToast("error", "Failed to update role");
    }
  };

  const handleToggleStatus = async (userId: string, currentStatus: string | null) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    if (res.ok) {
      showToast("success", `User ${newStatus === "active" ? "activated" : "deactivated"}`);
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u)));
    } else {
      showToast("error", "Failed to update status");
    }
  };

  const handleDelete = async (userId: string, userEmail: string | null) => {
    if (!confirm(`Permanently delete ${userEmail ?? "this user"}? This cannot be undone.`)) return;

    const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });

    if (res.ok) {
      showToast("success", "User deleted");
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } else {
      const data = await res.json();
      showToast("error", data.error ?? "Failed to delete user");
    }
  };

  return (
    <div className="bg-[#FAF8F5] min-h-full">

      {/* Toast — z-[70] so it renders above the z-50 modal overlay */}
      {toast && (
        <div className={`fixed top-4 right-4 z-[70] flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium ${
          toast.type === "success"
            ? "bg-green-50 text-green-800 border border-green-200"
            : "bg-red-50 text-red-800 border border-red-200"
        }`}>
          {toast.type === "success"
            ? <CheckCircle className="w-4 h-4 shrink-0" />
            : <AlertCircle className="w-4 h-4 shrink-0" />}
          {toast.message}
        </div>
      )}

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

        {/* ── USER MANAGEMENT TAB ── */}
        {activeTab === "users" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-[#111114]">Platform Users</h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  {users.length} user{users.length !== 1 ? "s" : ""} total
                </p>
              </div>
              <button
                onClick={() => { setFormError(null); setShowCreateModal(true); }}
                className="flex items-center gap-2 bg-[#C8963E] hover:bg-[#b3832c] text-white font-semibold px-4 py-2.5 rounded-lg transition-colors text-sm"
              >
                <UserPlus className="w-4 h-4" />
                Invite User
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {loadingUsers ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="w-6 h-6 animate-spin text-[#152A4A]" />
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-16">
                  <Users className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">No users yet.</p>
                  <button
                    onClick={() => { setFormError(null); setShowCreateModal(true); }}
                    className="mt-3 text-[#152A4A] text-sm font-medium hover:underline"
                  >
                    Invite your first user →
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50">
                        <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Created</th>
                        <th className="px-5 py-3" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {users.map((u) => (
                        <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-5 py-4">
                            <div>
                              <p className="font-medium text-[#111114]">
                                {fullName(u)}
                                {u.id === profile.id && (
                                  <span className="ml-2 text-xs text-gray-400">(you)</span>
                                )}
                              </p>
                              <p className="text-gray-500 text-xs mt-0.5">{u.email}</p>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            {u.id === profile.id ? (
                              <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${roleColor(u.role)}`}>
                                {u.role ?? "—"}
                              </span>
                            ) : (
                              <div className="relative inline-block">
                                <select
                                  value={u.role ?? ""}
                                  onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                  className={`appearance-none pr-7 pl-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer border-0 focus:outline-none focus:ring-2 focus:ring-[#152A4A] ${roleColor(u.role)}`}
                                >
                                  {roles.map((r) => (
                                    <option key={r.id} value={r.name}>{r.name}</option>
                                  ))}
                                </select>
                                <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none" />
                              </div>
                            )}
                          </td>
                          <td className="px-5 py-4">
                            {u.id === profile.id ? (
                              <span className="text-xs text-green-700 font-medium">Active</span>
                            ) : (
                              <button
                                onClick={() => handleToggleStatus(u.id, u.status)}
                                className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
                                  u.status === "active"
                                    ? "text-green-700 hover:text-red-600"
                                    : "text-gray-400 hover:text-green-700"
                                }`}
                              >
                                {u.status === "active"
                                  ? <ToggleRight className="w-4 h-4" />
                                  : <ToggleLeft className="w-4 h-4" />}
                                {u.status === "active" ? "Active" : "Inactive"}
                              </button>
                            )}
                          </td>
                          <td className="px-5 py-4 text-gray-400 text-xs">
                            {new Date(u.created_at).toLocaleDateString("en-US", {
                              month: "short", day: "numeric", year: "numeric",
                            })}
                          </td>
                          <td className="px-5 py-4">
                            {u.id !== profile.id && (
                              <button
                                onClick={() => handleDelete(u.id, u.email)}
                                className="text-gray-300 hover:text-red-500 transition-colors"
                                title="Delete user"
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
              )}
            </div>
          </div>
        )}

        {/* ── OVERVIEW TAB ── */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {roles.map((role) => {
              const count = users.filter((u) => u.role === role.name).length;
              return (
                <div key={role.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                  <p className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-1">{role.name}</p>
                  <p className="text-3xl font-bold text-[#111114]">{count}</p>
                  <span className={`inline-block mt-2 px-2 py-0.5 rounded-full text-xs font-semibold ${roleColor(role.name)}`}>
                    {role.name}
                  </span>
                </div>
              );
            })}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <p className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-1">Total Users</p>
              <p className="text-3xl font-bold text-[#111114]">{users.length}</p>
              <p className="text-xs text-gray-400 mt-2">
                {users.filter((u) => u.status === "active").length} active
              </p>
            </div>
          </div>
        )}
      </main>

      {/* ── CREATE USER MODAL ── */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
              <div>
                <h3 className="font-bold text-[#111114]">Invite New User</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  They'll receive an email to set their own password.
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="px-6 py-5 space-y-4">
              {/* Name row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-[#111114] mb-1.5">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.first_name}
                    onChange={(e) => setForm((f) => ({ ...f, first_name: e.target.value }))}
                    required
                    placeholder="Jane"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#152A4A] transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#111114] mb-1.5">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.last_name}
                    onChange={(e) => setForm((f) => ({ ...f, last_name: e.target.value }))}
                    required
                    placeholder="Smith"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#152A4A] transition"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-[#111114] mb-1.5">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  required
                  placeholder="jane@example.com"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#152A4A] transition"
                />
              </div>

              {/* Invitation notice */}
              <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
                <Mail className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-700">
                  Supabase will send an invitation email to this address. The user clicks the link to set their own password and activate their account.
                </p>
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-[#111114] mb-1.5">
                  Role <span className="text-red-500">*</span>
                </label>
                {roles.length === 0 ? (
                  <div className="flex items-center gap-2 py-2.5 text-sm text-gray-400">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading roles…
                  </div>
                ) : (
                  <select
                    value={form.role_id}
                    onChange={(e) => setForm((f) => ({ ...f, role_id: e.target.value }))}
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#152A4A] transition bg-white"
                  >
                    {roles.map((r) => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                )}
                {form.role_id && (
                  <div className="mt-2">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${roleColor(roles.find((r) => r.id === form.role_id)?.name ?? "")}`}>
                      {roles.find((r) => r.id === form.role_id)?.name}
                    </span>
                  </div>
                )}
              </div>

              {/* Inline error */}
              {formError && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-red-700">{formError}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating || roles.length === 0}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#C8963E] hover:bg-[#b3832c] text-white font-semibold px-4 py-2.5 rounded-lg text-sm transition disabled:opacity-60"
                >
                  {creating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending…
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4" />
                      Send Invitation
                    </>
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
