"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Users, Plus, X, CheckCircle, AlertCircle, Loader2,
  Trash2, Pencil, Search, ChevronLeft, ChevronRight,
  Eye, Mic, ScrollText, ClipboardList, History, UserCheck, ChevronDown,
} from "lucide-react";

const PARTICIPATION_STATUSES = ["active", "completed", "withdrawn", "on-hold"];
const PARTICIPATION_ROLES = ["Participant", "Mentor", "Co-Facilitator", "Observer", "Alumni"];

const STATUS_COLORS: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  completed: "bg-blue-100 text-blue-700",
  withdrawn: "bg-red-100 text-red-700",
  "on-hold": "bg-amber-100 text-amber-700",
};

function EnrollModal({ fatherId, onClose, onEnrolled }: { fatherId: string; onClose: () => void; onEnrolled: () => void }) {
  const [programs, setPrograms] = useState<any[]>([]);
  const [form, setForm] = useState({ program_id: "", participation_role: "", start_date: "", end_date: "", status: "active" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/programs?limit=100").then(r => r.json()).then(d => setPrograms(d.programs ?? []));
  }, []);

  async function handleSave() {
    if (!form.program_id) { setError("Please select a program."); return; }
    setSaving(true); setError(null);
    const res = await fetch("/api/program-participation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ father_profile_id: fatherId, ...form }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error ?? "Failed to enroll"); setSaving(false); return; }
    onEnrolled();
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-bold text-[#111114]">Enroll in Program</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Program <span className="text-red-400">*</span></label>
            <select value={form.program_id} onChange={e => setForm(f => ({ ...f, program_id: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#152A4A] bg-white">
              <option value="">Select a program…</option>
              {programs.map(p => <option key={p.id} value={p.id}>{p.name} ({p.program_type})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Role</label>
            <select value={form.participation_role} onChange={e => setForm(f => ({ ...f, participation_role: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#152A4A] bg-white">
              <option value="">No role specified</option>
              {PARTICIPATION_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Start Date</label>
              <input type="date" value={form.start_date} onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#152A4A]" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">End Date</label>
              <input type="date" value={form.end_date} onChange={e => setForm(f => ({ ...f, end_date: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#152A4A]" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Status</label>
            <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#152A4A] bg-white">
              {PARTICIPATION_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          {error && <p className="text-red-600 text-xs bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
        </div>
        <div className="px-6 py-4 border-t border-gray-100 flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition">Cancel</button>
          <button onClick={handleSave} disabled={saving || !form.program_id}
            className="flex items-center gap-2 bg-[#152A4A] text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-[#1E3A5F] transition disabled:opacity-60">
            {saving ? <><Loader2 size={15} className="animate-spin" /> Enrolling…</> : <><UserCheck size={15} /> Enroll</>}
          </button>
        </div>
      </div>
    </div>
  );
}

interface DrawerData {
  participation: any[];
  transcriptCount: number;
  surveyCount: number;
  history: any[];
}

function ProfileDrawer({ profile, onClose }: { profile: any; onClose: () => void }) {
  const [data, setData] = useState<DrawerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"participation" | "history">("participation");
  const [showEnroll, setShowEnroll] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const [ppRes, trRes, svRes, logRes] = await Promise.all([
      fetch(`/api/program-participation?father_profile_id=${profile.id}`),
      fetch(`/api/transcripts?father_profile_id=${profile.id}`),
      fetch(`/api/survey-responses?father_profile_id=${profile.id}`).catch(() => null),
      fetch(`/api/audit-logs?entity_id=${profile.id}&limit=20`),
    ]);
    const [pp, tr, sv, logs] = await Promise.all([
      ppRes.json(),
      trRes.json(),
      svRes?.json().catch(() => ({ total: 0 })),
      logRes.json(),
    ]);
    setData({
      participation: pp.participation ?? [],
      transcriptCount: tr.total ?? (tr.transcripts?.length ?? 0),
      surveyCount: sv?.total ?? 0,
      history: logs.logs ?? [],
    });
    setLoading(false);
  }, [profile.id]);

  useEffect(() => { load(); }, [load]);

  async function handleRemove(id: string) {
    setRemovingId(id);
    await fetch(`/api/program-participation/${id}`, { method: "DELETE" });
    setRemovingId(null);
    load();
  }

  const name = profile.display_name || `${profile.first_name ?? ""} ${profile.last_name ?? ""}`.trim() || "Father Profile";

  return (
    <>
      <div className="fixed inset-0 z-50 flex justify-end">
        <div className="absolute inset-0 bg-black/30" onClick={onClose} />
        <div className="relative bg-white w-full max-w-lg h-full shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
            <div>
              <h3 className="font-bold text-[#111114]">{name}</h3>
              <p className="text-xs text-gray-400 mt-0.5">{profile.external_profile_code ?? profile.id.slice(0, 8)}</p>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition"><X size={18} /></button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-100 px-6">
            {[
              { id: "participation", label: "Program Participation", icon: <UserCheck size={14} /> },
              { id: "history", label: "Activity History", icon: <History size={14} /> },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id as any)}
                className={`flex items-center gap-1.5 px-3 py-3 text-xs font-semibold border-b-2 transition mr-2 ${
                  tab === t.id ? "border-[#C8963E] text-[#C8963E]" : "border-transparent text-gray-400 hover:text-gray-600"
                }`}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          {/* Summary pills */}
          {data && (
            <div className="flex gap-2 px-6 py-3 border-b border-gray-50">
              <span className="flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full">
                <UserCheck size={11} /> {data.participation.length} program{data.participation.length !== 1 ? "s" : ""}
              </span>
              <span className="flex items-center gap-1 text-xs bg-green-50 text-green-700 px-2.5 py-1 rounded-full">
                <ScrollText size={11} /> {data.transcriptCount} transcript{data.transcriptCount !== 1 ? "s" : ""}
              </span>
              <span className="flex items-center gap-1 text-xs bg-teal-50 text-teal-700 px-2.5 py-1 rounded-full">
                <ClipboardList size={11} /> {data.surveyCount} response{data.surveyCount !== 1 ? "s" : ""}
              </span>
            </div>
          )}

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {loading ? (
              <div className="text-center py-16"><Loader2 size={24} className="animate-spin text-gray-300 mx-auto" /></div>
            ) : tab === "participation" ? (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs text-gray-400">Enrollments via the <code className="bg-gray-100 px-1 py-0.5 rounded">program_participation</code> table</p>
                  <button
                    onClick={() => setShowEnroll(true)}
                    className="flex items-center gap-1.5 text-xs font-semibold bg-[#152A4A] text-white px-3 py-1.5 rounded-lg hover:bg-[#1E3A5F] transition"
                  >
                    <Plus size={12} /> Enroll
                  </button>
                </div>
                {data?.participation.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <UserCheck size={36} className="mx-auto mb-2 text-gray-200" />
                    <p className="text-sm font-medium">Not enrolled in any programs</p>
                    <p className="text-xs mt-1">Click Enroll to add this father to a program.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {data?.participation.map((pp: any) => (
                      <div key={pp.id} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-[#111114] truncate">
                              {pp.programs?.name ?? "Unknown Program"}
                            </p>
                            <div className="flex flex-wrap gap-1.5 mt-1">
                              {pp.programs?.program_type && (
                                <span className="text-xs text-gray-400">{pp.programs.program_type}</span>
                              )}
                              {pp.participation_role && (
                                <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full">
                                  {pp.participation_role}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[pp.status] ?? "bg-gray-100 text-gray-600"}`}>
                              {pp.status}
                            </span>
                            <button
                              onClick={() => handleRemove(pp.id)}
                              disabled={removingId === pp.id}
                              className="p-1 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-400 transition"
                              title="Remove enrollment"
                            >
                              {removingId === pp.id ? <Loader2 size={13} className="animate-spin" /> : <X size={13} />}
                            </button>
                          </div>
                        </div>
                        {(pp.start_date || pp.end_date) && (
                          <p className="text-xs text-gray-400 mt-2">
                            {pp.start_date ? new Date(pp.start_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                            {" → "}
                            {pp.end_date ? new Date(pp.end_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "ongoing"}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div>
                {data?.history.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <History size={36} className="mx-auto mb-2 text-gray-200" />
                    <p className="text-sm">No activity recorded yet.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {data?.history.map((log: any) => (
                      <div key={log.id} className="flex items-start gap-3 py-2.5 border-b border-gray-50 last:border-0">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#C8963E] shrink-0 mt-1.5" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-mono text-gray-600">{log.action}</p>
                          {log.details_json?.actor_email && (
                            <p className="text-xs text-gray-400">by {log.details_json.actor_email}</p>
                          )}
                          <p className="text-xs text-gray-400 mt-0.5">
                            {new Date(log.created_at).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {showEnroll && (
        <EnrollModal
          fatherId={profile.id}
          onClose={() => setShowEnroll(false)}
          onEnrolled={() => { setShowEnroll(false); load(); }}
        />
      )}
    </>
  );
}

interface FatherProfile {
  id: string;
  external_profile_code: string | null;
  first_name: string | null;
  last_name: string | null;
  display_name: string | null;
  city: string | null;
  state: string | null;
  consent_status: string | null;
  justice_involved_flag: boolean | null;
  young_father_flag: boolean | null;
  created_at: string;
}

const CONSENT_COLORS: Record<string, string> = {
  consented: "bg-green-100 text-green-800",
  pending: "bg-amber-100 text-amber-700",
  withdrawn: "bg-red-100 text-red-700",
  declined: "bg-gray-100 text-gray-600",
};

interface Toast { type: "success" | "error"; message: string; }

const EMPTY_FORM = {
  external_profile_code: "",
  first_name: "",
  last_name: "",
  display_name: "",
  date_of_birth: "",
  city: "",
  state: "",
  zip_code: "",
  county: "",
  metro_area: "",
  demographic_group: "",
  justice_involved_flag: false,
  young_father_flag: false,
  consent_status: "pending",
};

const LIMIT = 50;

export default function FatherProfilesManager() {
  const [profiles, setProfiles] = useState<FatherProfile[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [filterConsent, setFilterConsent] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<FatherProfile | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<FatherProfile | null>(null);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchProfiles = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page) });
    if (search) params.set("search", search);
    if (filterConsent) params.set("consent_status", filterConsent);
    const res = await fetch(`/api/father-profiles?${params}`);
    if (res.ok) {
      const d = await res.json();
      setProfiles(d.profiles ?? []);
      setTotal(d.total ?? 0);
    }
    setLoading(false);
  }, [page, search, filterConsent]);

  useEffect(() => { fetchProfiles(); }, [fetchProfiles]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (p: FatherProfile) => {
    setEditing(p);
    setForm({
      external_profile_code: p.external_profile_code ?? "",
      first_name: p.first_name ?? "",
      last_name: p.last_name ?? "",
      display_name: p.display_name ?? "",
      date_of_birth: "",
      city: p.city ?? "",
      state: p.state ?? "",
      zip_code: "",
      county: "",
      metro_area: "",
      demographic_group: "",
      justice_involved_flag: p.justice_involved_flag ?? false,
      young_father_flag: p.young_father_flag ?? false,
      consent_status: p.consent_status ?? "pending",
    });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const body = {
      ...form,
      display_name: form.display_name || `${form.first_name} ${form.last_name}`.trim() || null,
    };

    const res = editing
      ? await fetch(`/api/father-profiles/${editing.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
      : await fetch("/api/father-profiles", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });

    const data = await res.json();
    if (res.ok) {
      showToast("success", editing ? "Profile updated" : "Profile created");
      setShowModal(false);
      fetchProfiles();
    } else {
      showToast("error", data.error ?? "Save failed");
    }
    setSaving(false);
  };

  const handleDelete = async (p: FatherProfile) => {
    const name = p.display_name || `${p.first_name ?? ""} ${p.last_name ?? ""}`.trim() || p.id;
    if (!confirm(`Delete profile for "${name}"? This also removes linked interviews, transcripts, and assessment results.`)) return;
    const res = await fetch(`/api/father-profiles/${p.id}`, { method: "DELETE" });
    if (res.ok) {
      showToast("success", "Profile deleted");
      setProfiles((prev) => prev.filter((x) => x.id !== p.id));
      setTotal((t) => t - 1);
    } else {
      showToast("error", "Delete failed");
    }
  };

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div>
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium ${
          toast.type === "success" ? "bg-green-50 text-green-800 border border-green-200" : "bg-red-50 text-red-800 border border-red-200"
        }`}>
          {toast.type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          {toast.message}
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#111114]">Father Profiles</h2>
          <p className="text-sm text-gray-500 mt-0.5">{total.toLocaleString()} profile{total !== 1 ? "s" : ""} on record</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-[#C8963E] hover:bg-[#b3832c] text-white font-semibold px-4 py-2.5 rounded-lg transition-colors text-sm">
          <Plus size={16} />Add Profile
        </button>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search name or code…"
              className="pl-8 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#152A4A] w-56"
            />
          </div>
          <button type="submit" className="px-3 py-2 bg-[#152A4A] text-white rounded-lg text-sm font-medium hover:bg-[#1e3a63] transition-colors">Search</button>
          {search && <button type="button" onClick={() => { setSearch(""); setSearchInput(""); setPage(1); }} className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-500 hover:bg-gray-50">Clear</button>}
        </form>
        {["", "consented", "pending", "withdrawn", "declined"].map((c) => (
          <button key={c} onClick={() => { setFilterConsent(c); setPage(1); }} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filterConsent === c ? "bg-[#152A4A] text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"}`}>
            {c === "" ? "All Consent" : c.charAt(0).toUpperCase() + c.slice(1)}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 size={22} className="animate-spin text-[#152A4A]" /></div>
        ) : profiles.length === 0 ? (
          <div className="text-center py-20">
            <Users size={36} className="mx-auto mb-3 text-gray-200" />
            <p className="text-gray-500 text-sm font-medium">{search ? "No profiles match your search" : "No father profiles yet"}</p>
            {!search && <button onClick={openCreate} className="mt-3 text-[#152A4A] text-sm font-medium hover:underline">Add your first profile →</button>}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Code</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Flags</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Consent</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Added</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {profiles.map((p) => {
                    const name = p.display_name || `${p.first_name ?? ""} ${p.last_name ?? ""}`.trim() || "—";
                    return (
                      <tr key={p.id} className="hover:bg-gray-50 transition-colors group">
                        <td className="px-5 py-3.5 font-medium text-[#111114]">{name}</td>
                        <td className="px-5 py-3.5 text-gray-400 text-xs font-mono">{p.external_profile_code ?? "—"}</td>
                        <td className="px-5 py-3.5 text-gray-500 text-xs">{p.city && p.state ? `${p.city}, ${p.state}` : p.city ?? p.state ?? "—"}</td>
                        <td className="px-5 py-3.5">
                          <div className="flex gap-1 flex-wrap">
                            {p.justice_involved_flag && <span className="px-1.5 py-0.5 rounded text-xs bg-orange-100 text-orange-700 font-medium">JI</span>}
                            {p.young_father_flag && <span className="px-1.5 py-0.5 rounded text-xs bg-sky-100 text-sky-700 font-medium">YF</span>}
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${CONSENT_COLORS[p.consent_status ?? ""] ?? "bg-gray-100 text-gray-600"}`}>
                            {p.consent_status ?? "—"}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-gray-400 text-xs whitespace-nowrap">
                          {new Date(p.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => setSelectedProfile(p)} className="p-1.5 rounded-lg text-gray-400 hover:text-teal-600 hover:bg-teal-50 transition-colors" title="View participation"><Eye size={14} /></button>
                            <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg text-gray-400 hover:text-[#152A4A] hover:bg-[#152A4A]/8 transition-colors" title="Edit"><Pencil size={14} /></button>
                            <button onClick={() => handleDelete(p)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors" title="Delete"><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
                <p className="text-xs text-gray-400">Page {page} of {totalPages} · {total} total</p>
                <div className="flex items-center gap-1">
                  <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-40 transition-colors"><ChevronLeft size={16} /></button>
                  <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-40 transition-colors"><ChevronRight size={16} /></button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Profile participation drawer */}
      {selectedProfile && (
        <ProfileDrawer profile={selectedProfile} onClose={() => setSelectedProfile(null)} />
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
              <div>
                <h3 className="font-bold text-[#111114]">{editing ? "Edit Father Profile" : "Add Father Profile"}</h3>
                <p className="text-xs text-gray-500 mt-0.5">Participant record linked to surveys, interviews, and assessments</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 p-1"><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="px-6 py-5 space-y-4">
              {/* Identity */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Identity</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-[#111114] mb-1">First Name</label>
                    <input type="text" value={form.first_name} onChange={(e) => setForm((f) => ({ ...f, first_name: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#152A4A]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#111114] mb-1">Last Name</label>
                    <input type="text" value={form.last_name} onChange={(e) => setForm((f) => ({ ...f, last_name: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#152A4A]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#111114] mb-1">Display Name</label>
                    <input type="text" value={form.display_name} onChange={(e) => setForm((f) => ({ ...f, display_name: e.target.value }))} placeholder="Auto-generated if blank" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#152A4A]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#111114] mb-1">External Profile Code</label>
                    <input type="text" value={form.external_profile_code} onChange={(e) => setForm((f) => ({ ...f, external_profile_code: e.target.value }))} placeholder="e.g. ITS-2024-001" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#152A4A] font-mono" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#111114] mb-1">Date of Birth</label>
                    <input type="date" value={form.date_of_birth} onChange={(e) => setForm((f) => ({ ...f, date_of_birth: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#152A4A]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#111114] mb-1">Demographic Group</label>
                    <input type="text" value={form.demographic_group} onChange={(e) => setForm((f) => ({ ...f, demographic_group: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#152A4A]" />
                  </div>
                </div>
              </div>

              {/* Location */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Location</p>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-[#111114] mb-1">City</label>
                    <input type="text" value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#152A4A]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#111114] mb-1">State</label>
                    <input type="text" value={form.state} onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))} maxLength={2} placeholder="IL" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#152A4A] uppercase" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#111114] mb-1">ZIP Code</label>
                    <input type="text" value={form.zip_code} onChange={(e) => setForm((f) => ({ ...f, zip_code: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#152A4A]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#111114] mb-1">County</label>
                    <input type="text" value={form.county} onChange={(e) => setForm((f) => ({ ...f, county: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#152A4A]" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-[#111114] mb-1">Metro Area</label>
                    <input type="text" value={form.metro_area} onChange={(e) => setForm((f) => ({ ...f, metro_area: e.target.value }))} placeholder="e.g. Chicago Metro" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#152A4A]" />
                  </div>
                </div>
              </div>

              {/* Flags & Consent */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Flags & Consent</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-[#111114] mb-1">Consent Status</label>
                    <select value={form.consent_status} onChange={(e) => setForm((f) => ({ ...f, consent_status: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#152A4A] bg-white">
                      <option value="pending">Pending</option>
                      <option value="consented">Consented</option>
                      <option value="withdrawn">Withdrawn</option>
                      <option value="declined">Declined</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-3 justify-center pt-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={form.justice_involved_flag} onChange={(e) => setForm((f) => ({ ...f, justice_involved_flag: e.target.checked }))} className="rounded" />
                      <span className="text-sm text-[#111114]">Justice Involved</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={form.young_father_flag} onChange={(e) => setForm((f) => ({ ...f, young_father_flag: e.target.checked }))} className="rounded" />
                      <span className="text-sm text-[#111114]">Young Father (24 and under)</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 flex items-center justify-center gap-2 bg-[#C8963E] hover:bg-[#b3832c] text-white font-semibold px-4 py-2.5 rounded-lg text-sm transition disabled:opacity-60">
                  {saving ? <Loader2 size={15} className="animate-spin" /> : null}
                  {saving ? "Saving…" : editing ? "Save Changes" : "Add Profile"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
