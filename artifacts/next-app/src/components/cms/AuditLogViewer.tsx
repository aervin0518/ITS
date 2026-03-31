"use client";

import { useState, useEffect, useCallback } from "react";
import { Shield, RefreshCw, ChevronLeft, ChevronRight, Filter } from "lucide-react";

interface AuditLog {
  id: string;
  user_id: string | null;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  details_json: Record<string, unknown> | null;
  created_at: string;
}

const ACTION_COLORS: Record<string, string> = {
  login: "bg-green-100 text-green-800",
  logout: "bg-gray-100 text-gray-700",
  "user.create": "bg-blue-100 text-blue-800",
  "user.delete": "bg-red-100 text-red-800",
  "user.role_change": "bg-purple-100 text-purple-800",
  "user.status_change": "bg-amber-100 text-amber-800",
  "user.update": "bg-sky-100 text-sky-800",
  "interview.create": "bg-teal-100 text-teal-800",
  "interview.update": "bg-teal-100 text-teal-700",
  "interview.delete": "bg-red-100 text-red-700",
  "transcript.upload": "bg-indigo-100 text-indigo-800",
  "transcript.delete": "bg-red-100 text-red-600",
  "publication.create": "bg-lime-100 text-lime-800",
  "publication.update": "bg-lime-100 text-lime-700",
  "publication.delete": "bg-red-100 text-red-600",
  "father_profile.create": "bg-cyan-100 text-cyan-800",
  "father_profile.update": "bg-cyan-100 text-cyan-700",
  "father_profile.delete": "bg-red-100 text-red-500",
  "media.upload": "bg-violet-100 text-violet-800",
  "media.delete": "bg-red-100 text-red-500",
  "survey.received": "bg-emerald-100 text-emerald-800",
  "assessment.create": "bg-orange-100 text-orange-800",
  export: "bg-yellow-100 text-yellow-800",
};

const ACTION_LABELS: Record<string, string> = {
  login: "Login",
  logout: "Logout",
  "user.create": "User Created",
  "user.delete": "User Deleted",
  "user.role_change": "Role Changed",
  "user.status_change": "Status Changed",
  "user.update": "User Updated",
  "interview.create": "Interview Created",
  "interview.update": "Interview Updated",
  "interview.delete": "Interview Deleted",
  "transcript.upload": "Transcript Uploaded",
  "transcript.delete": "Transcript Deleted",
  "publication.create": "Publication Created",
  "publication.update": "Publication Updated",
  "publication.delete": "Publication Deleted",
  "father_profile.create": "Father Profile Created",
  "father_profile.update": "Father Profile Updated",
  "father_profile.delete": "Father Profile Deleted",
  "media.upload": "Media Uploaded",
  "media.delete": "Media Deleted",
  "survey.received": "Survey Received",
  "assessment.create": "Assessment Added",
  export: "Data Exported",
};

const ALL_ACTIONS = Object.keys(ACTION_LABELS);
const LIMIT = 50;

export default function AuditLogViewer() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [showFilter, setShowFilter] = useState(false);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: String(LIMIT) });
    if (filter) params.set("action", filter);
    const res = await fetch(`/api/audit-logs?${params}`);
    if (res.ok) {
      const data = await res.json();
      setLogs(data.logs ?? []);
      setTotal(data.total ?? 0);
    }
    setLoading(false);
  }, [page, filter]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#111114]">Audit Log</h2>
          <p className="text-sm text-gray-500 mt-0.5">{total.toLocaleString()} event{total !== 1 ? "s" : ""} recorded</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilter((v) => !v)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm border transition-colors ${
              filter ? "bg-[#152A4A] text-white border-[#152A4A]" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
            }`}
          >
            <Filter size={14} />
            {filter ? (ACTION_LABELS[filter] ?? filter) : "All Actions"}
          </button>
          <button onClick={fetchLogs} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-white border border-gray-200 hover:border-gray-300 text-gray-600 transition-colors">
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {showFilter && (
        <div className="mb-4 bg-white border border-gray-100 rounded-xl shadow-sm p-3 flex flex-wrap gap-2">
          <button onClick={() => { setFilter(""); setPage(1); setShowFilter(false); }} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${!filter ? "bg-[#152A4A] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
            All
          </button>
          {ALL_ACTIONS.map((a) => (
            <button key={a} onClick={() => { setFilter(a); setPage(1); setShowFilter(false); }} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filter === a ? "bg-[#152A4A] text-white" : `${ACTION_COLORS[a] ?? "bg-gray-100 text-gray-600"} hover:opacity-80`}`}>
              {ACTION_LABELS[a]}
            </button>
          ))}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20"><RefreshCw size={22} className="animate-spin text-[#152A4A]" /></div>
        ) : logs.length === 0 ? (
          <div className="text-center py-20">
            <Shield size={36} className="mx-auto mb-3 text-gray-200" />
            <p className="text-gray-500 text-sm font-medium">No audit events yet</p>
            <p className="text-gray-400 text-xs mt-1">Events are recorded automatically as users take actions.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actor</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Entity</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Details</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {logs.map((log) => {
                    const details = log.details_json ?? {};
                    const actorEmail = details.actor_email as string | undefined;
                    const detailPairs = Object.entries(details)
                      .filter(([k]) => k !== "actor_email" && k !== "ip_address")
                      .map(([k, v]) => `${k}: ${String(v)}`)
                      .join(" · ");
                    return (
                      <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3.5">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${ACTION_COLORS[log.action] ?? "bg-gray-100 text-gray-600"}`}>
                            {ACTION_LABELS[log.action] ?? log.action}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-gray-600 text-xs">
                          {actorEmail ?? <span className="text-gray-300 italic">system</span>}
                        </td>
                        <td className="px-5 py-3.5 text-gray-500 text-xs">
                          {log.entity_type ? (
                            <span>
                              <span className="font-medium capitalize">{log.entity_type.replace("_", " ")}</span>
                              {log.entity_id && <span className="ml-1 text-gray-400 font-mono">{log.entity_id.slice(0, 8)}…</span>}
                            </span>
                          ) : "—"}
                        </td>
                        <td className="px-5 py-3.5 text-gray-400 text-xs max-w-xs truncate">
                          {detailPairs || "—"}
                        </td>
                        <td className="px-5 py-3.5 text-gray-400 text-xs whitespace-nowrap">
                          {new Date(log.created_at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
                <p className="text-xs text-gray-400">Page {page} of {totalPages}</p>
                <div className="flex items-center gap-1">
                  <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-40 transition-colors"><ChevronLeft size={16} /></button>
                  <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-40 transition-colors"><ChevronRight size={16} /></button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
