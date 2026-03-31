"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import PublicationCard from "@/components/PublicationCard";
import { publications } from "@/data/publications";
import { Publication } from "@/types";

const allTopics = Array.from(
  new Set(publications.flatMap((p) => p.topics))
).sort();

const allYears = Array.from(new Set(publications.map((p) => p.year))).sort(
  (a, b) => b - a
);

type Category = "All" | Publication["category"];

export default function PublicationsPage() {
  const [categoryFilter, setCategoryFilter] = useState<Category>("All");
  const [topicFilter, setTopicFilter] = useState<string>("All");
  const [yearFilter, setYearFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filtered = useMemo(() => {
    return publications.filter((pub) => {
      if (categoryFilter !== "All" && pub.category !== categoryFilter) return false;
      if (topicFilter !== "All" && !pub.topics.includes(topicFilter)) return false;
      if (yearFilter !== "All" && pub.year !== Number(yearFilter)) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (!pub.title.toLowerCase().includes(q) && !pub.abstract.toLowerCase().includes(q))
          return false;
      }
      return true;
    });
  }, [categoryFilter, topicFilter, yearFilter, searchQuery]);

  const categories: Category[] = ["All", "Report", "Brief", "Insight", "Article"];

  return (
    <>
      <div className="bg-navy-500 text-white py-16 md:py-24">
        <div className="container-narrow">
          <h1 className="text-5xl md:text-6xl font-serif text-white mb-4">Publications</h1>
          <p className="text-navy-200 font-sans text-lg max-w-2xl">
            Research reports, policy briefs, articles, and community insights from the I.T.S. Fatherhood
            Research Hub — all freely available.
          </p>
        </div>
      </div>

      <section className="py-10 bg-white border-b border-stone-200 sticky top-16 z-40">
        <div className="container-narrow">
          <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Search by title or keyword…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm font-sans border border-stone-200 bg-stone-50 text-stone-800 focus:outline-none focus:border-navy-400 focus:ring-1 focus:ring-navy-400 rounded"
              />
            </div>
            <div className="flex gap-1 flex-shrink-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  aria-pressed={categoryFilter === cat}
                  className={`px-4 py-2 text-xs font-sans font-medium tracking-wide uppercase transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-400 focus-visible:ring-offset-2 ${
                    categoryFilter === cat
                      ? "bg-navy-500 text-white"
                      : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <select
              value={topicFilter}
              onChange={(e) => setTopicFilter(e.target.value)}
              className="border border-stone-200 bg-stone-50 px-3 py-2 text-sm font-sans text-stone-700 focus:outline-none focus:border-navy-400 rounded"
            >
              <option value="All">All Topics</option>
              {allTopics.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="border border-stone-200 bg-stone-50 px-3 py-2 text-sm font-sans text-stone-700 focus:outline-none focus:border-navy-400 rounded"
            >
              <option value="All">All Years</option>
              {allYears.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="section-padding bg-stone-50">
        <div className="container-narrow">
          {filtered.length > 0 ? (
            <>
              <p className="text-sm font-sans text-stone-500 mb-6">
                Showing {filtered.length} of {publications.length} publication
                {publications.length !== 1 ? "s" : ""}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((pub) => (
                  <PublicationCard key={pub.id} publication={pub} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-2xl font-serif text-stone-300 mb-2">No results found</p>
              <p className="font-sans text-sm text-stone-400">
                Try adjusting your filters or search terms.
              </p>
              <button
                onClick={() => {
                  setCategoryFilter("All");
                  setTopicFilter("All");
                  setYearFilter("All");
                  setSearchQuery("");
                }}
                className="mt-6 btn-secondary"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
