import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import NewsletterForm from "@/components/NewsletterForm";

export const metadata: Metadata = {
  title: "Get Involved | I.T.S. Fatherhood",
  description:
    "Find your role in the I.T.S. Fatherhood platform ecosystem — whether you're a father, volunteer, partner, researcher, or funder.",
};

const JOTFORM_URL = "https://form.jotform.com/253554464301049";

const pathways = [
  {
    id: "father",
    audience: "I'm a Father",
    headline: "Activate your impact.",
    description:
      "Take the Fatherhood Impact Survey to establish your baseline — then explore joining a MetaDAD cohort in your community. Your engagement generates data that improves fatherhood outcomes for every father in the platform.",
    cta: { label: "Take the Survey", href: JOTFORM_URL, external: true },
    secondary: { label: "Learn About MetaDAD", href: "/metadad" },
  },
  {
    id: "volunteer",
    audience: "I Want to Volunteer",
    headline: "Support the platform infrastructure.",
    description:
      "We partner with graduate students, practitioners, and community members who bring skills in research, data, facilitation, outreach, or program coordination. Volunteering with I.T.S. means contributing directly to a living impact intelligence system.",
    cta: { label: "Inquire About Volunteering", href: "/contact", external: false },
    secondary: null,
  },
  {
    id: "partner",
    audience: "I Represent an Organization",
    headline: "Deploy the platform in your community.",
    description:
      "Whether you lead a church, school, nonprofit, or civic organization — the I.T.S. platform has a deployment model for you. Access the MetaDAD curriculum, data infrastructure, training, and outcome tracking.",
    cta: { label: "Explore Partnership", href: "/partners", external: false },
    secondary: { label: "Complete Partner Intake", href: "/partner-intake" },
  },
  {
    id: "researcher",
    audience: "I'm a Researcher",
    headline: "Access the platform dataset.",
    description:
      "The I.T.S. platform is building the most comprehensive community-based fatherhood dataset in development. Collaborate on study design, co-author publications, and access anonymized longitudinal data through a research partnership.",
    cta: { label: "Explore Research Collaboration", href: "/contact", external: false },
    secondary: { label: "View the Research Hub", href: "/research" },
  },
  {
    id: "donor",
    audience: "I Want to Fund This Work",
    headline: "Invest in the infrastructure.",
    description:
      "Your investment funds data systems, MetaDAD cohort deployments, platform intelligence publishing, and ecosystem expansion — building the longitudinal evidence base that makes fatherhood investment defensible.",
    cta: { label: "See Investment Opportunities", href: "/donate", external: false },
    secondary: { label: "Contact Us for Major Gifts", href: "/contact" },
  },
];

export default function GetInvolvedPage() {
  return (
    <>
      {/* HERO */}
      <section className="bg-navy-500 text-white section-padding">
        <div className="container-narrow">
          <p className="text-xs font-sans font-semibold tracking-[0.3em] uppercase text-blue-300 mb-6">
            Get Involved
          </p>
          <h1 className="text-5xl md:text-6xl font-serif text-white leading-tight mb-6 max-w-4xl">
            Find your role in the fatherhood ecosystem.
          </h1>
          <p className="text-navy-200 font-sans text-lg max-w-2xl leading-relaxed">
            Every stakeholder in the I.T.S. platform has a path forward — from individual
            fathers to major funders. Choose yours below.
          </p>
        </div>
      </section>

      {/* PATHWAYS */}
      <section className="section-padding bg-white">
        <div className="container-narrow">
          <div className="flex flex-col gap-6">
            {pathways.map((pathway, i) => (
              <div
                key={pathway.id}
                className={`border border-stone-200 p-8 flex flex-col md:flex-row gap-8 items-start ${i % 2 === 1 ? "bg-stone-50" : "bg-white"}`}
              >
                <div className="md:w-48 flex-shrink-0">
                  <span className="text-xs font-sans font-semibold tracking-[0.25em] uppercase text-navy-500">
                    {pathway.audience}
                  </span>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-serif text-stone-900 mb-3">{pathway.headline}</h2>
                  <p className="font-sans text-stone-600 leading-relaxed mb-6 max-w-2xl">{pathway.description}</p>
                  <div className="flex flex-wrap gap-3">
                    {pathway.cta.external ? (
                      <a
                        href={pathway.cta.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary"
                      >
                        {pathway.cta.label} <ArrowRight size={14} />
                      </a>
                    ) : (
                      <Link href={pathway.cta.href} className="btn-primary">
                        {pathway.cta.label} <ArrowRight size={14} />
                      </Link>
                    )}
                    {pathway.secondary && (
                      <Link href={pathway.secondary.href} className="btn-secondary">
                        {pathway.secondary.label}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section id="newsletter" className="section-padding bg-stone-50 border-t border-stone-200">
        <div className="container-narrow">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-serif text-stone-900 mb-4">Stay connected with the platform.</h2>
            <p className="font-sans text-stone-500 mb-8">
              Receive new insights, cohort announcements, and platform intelligence directly in your inbox.
            </p>
            <NewsletterForm />
          </div>
        </div>
      </section>
    </>
  );
}
