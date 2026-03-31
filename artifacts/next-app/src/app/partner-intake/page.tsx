import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Partner Intake | I.T.S. Fatherhood",
  description: "Begin a partnership with I.T.S. Fatherhood — tell us about your organization, goals, and deployment interest.",
};

export default function PartnerIntakePage() {
  return (
    <>
      <section className="bg-navy-500 text-white section-padding">
        <div className="container-narrow">
          <p className="text-xs font-sans font-semibold tracking-[0.3em] uppercase text-blue-300 mb-6">
            Partnership Intake
          </p>
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-6 max-w-3xl">
            Start the partnership process.
          </h1>
          <p className="text-navy-200 font-sans text-lg max-w-xl leading-relaxed">
            Tell us about your organization and deployment goals. We&apos;ll follow up within 3 business days.
          </p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-narrow max-w-2xl">
          <div className="bg-stone-50 border border-stone-200 p-8">
            <p className="font-sans text-stone-600 mb-6 leading-relaxed">
              Our full partner intake form is currently being finalized. In the meantime, please
              contact us directly to begin the conversation — we respond to all partnership
              inquiries within 3 business days.
            </p>
            <Link href="/contact" className="btn-primary">Contact Us to Begin Partnership</Link>
          </div>
          <p className="text-sm font-sans text-stone-400 mt-6">
            Already submitted a form?{" "}
            <Link href="/partners" className="text-navy-500 hover:text-navy-700 transition-colors">
              Return to Partners page →
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
