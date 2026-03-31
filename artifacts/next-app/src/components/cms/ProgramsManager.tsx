"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Layers, Plus, Pencil, Trash2, X, Loader2, Search, Check, ChevronDown,
} from "lucide-react";

interface Program {
  id: string;
  name: string;
  program_type: string | null;
  status: string | null;
}

const PROGRAM_TYPES = ["Mentorship", "Reentry", "Parenting", "Financial Literacy", "Employment", "Counseling", "Community Outreach", "Other"];
const STATUS_OPTIONS = ["active", "inactive", "pilot", "archived"];

const STATUS_COLORS: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  inactive: "bg-gray-100 text-gray-500",
  pilot: "bg-blue-100 text-blue-700",
  archived: "bg-amber-100 text-amber-700",
};

const EMPTY: Omit<Program, "id"> = { name: "", program_type: null, status: "active" };

export default function ProgramsManager() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Program | null>(null);
  const [form, setForm] = useState<Omit<Program, "id">>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filterStatus !== "all") params.set("status", filterStatus);
      if (search) params.set("q", search);
      const res = await fetch(`/api/programs?${params}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setPrograms(data.programs ?? []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [filterStatus, search]);

  useEffect(() => { load(); }, [load]);

  function openCreate() {
    setEditing(null);
    setForm(EMPTY);
    setShowForm(true);
  }

  function openEdit(p: Program) {
    setEditing(p);
    setForm({ name: p.name, program_type: p.program_type, status: p.status });
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditing(null);
    setForm(EMPTY);
  }

  async function handleSave() {
    if (!form.name.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const url = editing ? `/api/programs/${editing.id}` : "/api/programs";
      const method = editing ? "PATCH" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Save failed");
      await load();
      closeForm();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/programs/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Delete failed");
      setPrograms((prev) => prev.filter((p) => p.id !== id));
      setConfirmDeleteId(null);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setDeletingId(null);
    }
  }

  const filtered = programs.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-700">
            <Layers size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#111114]">Programs</h1>
            <p className="text-sm text-gray-500">Manage fatherhood programs and link them to participants.</p>
          </div>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-[#152A4A] text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-[#1E3A5F] transition"
        >
          <Plus size={16} /> New Program
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search programs…"
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#152A4A]"
          />
        </div>
        <div className="relative">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#152A4A] bg-white"
          >
            <option value="all">All statuses</option>
            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 flex justify-between items-center mb-4">
          <p className="text-red-700 text-sm">{error}</p>
          <button onClick={() => setError(null)}><X size={14} className="text-red-400" /></button>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="text-center py-16 text-gray-400">
          <Loader2 size={32} className="mx-auto animate-spin mb-3 text-gray-300" />
          <p className="text-sm">Loading programs…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
          <Layers size={40} className="mx-auto mb-3 text-gray-200" />
          <p className="font-medium text-gray-500">{search ? "No programs match your search" : "No programs yet"}</p>
          <p className="text-sm text-gray-400 mt-1">Create your first program to start tracking participation.</p>
          <button onClick={openCreate} className="mt-4 bg-[#152A4A] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#1E3A5F] transition">
            + New Program
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <div key={p.id} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition group">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#111114] truncate">{p.name}</p>
                  {p.program_type && (
                    <p className="text-xs text-gray-400 mt-0.5">{p.program_type}</p>
                  )}
                </div>
                <span className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_COLORS[p.status ?? "inactive"] ?? "bg-gray-100 text-gray-500"}`}>
                  {p.status ?? "—"}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-50">
                <button
                  onClick={() => openEdit(p)}
                  className="flex-1 flex items-center justify-center gap-1.5 text-xs text-gray-500 hover:text-[#152A4A] hover:bg-gray-50 py-1.5 rounded-lg transition"
                >
                  <Pencil size={13} /> Edit
                </button>
                {confirmDeleteId === p.id ? (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDelete(p.id)}
                      disabled={deletingId === p.id}
                      className="flex items-center gap-1 text-xs font-semibold text-red-600 hover:bg-red-50 px-2 py-1.5 rounded-lg transition"
                    >
                      {deletingId === p.id ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />} Confirm
                    </button>
                    <button onClick={() => setConfirmDeleteId(null)} className="text-xs text-gray-400 hover:bg-gray-50 px-2 py-1.5 rounded-lg transition">
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmDeleteId(p.id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-400 mt-4 text-right">{filtered.length} program{filtered.length !== 1 ? "s" : ""}</p>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-[#111114]">{editing ? "Edit Program" : "New Program"}</h2>
              <button onClick={closeForm} className="p-1.5 rounded-lg hover:bg-gray-100 transition">
                <X size={18} className="text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Program Name <span className="text-red-400">*</span></label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Reentry Fatherhood Initiative"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#152A4A]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Program Type</label>
                <select
                  value={form.program_type ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, program_type: e.target.value || null }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#152A4A] bg-white"
                >
                  <option value="">Select type…</option>
                  {PROGRAM_TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Status</label>
                <select
                  value={form.status ?? "active"}
                  onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#152A4A] bg-white"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                  ))}
                </select>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex gap-3 justify-end">
              <button onClick={closeForm} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition">
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!form.name.trim() || saving}
                className="flex items-center gap-2 bg-[#152A4A] text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-[#1E3A5F] transition disabled:opacity-60"
              >
                {saving ? <><Loader2 size={15} className="animate-spin" /> Saving…</> : <><Check size={15} /> {editing ? "Save Changes" : "Create Program"}</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
