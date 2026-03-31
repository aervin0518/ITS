"use client";

import { useState, useEffect, useCallback } from "react";
import { BookOpen, Search, ExternalLink, Calendar, User, ChevronDown, Loader2, FileText } from "lucide-react";

interface Publication {
  id: string;
  title: string;
  publication_type: string | null;
  slug: string | null;
  abstract: string | null;
  status: string;
  author_json: any;
  published_at: string | null;
}

const TYPE_COLORS: Record<string, string> = {
  "Research Brief": "bg-blue-50 text-blue-700 border-blue-100",
  "Report": "bg-purple-50 text-purple-700 border-purple-100",
  "Case Study": "bg-teal-50 text-teal-700 border-teal-100",
  "Policy Brief": "bg-amber-50 text-amber-700 border-amber-100",
  "Newsletter": "bg-green-50 text-green-700 border-green-100",
  "Op-Ed": "bg-pink-50 text-pink-700 border-pink-100",
  "White Paper": "bg-indigo-50 text-indigo-700 border-indigo-100",
};

const TYPE_OPTIONS = [
  "Research Brief", "Report", "Case Study", "Policy Brief",
  "Newsletter", "Op-Ed", "White Paper",
];

export default function SubscriberContent() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [page, setPage] = useState(1);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(page) });
      if (filterType !== "all") params.set("publication_type", filterType);
      const res = await fetch(`/api/publications?${params}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      const pubs: Publication[] = data.publications ?? [];
      const filtered = search.trim()
        ? pubs.filter(p =>
            p.title?.toLowerCase().includes(search.toLowerCase()) ||
            p.abstract?.toLowerCase().includes(search.toLowerCase())
          )
        : pubs;
      setPublications(filtered);
      setTotal(data.total ?? 0);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [page, filterType, search]);

  useEffect(() => { load(); }, [load]);

  function getAuthors(author_json: any): string {
    if (!author_json) return "";
    if (typeof author_json === "string") return author_json;
    if (Array.isArray(author_json)) return author_json.map((a: any) => a.name ?? a).join(", ");
    if (author_json.name) return author_json.name;
    return "";
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700">
            <BookOpen size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#111114]">Published Content</h1>
            <p className="text-sm text-gray-500">Research briefs, reports, and publications from I.T.S. Fatherhood.</p>
          </div>
        </div>
        <span className="text-xs bg-green-50 text-green-700 border border-green-100 px-3 py-1.5 rounded-full font-medium">
          {total} published
        </span>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by title or keyword…"
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#152A4A]"
          />
        </div>
        <div className="relative">
          <select
            value={filterType}
            onChange={e => { setFilterType(e.target.value); setPage(1); }}
            className="appearance-none pl-3 pr-8 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#152A4A] bg-white"
          >
            <option value="all">All types</option>
            {TYPE_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="text-center py-20">
          <Loader2 size={32} className="mx-auto animate-spin text-gray-300 mb-3" />
          <p className="text-sm text-gray-400">Loading publications…</p>
        </div>
      ) : publications.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <BookOpen size={44} className="mx-auto mb-3 text-gray-200" />
          <p className="font-medium text-gray-500">
            {search ? "No publications match your search" : "No published content yet"}
          </p>
          <p className="text-sm text-gray-400 mt-1">Check back soon — new research is added regularly.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {publications.map(pub => {
            const authors = getAuthors(pub.author_json);
            const typeStyle = TYPE_COLORS[pub.publication_type ?? ""] ?? "bg-gray-50 text-gray-600 border-gray-100";
            return (
              <div key={pub.id} className="bg-white rounded-2xl border border-gray-100 p-6 hover:border-[#C8963E]/40 hover:shadow-sm transition group">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      {pub.publication_type && (
                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${typeStyle}`}>
                          {pub.publication_type}
                        </span>
                      )}
                    </div>
                    <h2 className="text-base font-bold text-[#111114] group-hover:text-[#152A4A] transition leading-snug mb-2">
                      {pub.title}
                    </h2>
                    {pub.abstract && (
                      <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed mb-3">
                        {pub.abstract}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
                      {authors && (
                        <span className="flex items-center gap-1">
                          <User size={11} /> {authors}
                        </span>
                      )}
                      {pub.published_at && (
                        <span className="flex items-center gap-1">
                          <Calendar size={11} />
                          {new Date(pub.published_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="shrink-0">
                    {pub.slug ? (
                      <a
                        href={`/publications/${pub.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs font-semibold text-[#152A4A] bg-[#152A4A]/5 hover:bg-[#152A4A]/10 px-3 py-2 rounded-lg transition"
                      >
                        Read <ExternalLink size={11} />
                      </a>
                    ) : (
                      <div className="flex items-center gap-1.5 text-xs text-gray-300 bg-gray-50 px-3 py-2 rounded-lg">
                        <FileText size={11} /> No link
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {total > 50 && (
        <div className="flex items-center justify-center gap-3 mt-8">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 transition"
          >
            Previous
          </button>
          <span className="text-sm text-gray-500">Page {page}</span>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={publications.length < 50}
            className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 transition"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
