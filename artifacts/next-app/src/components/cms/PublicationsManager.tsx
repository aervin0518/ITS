"use client";

import { useState, useEffect, useCallback } from "react";
import {
  BookOpen, Plus, X, CheckCircle, AlertCircle, Loader2,
  Trash2, Pencil, ExternalLink,
} from "lucide-react";

interface Publication {
  id: string;
  title: string;
  publication_type: string | null;
  slug: string | null;
  abstract: string | null;
  status: string;
  author_json: unknown;
  published_at: string;
}

type PubStatus = "draft" | "published" | "archived";
type PubType = "report" | "brief" | "research" | "policy" | "blog";

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-gray-100 text-gray-600",
  published: "bg-green-100 text-green-800",
  archived: "bg-amber-100 text-amber-700",
};

const TYPE_COLORS: Record<string, string> = {
  report: "bg-blue-100 text-blue-700",
  brief: "bg-purple-100 text-purple-700",
  research: "bg-teal-100 text-teal-700",
  policy: "bg-orange-100 text-orange-700",
  blog: "bg-pink-100 text-pink-700",
};

interface Toast { type: "success" | "error"; message: string; }

const EMPTY_FORM = {
  title: "",
  publication_type: "report" as PubType,
  slug: "",
  abstract: "",
  status: "draft" as PubStatus,
  author_json: "",
  body_markdown: "",
};

