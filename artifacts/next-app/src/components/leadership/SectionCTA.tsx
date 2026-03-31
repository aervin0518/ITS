import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function SectionCTA() {
  return (
    <div className="bg-stone-900 rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
      <div className="max-w-xl">
        <h3 className="text-2xl md:text-3xl font-serif text-white mb-3">
          Join the Fatherhood Research Movement
        </h3>
        <p className="font-sans text-stone-400 text-sm leading-relaxed">
          We are building a collaborative ecosystem of leaders, researchers, and partners committed
          to strengthening fathers, families, and communities.
        </p>
      </div>
      <div className="flex flex-wrap gap-3 flex-shrink-0">
        <Link
          href="/get-involved"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white text-stone-900 font-sans font-medium text-sm tracking-wide uppercase hover:bg-stone-100 transition-colors duration-200"
        >
          Get Involved
          <ArrowRight size={14} />
        </Link>
        <Link
          href="/partners"
          className="inline-flex items-center gap-2 px-6 py-3 border border-white text-white font-sans font-medium text-sm tracking-wide uppercase hover:bg-white/10 transition-colors duration-200"
        >
          Partner With Us
        </Link>
      </div>
    </div>
  );
}
