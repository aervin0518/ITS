import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Fatherhood Impact Survey | I.T.S. Fatherhood",
  description: "Take the Fatherhood Impact Survey — the first step in joining the I.T.S. platform and contributing to longitudinal fatherhood research.",
};

export default function SurveyPage() {
  return (
    <>
      <section className="bg-navy-500 text-white section-padding">
        <div className="container-narrow">
          <p className="text-xs font-sans font-semibold tracking-[0.3em] uppercase text-blue-300 mb-6">
            Take the Survey
          </p>
          <h1 className="text-5xl font-serif text-white mb-6 max-w-3xl">
            The Fatherhood Impact Survey
          </h1>
          <p className="text-navy-200 font-sans text-lg max-w-2xl leading-relaxed">
            Your answers establish a baseline that makes outcome measurement possible — for you,
            and for every father in the platform.
          </p>
        </div>
      </section>
      <section className="section-padding bg-white">
        <div className="container-narrow max-w-2xl">
          <div className="bg-stone-50 border border-stone-200 p-8 mb-8">
            <h2 className="text-2xl font-serif text-stone-900 mb-4">What to expect</h2>
            <ul className="flex flex-col gap-3 font-sans text-sm text-stone-600">
              {[
                "Takes approximately 10–15 minutes to complete",
                "Covers father engagement, family stability, and wellbeing indicators",
                "Responses are anonymous and contribute to the platform dataset",
                "You may be invited to join a MetaDAD cohort based on your responses",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-navy-400 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <Link
            href="https://form.jotform.com/253554464301049"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-base px-8 py-4"
          >
            Launch the Survey
          </Link>
          <p className="mt-4 text-xs font-sans text-stone-400">
            Opens in a new tab. Your data is handled in accordance with our research ethics policy.
          </p>
        </div>
      </section>
    </>
  );
}