export default function PublicationsManager() {
  const [pubs, setPubs] = useState<Publication[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterType, setFilterType] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Publication | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchPubs = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filterStatus) params.set("status", filterStatus);
    if (filterType) params.set("publication_type", filterType);
    const res = await fetch(`/api/publications?${params}`);
    if (res.ok) {
      const d = await res.json();
      setPubs(d.publications ?? []);
      setTotal(d.total ?? 0);
    }
    setLoading(false);
  }, [filterStatus, filterType]);

  useEffect(() => { fetchPubs(); }, [fetchPubs]);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (pub: Publication) => {
    setEditing(pub);
    setForm({
      title: pub.title,
      publication_type: (pub.publication_type as PubType) ?? "report",
      slug: pub.slug ?? "",
      abstract: pub.abstract ?? "",
      status: pub.status as PubStatus,
      author_json: pub.author_json ? JSON.stringify(pub.author_json, null, 2) : "",
      body_markdown: "",
    });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) { showToast("error", "Title is required"); return; }
    setSaving(true);

    let author_json = null;
    if (form.author_json.trim()) {
      try { author_json = JSON.parse(form.author_json); } catch { showToast("error", "Author JSON is not valid JSON"); setSaving(false); return; }
    }

    const body = {
      title: form.title.trim(),
      publication_type: form.publication_type,
      slug: form.slug.trim() || null,
      abstract: form.abstract.trim() || null,
      status: form.status,
      author_json,
      body_markdown: form.body_markdown.trim() || null,
    };

    const res = editing
      ? await fetch(`/api/publications/${editing.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
      : await fetch("/api/publications", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });

    const data = await res.json();
    if (res.ok) {
      showToast("success", editing ? "Publication updated" : "Publication created");
      setShowModal(false);
      fetchPubs();
    } else {
      showToast("error", data.error ?? "Save failed");
    }
    setSaving(false);
  };

  const handleDelete = async (pub: Publication) => {
    if (!confirm(`Delete "${pub.title}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/publications/${pub.id}`, { method: "DELETE" });
    if (res.ok) {
      showToast("success", "Publication deleted");
      setPubs((prev) => prev.filter((p) => p.id !== pub.id));
      setTotal((t) => t - 1);
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
          <h2 className="text-xl font-bold text-[#111114]">Publications</h2>
          <p className="text-sm text-gray-500 mt-0.5">{total} publication{total !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-[#C8963E] hover:bg-[#b3832c] text-white font-semibold px-4 py-2.5 rounded-lg transition-colors text-sm">
          <Plus size={16} />New Publication
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        {["", "draft", "published", "archived"].map((s) => (
          <button key={s} onClick={() => setFilterStatus(s)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filterStatus === s ? "bg-[#152A4A] text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"}`}>
            {s === "" ? "All Status" : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
        <span className="w-px bg-gray-200 mx-1" />
        {["", "report", "brief", "research", "policy", "blog"].map((t) => (
          <button key={t} onClick={() => setFilterType(t)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filterType === t ? "bg-[#152A4A] text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"}`}>
            {t === "" ? "All Types" : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 size={22} className="animate-spin text-[#152A4A]" /></div>
        ) : pubs.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen size={36} className="mx-auto mb-3 text-gray-200" />
            <p className="text-gray-500 text-sm font-medium">No publications yet</p>
            <button onClick={openCreate} className="mt-3 text-[#152A4A] text-sm font-medium hover:underline">Create your first publication →</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Slug</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {pubs.map((pub) => (
                  <tr key={pub.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-[#111114] line-clamp-1">{pub.title}</p>
                      {pub.abstract && <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{pub.abstract}</p>}
                    </td>
                    <td className="px-5 py-3.5">
                      {pub.publication_type && (
                        <span className={`inline-block px-2 py-0.5 rounded-md text-xs font-medium capitalize ${TYPE_COLORS[pub.publication_type] ?? "bg-gray-100 text-gray-600"}`}>
                          {pub.publication_type}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_COLORS[pub.status] ?? "bg-gray-100 text-gray-600"}`}>
                        {pub.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-400 text-xs font-mono">{pub.slug ?? "—"}</td>
                    <td className="px-5 py-3.5 text-gray-400 text-xs whitespace-nowrap">
                      {new Date(pub.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {pub.slug && pub.status === "published" && (
                          <a href={`/research/${pub.slug}`} target="_blank" className="p-1.5 rounded-lg text-gray-400 hover:text-[#152A4A] hover:bg-[#152A4A]/8 transition-colors" title="View">
                            <ExternalLink size={14} />
                          </a>
                        )}
                        <button onClick={() => openEdit(pub)} className="p-1.5 rounded-lg text-gray-400 hover:text-[#152A4A] hover:bg-[#152A4A]/8 transition-colors" title="Edit">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => handleDelete(pub)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors" title="Delete">
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
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
              <div>
                <h3 className="font-bold text-[#111114]">{editing ? "Edit Publication" : "New Publication"}</h3>
                <p className="text-xs text-gray-500 mt-0.5">Reports, briefs, research, policy, and blog posts</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 p-1"><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#111114] mb-1.5">Title *</label>
                <input type="text" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Publication title" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#152A4A]" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-[#111114] mb-1.5">Type</label>
                  <select value={form.publication_type} onChange={(e) => setForm((f) => ({ ...f, publication_type: e.target.value as PubType }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#152A4A] bg-white">
                    <option value="report">Report</option>
                    <option value="brief">Brief</option>
                    <option value="research">Research</option>
                    <option value="policy">Policy</option>
                    <option value="blog">Blog</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#111114] mb-1.5">Status</label>
                  <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as PubStatus }))} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#152A4A] bg-white">
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#111114] mb-1.5">Slug <span className="text-gray-400 font-normal">(URL path)</span></label>
                <input type="text" value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") }))} placeholder="my-publication-slug" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#152A4A] font-mono" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#111114] mb-1.5">Abstract</label>
                <textarea value={form.abstract} onChange={(e) => setForm((f) => ({ ...f, abstract: e.target.value }))} rows={3} placeholder="Brief description of the publication..." className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#152A4A] resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#111114] mb-1.5">Author(s) <span className="text-gray-400 font-normal">(JSON)</span></label>
                <textarea value={form.author_json} onChange={(e) => setForm((f) => ({ ...f, author_json: e.target.value }))} rows={2} placeholder='{"name": "Dr. Jane Smith", "title": "Research Director"}' className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#152A4A] resize-none font-mono text-xs" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 flex items-center justify-center gap-2 bg-[#C8963E] hover:bg-[#b3832c] text-white font-semibold px-4 py-2.5 rounded-lg text-sm transition disabled:opacity-60">
                  {saving ? <Loader2 size={15} className="animate-spin" /> : null}
                  {saving ? "Saving…" : editing ? "Save Changes" : "Create Publication"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
