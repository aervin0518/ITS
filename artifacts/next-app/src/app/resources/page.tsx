import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Resources | I.T.S. Fatherhood",
  description: "Access tools, guides, and platform resources from I.T.S. Fatherhood.",
};

const resourceCategories = [
  { label: "Research Tools", description: "Survey instruments, assessment frameworks, and data collection protocols from the I.T.S. platform.", comingSoon: true },
  { label: "MetaDAD Curriculum", description: "Structured curriculum materials for MetaDAD cohort facilitators.", comingSoon: true },
  { label: "Partner Toolkit", description: "Deployment guides, training materials, and outcome tracking tools for platform partners.", comingSoon: true },
  { label: "Research Hub", description: "Browse all published briefs, reports, articles, and insights from I.T.S. Fatherhood.", href: "/research", comingSoon: false },
];

export default function ResourcesPage() {
  return (
    <>
      <section className="bg-navy-500 text-white section-padding">
        <div className="container-narrow">
          <p className="text-xs font-sans font-semibold tracking-[0.3em] uppercase text-blue-300 mb-6">
            Resources
          </p>
          <h1 className="text-5xl font-serif text-white mb-6 max-w-3xl">
            Platform tools and materials.
          </h1>
          <p className="text-navy-200 font-sans text-lg max-w-2xl leading-relaxed">
            Access research instruments, curriculum guides, partner deployment toolkits, and published intelligence from the platform.
          </p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-narrow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {resourceCategories.map((cat) => (
              <div key={cat.label} className="border border-stone-200 p-7">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h2 className="text-xl font-serif text-stone-900">{cat.label}</h2>
                  {cat.comingSoon && (
                    <span className="text-xs font-sans font-medium text-stone-400 bg-stone-100 border border-stone-200 px-2 py-1 whitespace-nowrap flex-shrink-0">
                      Coming Soon
                    </span>
                  )}
                </div>
                <p className="text-sm font-sans text-stone-500 leading-relaxed mb-4">{cat.description}</p>
                {cat.href && (
                  <Link href={cat.href} className="btn-secondary text-sm">
                    Browse Now
                  </Link>
                )}
              </div>
            ))}
          </div>
          <div className="mt-12 bg-stone-50 border border-stone-200 p-8">
            <h3 className="text-xl font-serif text-stone-900 mb-3">Need early access?</h3>
            <p className="font-sans text-stone-500 text-sm mb-5">
              Platform partners and active collaborators receive early access to all resources.
            </p>
            <Link href="/partners" className="btn-primary">Become a Partner</Link>
          </div>
        </div>
      </section>
    </>
  );
}
