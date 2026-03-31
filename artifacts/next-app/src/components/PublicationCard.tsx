import { Publication } from "@/types";

interface PublicationCardProps {
  publication: Publication;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function getCategoryBadgeClass(category: Publication["category"]): string {
  switch (category) {
    case "Brief":
      return "badge-brief";
    case "Report":
      return "badge-report";
    case "Insight":
      return "badge-insight";
    default:
      return "badge bg-stone-100 text-stone-600";
  }
}

export default function PublicationCard({ publication }: PublicationCardProps) {
  return (
    <article className="bg-white border border-stone-200 rounded-xl p-6 flex flex-col gap-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between gap-3">
        <span className={getCategoryBadgeClass(publication.category)}>
          {publication.category}
        </span>
        <span className="text-xs font-sans text-stone-400">{formatDate(publication.date)}</span>
      </div>

      <h3 className="text-lg font-serif text-stone-900 leading-snug">{publication.title}</h3>

      <p className="text-sm font-sans text-stone-600 leading-relaxed flex-1">
        {publication.abstract.slice(0, 150)}
        {publication.abstract.length > 150 ? "…" : ""}
      </p>

      <div className="flex flex-wrap gap-2">
        {publication.topics.map((topic) => (
          <span
            key={topic}
            className="inline-block px-2 py-0.5 text-xs font-sans bg-stone-100 text-stone-600 rounded"
          >
            {topic}
          </span>
        ))}
      </div>

      <p className="text-xs font-sans text-stone-400 border-t border-stone-100 pt-3">
        {publication.authors.join(", ")}
      </p>
    </article>
  );
}
