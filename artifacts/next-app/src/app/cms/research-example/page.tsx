import type { Metadata } from "next";
import Link from "next/link";
import ResearchHubContent from "@/components/ResearchHubContent";
import { BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "Research Hub Example — BackOffice | I.T.S. Fatherhood",
  description: "BackOffice view of the Research Hub Example. Restricted to authenticated platform users.",
};

export default function ResearchHubExamplePage() {
  return (
    <>
      {/* BackOffice Banner */}
      <div className="bg-[#152A4A] text-white px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-[#C8963E] p-1.5 rounded-md">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-blue-300 mr-2">BackOffice</span>
            <span className="text-sm font-semibold">Research Hub Example</span>
          </div>
        </div>
        <Link
          href="/cms/dashboard"
          className="text-xs text-blue-300 hover:text-white transition-colors"
        >
          ← Back to Dashboard
        </Link>
      </div>

      <ResearchHubContent />
    </>
  );
}
