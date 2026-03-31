"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  ScrollText, Upload, Trash2, Search, Download, RefreshCw,
  X, Loader2, Plus, CheckCircle, Clock, ChevronDown, Filter,
} from "lucide-react";

interface Transcript {
  id: string;
  source_type: string | null;
  file_url: string | null;
  signed_url: string | null;
  language: string | null;
  processed_flag: boolean;
  interview_id: string | null;
  father_profile_id: string | null;
  raw_text: string | null;
  created_at: string;
}

const SOURCE_OPTIONS = [
  "YouTube Interview", "Zoom Recording", "30-Second Video",
  "Assessment Interview", "Field Recording", "Other",
];

const LANG_OPTIONS = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

const EMPTY_FORM = { source_type: "", language: "en", raw_text: "" };

export default function TranscriptsManager({ userId }: { userId: string }) {
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterReviewed, setFilterReviewed] = useState<"all" | "pending" | "reviewed">("all");
  const [showUpload, setShowUpload] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [uploading, setUploading] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filterReviewed === "pending") params.set("reviewed", "false");
      if (filterReviewed === "reviewed") params.set("reviewed", "true");
      if (search) params.set("q", search);
      const res = await fetch(`/api/transcripts?${params}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setTranscripts(data.transcripts ?? []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [filterReviewed, search]);

  useEffect(() => { load(); }, [load]);

  function handleFileSelect(file: File) {
    setSelectedFile(file);
    setShowUpload(true);
  }

  async function handleUpload() {
    if (!selectedFile && !form.raw_text.trim()) {
      setError("Please select a file or enter transcript text.");
      return;
    }
    setUploading(true);
    setError(null);
    try {
      let storagePath: string | null = null;

      // 1. Upload file to storage if selected
      if (selectedFile) {
        const fd = new FormData();
        fd.append("file", selectedFile);
        fd.append("bucket", "transcripts");
        const uploadRes = await fetch("/api/cms/storage/upload", { method: "POST", body: fd });
        const uploadData = await uploadRes.json();
        if (uploadData.error) throw new Error(uploadData.error);
        storagePath = uploadData.path;
      }

      // 2. Save record to transcripts DB
      const res = await fetch("/api/transcripts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source_type: form.source_type || null,
          language: form.language,
          file_url: storagePath,
          raw_text: form.raw_text.trim() || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to save transcript");

      await load();
      setShowUpload(false);
      setSelectedFile(null);
      setForm(EMPTY_FORM);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setUploading(false);
    }
  }

  async function toggleReviewed(t: Transcript) {
    setTogglingId(t.id);
    try {
      const res = await fetch(`/api/transcripts/${t.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ processed_flag: !t.processed_flag }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Update failed");
      setTranscripts((prev) => prev.map((tr) => tr.id === t.id ? { ...tr, processed_flag: !t.processed_flag } : tr));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setTogglingId(null);
    }
  }

  async function handleDelete(id: string, fileUrl: string | null) {
    setDeletingId(id);
    try {
      // Delete DB record
      const res = await fetch(`/api/transcripts/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Delete failed");

      // Best-effort: delete from storage if there's a file
      if (fileUrl) {
        await fetch(`/api/cms/storage/delete?bucket=transcripts&path=${encodeURIComponent(fileUrl)}`, { method: "DELETE" });
      }

      setTranscripts((prev) => prev.filter((t) => t.id !== id));
      setConfirmDeleteId(null);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setDeletingId(null);
    }
  }

  const pending = transcripts.filter((t) => !t.processed_flag).length;
  const reviewed = transcripts.filter((t) => t.processed_flag).length;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-700">
            <ScrollText size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#111114]">Transcripts</h1>
            <p className="text-sm text-gray-500">Upload and review interview transcripts from all sources.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={load} className="p-2 rounded-lg text-gray-400 hover:text-[#111114] hover:bg-gray-100 transition">
            <RefreshCw size={16} />
          </button>
          <button
            onClick={() => setShowUpload(true)}
            className="flex items-center gap-2 bg-[#152A4A] text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-[#1E3A5F] transition"
          >
            <Plus size={16} /> New Transcript
          </button>
        </div>
      </div>

      {/* Stats pills */}
      <div className="flex gap-3 mb-6">
        <div className="flex items-center gap-1.5 text-sm bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full">
          <Clock size={13} />
          <span className="font-medium">{pending} pending review</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm bg-green-50 text-green-700 px-3 py-1.5 rounded-full">
          <CheckCircle size={13} />
          <span className="font-medium">{reviewed} reviewed</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by source type…"
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#152A4A]"
          />
        </div>
        <div className="relative">
          <Filter size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <select
            value={filterReviewed}
            onChange={(e) => setFilterReviewed(e.target.value as any)}
            className="appearance-none pl-8 pr-8 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#152A4A] bg-white"
          >
            <option value="all">All</option>
            <option value="pending">Pending review</option>
            <option value="reviewed">Reviewed</option>
          </select>
          <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 flex items-center justify-between mb-4">
          <p className="text-red-700 text-sm">{error}</p>
          <button onClick={() => setError(null)}><X size={14} className="text-red-400" /></button>
        </div>
      )}

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-[#111114]">Add Transcript</h2>
              <button onClick={() => { setShowUpload(false); setSelectedFile(null); setForm(EMPTY_FORM); }} className="p-1.5 rounded-lg hover:bg-gray-100 transition">
                <X size={18} className="text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {/* File drop */}
              {!selectedFile ? (
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFileSelect(f); }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition ${dragging ? "border-[#C8963E] bg-amber-50" : "border-gray-200 hover:border-gray-300"}`}
                >
                  <Upload size={22} className="mx-auto mb-2 text-gray-300" />
                  <p className="text-sm text-gray-500 font-medium">Drop file here or click to browse</p>
                  <p className="text-xs text-gray-400 mt-1">PDF, DOCX, TXT — up to 100MB</p>
                  <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx,.txt,.rtf" className="hidden"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileSelect(f); }} />
                </div>
              ) : (
                <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                  <ScrollText size={18} className="text-green-600 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-green-800 truncate">{selectedFile.name}</p>
                    <p className="text-xs text-green-600">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                  </div>
                  <button onClick={() => setSelectedFile(null)} className="text-green-500 hover:text-green-700"><X size={16} /></button>
                </div>
              )}

              {/* Or paste text */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Or paste transcript text</label>
                <textarea
                  value={form.raw_text}
                  onChange={(e) => setForm((f) => ({ ...f, raw_text: e.target.value }))}
                  rows={4}
                  placeholder="Paste raw transcript content here…"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#152A4A] resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Source</label>
                  <select value={form.source_type} onChange={(e) => setForm((f) => ({ ...f, source_type: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#152A4A] bg-white">
                    <option value="">Select…</option>
                    {SOURCE_OPTIONS.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Language</label>
                  <select value={form.language} onChange={(e) => setForm((f) => ({ ...f, language: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#152A4A] bg-white">
                    {LANG_OPTIONS.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
                  </select>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex gap-3 justify-end">
              <button onClick={() => { setShowUpload(false); setSelectedFile(null); setForm(EMPTY_FORM); }}
                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition">Cancel</button>
              <button
                onClick={handleUpload}
                disabled={(!selectedFile && !form.raw_text.trim()) || uploading}
                className="flex items-center gap-2 bg-[#152A4A] text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-[#1E3A5F] transition disabled:opacity-60"
              >
                {uploading ? <><Loader2 size={15} className="animate-spin" /> Saving…</> : <><Upload size={15} /> Add Transcript</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="text-center py-16 text-gray-400">
          <Loader2 size={32} className="mx-auto animate-spin mb-3 text-gray-300" />
          <p className="text-sm">Loading transcripts…</p>
        </div>
      ) : transcripts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
          <ScrollText size={40} className="mx-auto mb-3 text-gray-200" />
          <p className="font-medium text-gray-500">No transcripts found</p>
          <p className="text-sm text-gray-400 mt-1">Upload files or paste text from interviews.</p>
          <button onClick={() => setShowUpload(true)} className="mt-4 bg-[#152A4A] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#1E3A5F] transition">
            + Add First Transcript
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {transcripts.map((t) => (
            <div key={t.id} className={`bg-white rounded-xl border p-5 shadow-sm hover:shadow-md transition ${t.processed_flag ? "border-green-100" : "border-amber-100"}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 min-w-0">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${t.processed_flag ? "bg-green-50" : "bg-amber-50"}`}>
                    {t.processed_flag
                      ? <CheckCircle size={18} className="text-green-600" />
                      : <Clock size={18} className="text-amber-600" />
                    }
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-[#111114]">{t.source_type ?? "Untitled transcript"}</p>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${t.processed_flag ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                        {t.processed_flag ? "Reviewed" : "Pending review"}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 mt-1">
                      <span className="text-xs text-gray-400 uppercase">{t.language ?? "en"}</span>
                      <span className="text-xs text-gray-400">{formatDate(t.created_at)}</span>
                      {t.raw_text && (
                        <span className="text-xs text-gray-400">{t.raw_text.length.toLocaleString()} chars</span>
                      )}
                      {t.file_url && <span className="text-xs text-gray-400">File attached</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {/* Mark reviewed toggle */}
                  <button
                    onClick={() => toggleReviewed(t)}
                    disabled={togglingId === t.id}
                    title={t.processed_flag ? "Mark as pending" : "Mark as reviewed"}
                    className={`p-2 rounded-lg transition text-xs flex items-center gap-1 font-medium ${
                      t.processed_flag
                        ? "text-green-600 hover:bg-green-50"
                        : "text-amber-600 hover:bg-amber-50"
                    }`}
                  >
                    {togglingId === t.id
                      ? <Loader2 size={15} className="animate-spin" />
                      : t.processed_flag ? <CheckCircle size={15} /> : <Clock size={15} />
                    }
                    <span className="hidden sm:inline">{t.processed_flag ? "Reviewed" : "Mark reviewed"}</span>
                  </button>

                  {/* Download */}
                  {t.signed_url && (
                    <a href={t.signed_url} download target="_blank" rel="noreferrer"
                      className="p-2 rounded-lg text-gray-400 hover:text-[#152A4A] hover:bg-gray-100 transition" title="Download">
                      <Download size={15} />
                    </a>
                  )}

                  {/* Delete */}
                  {confirmDeleteId === t.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDelete(t.id, t.file_url)}
                        disabled={deletingId === t.id}
                        className="text-xs font-semibold text-red-600 hover:bg-red-50 px-2 py-1.5 rounded-lg transition flex items-center gap-1"
                      >
                        {deletingId === t.id ? <Loader2 size={12} className="animate-spin" /> : null} Confirm
                      </button>
                      <button onClick={() => setConfirmDeleteId(null)} className="text-xs text-gray-400 hover:bg-gray-50 px-2 py-1.5 rounded-lg transition">Cancel</button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDeleteId(t.id)}
                      className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition"
                      title="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              </div>

              {/* Preview raw text */}
              {t.raw_text && (
                <div className="mt-3 pt-3 border-t border-gray-50">
                  <p className="text-xs text-gray-400 line-clamp-2">{t.raw_text}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-400 mt-4 text-right">{transcripts.length} transcript{transcripts.length !== 1 ? "s" : ""}</p>
    </div>
  );
}
