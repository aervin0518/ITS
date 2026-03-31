"use client";

import { useState, useEffect, useCallback } from "react";
import { Tag, Plus, Pencil, Trash2, X, Loader2, Search, Check, ChevronDown } from "lucide-react";

interface TagItem {
  id: string;
  name: string;
  tag_group: string | null;
}

const TAG_GROUPS = [
  "Research Theme", "Population", "Program Type", "Geography",
  "Outcome", "Methodology", "Content Type", "Other",
];

const GROUP_COLORS: Record<string, string> = {
  "Research Theme": "bg-purple-100 text-purple-700",
  "Population": "bg-blue-100 text-blue-700",
  "Program Type": "bg-teal-100 text-teal-700",
  "Geography": "bg-green-100 text-green-700",
  "Outcome": "bg-amber-100 text-amber-700",
  "Methodology": "bg-orange-100 text-orange-700",
  "Content Type": "bg-pink-100 text-pink-700",
  "Other": "bg-gray-100 text-gray-600",
};

const EMPTY = { name: "", tag_group: "" };

export default function TagsManager() {
  const [tags, setTags] = useState<TagItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterGroup, setFilterGroup] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<TagItem | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (search) params.set("q", search);
      if (filterGroup !== "all") params.set("tag_group", filterGroup);
      const res = await fetch(`/api/tags?${params}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setTags(data.tags ?? []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [search, filterGroup]);

  useEffect(() => { load(); }, [load]);

  function openCreate() {
    setEditing(null);
    setForm(EMPTY);
    setShowForm(true);
  }

  function openEdit(t: TagItem) {
    setEditing(t);
    setForm({ name: t.name, tag_group: t.tag_group ?? "" });
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
      const url = editing ? `/api/tags/${editing.id}` : "/api/tags";
      const method = editing ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name.trim(), tag_group: form.tag_group || null }),
      });
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
      const res = await fetch(`/api/tags/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Delete failed");
      setTags((prev) => prev.filter((t) => t.id !== id));
      setConfirmDeleteId(null);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setDeletingId(null);
    }
  }

  // Group tags by tag_group
  const grouped = tags.reduce<Record<string, TagItem[]>>((acc, t) => {
    const g = t.tag_group ?? "Ungrouped";
    if (!acc[g]) acc[g] = [];
    acc[g].push(t);
    return acc;
  }, {});

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-pink-700">
            <Tag size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#111114]">Tags</h1>
            <p className="text-sm text-gray-500">Manage research tags used to classify transcripts, profiles, and publications.</p>
          </div>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-[#152A4A] text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-[#1E3A5F] transition"
        >
          <Plus size={16} /> New Tag
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tags…"
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#152A4A]"
          />
        </div>
        <div className="relative">
          <select
            value={filterGroup}
            onChange={(e) => setFilterGroup(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#152A4A] bg-white"
          >
            <option value="all">All groups</option>
            {TAG_GROUPS.map((g) => <option key={g} value={g}>{g}</option>)}
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

      {/* Tag groups */}
      {loading ? (
        <div className="text-center py-16 text-gray-400">
          <Loader2 size={32} className="mx-auto animate-spin mb-3 text-gray-300" />
          <p className="text-sm">Loading tags…</p>
        </div>
      ) : tags.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
          <Tag size={40} className="mx-auto mb-3 text-gray-200" />
          <p className="font-medium text-gray-500">{search ? "No tags match your search" : "No tags yet"}</p>
          <p className="text-sm text-gray-400 mt-1">Create tags to classify research content by theme, population, and method.</p>
          <button onClick={openCreate} className="mt-4 bg-[#152A4A] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#1E3A5F] transition">
            + New Tag
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([group, groupTags]) => (
            <div key={group}>
              <div className="flex items-center gap-2 mb-3">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400">{group}</h2>
                <span className="text-xs text-gray-300">{groupTags.length}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {groupTags.map((t) => (
                  <div
                    key={t.id}
                    className={`flex items-center gap-2 pl-3 pr-1 py-1.5 rounded-full text-sm font-medium ${GROUP_COLORS[t.tag_group ?? ""] ?? "bg-gray-100 text-gray-600"}`}
                  >
                    <span>{t.name}</span>
                    <div className="flex items-center gap-0.5">
                      <button
                        onClick={() => openEdit(t)}
                        className="p-1 rounded-full hover:bg-black/10 transition"
                        title="Edit"
                      >
                        <Pencil size={11} />
                      </button>
                      {confirmDeleteId === t.id ? (
                        <>
                          <button
                            onClick={() => handleDelete(t.id)}
                            disabled={deletingId === t.id}
                            className="p-1 rounded-full hover:bg-black/10 transition"
                            title="Confirm delete"
                          >
                            {deletingId === t.id ? <Loader2 size={11} className="animate-spin" /> : <Check size={11} />}
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            className="p-1 rounded-full hover:bg-black/10 transition"
                          >
                            <X size={11} />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => setConfirmDeleteId(t.id)}
                          className="p-1 rounded-full hover:bg-black/10 transition"
                          title="Delete"
                        >
                          <Trash2 size={11} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-400 mt-6 text-right">{tags.length} tag{tags.length !== 1 ? "s" : ""} total</p>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-[#111114]">{editing ? "Edit Tag" : "New Tag"}</h2>
              <button onClick={closeForm} className="p-1.5 rounded-lg hover:bg-gray-100 transition">
                <X size={18} className="text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Tag Name <span className="text-red-400">*</span></label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Justice Involved, Reentry, Chicago"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#152A4A]"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Tag Group</label>
                <select
                  value={form.tag_group}
                  onChange={(e) => setForm((f) => ({ ...f, tag_group: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#152A4A] bg-white"
                >
                  <option value="">No group</option>
                  {TAG_GROUPS.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>

              {/* Preview */}
              {form.name.trim() && (
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Preview</label>
                  <span className={`inline-block px-3 py-1.5 rounded-full text-sm font-medium ${GROUP_COLORS[form.tag_group] ?? "bg-gray-100 text-gray-600"}`}>
                    {form.name.trim()}
                  </span>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex gap-3 justify-end">
              <button onClick={closeForm} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition">Cancel</button>
              <button
                onClick={handleSave}
                disabled={!form.name.trim() || saving}
                className="flex items-center gap-2 bg-[#152A4A] text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-[#1E3A5F] transition disabled:opacity-60"
              >
                {saving ? <><Loader2 size={15} className="animate-spin" /> Saving…</> : <><Check size={15} /> {editing ? "Save Changes" : "Create Tag"}</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
