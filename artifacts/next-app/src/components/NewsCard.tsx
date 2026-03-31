import { NewsPost } from "@/types";

interface NewsCardProps {
  post: NewsPost;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export default function NewsCard({ post }: NewsCardProps) {
  return (
    <article className="bg-white border border-stone-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="aspect-video bg-stone-200 w-full flex items-center justify-center">
        <span className="text-stone-400 font-sans text-xs uppercase tracking-wider">
          {post.imageAlt}
        </span>
      </div>
      <div className="p-5 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <span className="badge bg-navy-50 text-navy-600">{post.category}</span>
          <span className="text-xs font-sans text-stone-400">{formatDate(post.date)}</span>
        </div>
        <h3 className="text-base font-serif text-stone-900 leading-snug">{post.title}</h3>
        <p className="text-sm font-sans text-stone-600 leading-relaxed">{post.excerpt}</p>
      </div>
    </article>
  );
}
