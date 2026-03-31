import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import ContactForm from "@/components/ContactForm";
import { Mail, MapPin, Phone } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us",
};

export default function ContactPage() {
  return (
    <>
      <div className="bg-navy-500 text-white section-padding">
        <div className="container-narrow">
          <h1 className="text-5xl md:text-6xl font-serif text-white mb-4">Contact Us</h1>
          <p className="text-navy-200 font-sans text-lg max-w-2xl">
            We welcome inquiries from researchers, practitioners, policymakers, journalists, and
            community members.
          </p>
        </div>
      </div>

      <section className="section-padding bg-white">
        <div className="container-narrow">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <SectionHeading title="Send a Message" className="mb-8" />
              <ContactForm />
            </div>

            <div className="flex flex-col gap-8">
              <div>
                <h3 className="text-lg font-serif text-stone-900 mb-4">Contact Information</h3>
                <div className="flex flex-col gap-4">
                  <div className="flex gap-3">
                    <Mail size={16} className="text-navy-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-sans font-semibold uppercase tracking-wider text-stone-400 mb-0.5">
                        Email
                      </p>
                      <a
                        href="mailto:info@itsfatherhood.org"
                        className="text-sm font-sans text-navy-500 hover:text-navy-700 transition-colors"
                      >
                        info@itsfatherhood.org
                      </a>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Phone size={16} className="text-stone-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-sans font-semibold uppercase tracking-wider text-stone-400 mb-0.5">
                        Phone
                      </p>
                      <p className="text-sm font-sans text-stone-500">[Coming Soon]</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <MapPin size={16} className="text-stone-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-sans font-semibold uppercase tracking-wider text-stone-400 mb-0.5">
                        Office
                      </p>
                      <p className="text-sm font-sans text-stone-500">[Address — Coming Soon]</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-navy-50 border border-navy-100 rounded-xl p-6">
                <h3 className="font-serif text-stone-900 mb-2">Request a Research Briefing</h3>
                <p className="font-sans text-sm text-stone-600 leading-relaxed mb-4">
                  Policymakers, foundation officers, and organizational leaders may request a
                  private briefing on our published findings and their implications for programs
                  and policy.
                </p>
                <a
                  href="mailto:info@itsfatherhood.org?subject=Research Briefing Request"
                  className="btn-primary"
                >
                  Request a Briefing
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
