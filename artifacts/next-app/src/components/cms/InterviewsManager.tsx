"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Mic, Plus, X, CheckCircle, AlertCircle, Loader2,
  Calendar, FileText, Trash2, Pencil,
} from "lucide-react";

interface Interview {
  id: string;
  interviewer_user_id: string | null;
  father_profile_id: string | null;
  program_id: string | null;
  interview_date: string | null;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

type Status = "scheduled" | "complete" | "reviewed";

const STATUS_COLORS: Record<string, string> = {
  scheduled: "bg-blue-100 text-blue-800",
  complete: "bg-green-100 text-green-800",
  reviewed: "bg-purple-100 text-purple-800",
};

interface Toast { type: "success" | "error"; message: string; }

const EMPTY_FORM = {
  interview_date: "",
  status: "scheduled" as Status,
  notes: "",
  father_profile_id: "",
  program_id: "",
};

export default function InterviewsManager() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Interview | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchInterviews = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filterStatus) params.set("status", filterStatus);
    const res = await fetch(`/api/interviews?${params}`);
    if (res.ok) {
      const data = await res.json();
      setInterviews(data.interviews ?? []);
      setTotal(data.total ?? 0);
    }
    setLoading(false);
  }, [filterStatus]);

  useEffect(() => { fetchInterviews(); }, [fetchInterviews]);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (iv: Interview) => {
    setEditing(iv);
    setForm({
      interview_date: iv.interview_date ? iv.interview_date.slice(0, 16) : "",
      status: iv.status as Status,
      notes: iv.notes ?? "",
      father_profile_id: iv.father_profile_id ?? "",
      program_id: iv.program_id ?? "",
    });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const body = {
      interview_date: form.interview_date || null,
      status: form.status,
      notes: form.notes.trim() || null,
      father_profile_id: form.father_profile_id.trim() || null,
      program_id: form.program_id.trim() || null,
    };

    const res = editing
      ? await fetch(`/api/interviews/${editing.id}`, {
          method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
        })
      : await fetch("/api/interviews", {
          method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
        });

    const data = await res.json();
    if (res.ok) {
      showToast("success", editing ? "Interview updated" : "Interview created");
      setShowModal(false);
      fetchInterviews();
    } else {
      showToast("error", data.error ?? "Save failed");
    }
    setSaving(false);
  };

  const handleDelete = async (iv: Interview) => {
    if (!confirm(`Delete this interview record? This cannot be undone.`)) return;
    const res = await fetch(`/api/interviews/${iv.id}`, { method: "DELETE" });
    if (res.ok) {
      showToast("success", "Interview deleted");
      setInterviews((prev) => prev.filter((i) => i.id !== iv.id));
    } else {
      showToast("error", "Delete failed");
    }
  };

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
          <h2 className="text-xl font-bold text-[#111114]">Interview Records</h2>
          <p className="text-sm text-gray-500 mt-0.5">{total} interview{total !== 1 ? "s" : ""} on record</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-[#C8963E] hover:bg-[#b3832c] text-white font-semibold px-4 py-2.5 rounded-lg transition-colors text-sm"
        >
          <Plus size={16} />
          New Interview
        </button>
      </div>

      {/* Status filters */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {["", "scheduled", "complete", "reviewed"].map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              filterStatus === s
                ? "bg-[#152A4A] text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
            }`}
          >
            {s === "" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={22} className="animate-spin text-[#152A4A]" />
          </div>
        ) : interviews.length === 0 ? (
          <div className="text-center py-20">
            <Mic size={36} className="mx-auto mb-3 text-gray-200" />
            <p className="text-gray-500 text-sm font-medium">No interviews yet</p>
            <button onClick={openCreate} className="mt-3 text-[#152A4A] text-sm font-medium hover:underline">
              Add your first interview →
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Father ID</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Notes</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Logged</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {interviews.map((iv) => (
                  <tr key={iv.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-5 py-3.5">
                      {iv.interview_date ? (
                        <span className="flex items-center gap-1.5 text-[#111114] font-medium">
                          <Calendar size={13} className="text-gray-400" />
                          {new Date(iv.interview_date).toLocaleDateString("en-US", {
                            month: "short", day: "numeric", year: "numeric",
                          })}
                        </span>
                      ) : (
                        <span className="text-gray-300 italic text-xs">No date set</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[iv.status] ?? "bg-gray-100 text-gray-600"}`}>
                        {iv.status.charAt(0).toUpperCase() + iv.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-400 text-xs font-mono">
                      {iv.father_profile_id ? iv.father_profile_id.slice(0, 8) + "…" : "—"}
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 text-xs max-w-xs truncate">
                      {iv.notes ?? "—"}
                    </td>
                    <td className="px-5 py-3.5 text-gray-400 text-xs whitespace-nowrap">
                      {new Date(iv.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEdit(iv)} className="p-1.5 rounded-lg text-gray-400 hover:text-[#152A4A] hover:bg-[#152A4A]/8 transition-colors" title="Edit">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => handleDelete(iv)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors" title="Delete">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
              <div>
                <h3 className="font-bold text-[#111114]">{editing ? "Edit Interview" : "New Interview"}</h3>
                <p className="text-xs text-gray-500 mt-0.5">Record a participant interview session</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 p-1">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSave} className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-[#111114] mb-1.5">Date & Time</label>
                  <input
                    type="datetime-local"
                    value={form.interview_date}
                    onChange={(e) => setForm((f) => ({ ...f, interview_date: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#152A4A] bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#111114] mb-1.5">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as Status }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#152A4A] bg-white"
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="complete">Complete</option>
                    <option value="reviewed">Reviewed</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#111114] mb-1.5">Father Profile ID <span className="text-gray-400 font-normal">(optional)</span></label>
                <input
                  type="text"
                  value={form.father_profile_id}
                  onChange={(e) => setForm((f) => ({ ...f, father_profile_id: e.target.value }))}
                  placeholder="UUID of father profile"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#152A4A] font-mono"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#111114] mb-1.5">Program ID <span className="text-gray-400 font-normal">(optional)</span></label>
                <input
                  type="text"
                  value={form.program_id}
                  onChange={(e) => setForm((f) => ({ ...f, program_id: e.target.value }))}
                  placeholder="UUID of program"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#152A4A] font-mono"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#111114] mb-1.5">
                  <FileText size={13} className="inline mr-1" />Research Notes
                </label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                  rows={4}
                  placeholder="Session context, key themes, follow-up items..."
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#152A4A] resize-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="flex-1 flex items-center justify-center gap-2 bg-[#C8963E] hover:bg-[#b3832c] text-white font-semibold px-4 py-2.5 rounded-lg text-sm transition disabled:opacity-60">
                  {saving ? <Loader2 size={15} className="animate-spin" /> : null}
                  {saving ? "Saving…" : editing ? "Save Changes" : "Create Interview"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
