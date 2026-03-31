import type { Metadata } from "next";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import { programs } from "@/data/programs";

export const metadata: Metadata = {
  title: "Research-Informed Programs",
};

export default function ProgramsPage() {
  return (
    <>
      <div className="bg-navy-500 text-white section-padding">
        <div className="container-narrow">
          <h1 className="text-5xl md:text-6xl font-serif text-white mb-4">
            Research-Informed Programs
          </h1>
          <p className="text-navy-200 font-sans text-lg max-w-2xl">
            Every program we offer is grounded in published findings and refined through
            direct community engagement.
          </p>
        </div>
      </div>

      <section className="section-padding bg-white">
        <div className="container-narrow">
          <div className="max-w-3xl">
            <SectionHeading title="From Research to Practice" className="mb-6" />
            <div className="flex flex-col gap-4 font-sans text-stone-700 leading-relaxed">
              <p>
                At the I.T.S. Fatherhood Research Center, research and programming exist in
                continuous dialogue. Our studies generate findings that shape program design;
                our programs generate community insights that inform future research questions.
                This feedback loop is what distinguishes evidence-based programming from
                well-intentioned programming.
              </p>
              <p>
                Each of our programs is documented, evaluated, and reported — not as a
                marketing exercise, but as a genuine commitment to knowing whether what we do
                works, for whom, and under what conditions. We publish our findings whether
                they confirm our expectations or challenge them.
              </p>
            </div>
          </div>
        </div>
      </section>

      {programs.map((program, index) => (
        <section
          key={program.id}
          className={`section-padding divider ${index % 2 === 0 ? "bg-stone-50" : "bg-white"}`}
        >
          <div className="container-narrow">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div>
                <h2 className="text-3xl md:text-4xl font-serif text-stone-900 mb-2">
                  {program.name}
                </h2>
                <p className="font-sans italic text-stone-500 mb-2">{program.tagline}</p>
                <div className="w-16 h-0.5 bg-navy-500 mb-6" />
                <p className="font-sans text-stone-700 leading-relaxed">{program.description}</p>
              </div>
              <div className="flex flex-col gap-5">
                <div className="bg-white border border-stone-200 rounded-xl p-6">
                  <h3 className="text-xs font-sans font-semibold uppercase tracking-wider text-stone-500 mb-4">
                    Documented Outcomes
                  </h3>
                  <ul className="flex flex-col gap-3">
                    {program.outcomes.map((outcome, i) => (
                      <li key={i} className="flex gap-2 text-sm font-sans text-stone-700">
                        <span className="text-navy-500 font-bold mt-0.5 flex-shrink-0">—</span>
                        <span>{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-navy-50 border border-navy-100 rounded-xl p-5">
                  <h3 className="text-xs font-sans font-semibold uppercase tracking-wider text-navy-600 mb-2">
                    Evidence Summary
                  </h3>
                  <p className="font-sans italic text-sm text-navy-700 leading-relaxed">
                    {program.evidenceSummary}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      <section className="section-padding bg-stone-900">
        <div className="container-narrow text-center">
          <h2 className="text-3xl font-serif text-white mb-4">Participate in a Program</h2>
          <p className="font-sans text-stone-400 mb-8 max-w-xl mx-auto">
            Our programs are open to fathers, co-parents, practitioners, and community organizations.
            Learn how to join or bring programming to your community.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/get-involved" className="btn-primary bg-white text-stone-900 hover:bg-stone-100">
              Get Involved
            </Link>
            <Link href="/contact" className="btn-secondary border-white text-white hover:bg-white/10">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
