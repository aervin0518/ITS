import { ResearchArea } from "@/types";
import Link from "next/link";

interface TopicTagProps {
  area: ResearchArea;
}

export default function TopicTag({ area }: TopicTagProps) {
  return (
    <Link
      href={`/research#${area.slug}`}
      className="block border border-stone-200 rounded-xl p-6 bg-white hover:border-navy-400 hover:shadow-sm transition-all duration-200 group"
    >
      <h3 className="text-base font-serif text-stone-900 mb-2 group-hover:text-navy-600 transition-colors duration-200">
        {area.title}
      </h3>
      <p className="text-sm font-sans text-stone-500 leading-relaxed">{area.description}</p>
    </Link>
  );
}
