import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Partners | I.T.S. Fatherhood Platform Ecosystem",
  description:
    "Partner with I.T.S. Fatherhood to deploy the platform model in your community, school, church, or organization — and join a data-connected ecosystem built for measurable impact.",
};

const partnerTypes = [
  {
    type: "Faith Communities",
    icon: "✦",
    description: "Deploy MetaDAD cohorts within your congregation. We provide the infrastructure, curriculum, and data protocols — you provide the community.",
    gain: "Turn your fatherhood ministry into a measurable outcome system.",
  },
  {
    type: "Schools & Districts",
    icon: "✦",
    description: "Activate father engagement in your school community with a structured, outcome-tracked model that connects father involvement to student data.",
    gain: "Generate evidence that links father engagement to student outcomes.",
  },
  {
    type: "Community Organizations",
    icon: "✦",
    description: "Upgrade your existing fatherhood programming with the I.T.S. platform model — adding data infrastructure, mentor training, and outcome tracking.",
    gain: "Transform activity-based programming into longitudinal impact evidence.",
  },
  {
    type: "Researchers & Universities",
    icon: "✦",
    description: "Access the platform's growing longitudinal dataset for collaborative research. Co-design studies, analyze anonymized outcome data, co-publish findings.",
    gain: "Partner in the most comprehensive community-based fatherhood dataset being built.",
  },
  {
    type: "Funders & Philanthropists",
    icon: "✦",
    description: "Invest in infrastructure that makes your fatherhood portfolio measurable. Access aggregate outcome data, cross-site comparisons, and defensible impact evidence.",
    gain: "Know what's working — with data that holds up to scrutiny.",
  },
  {
    type: "Civic & Government Partners",
    icon: "✦",
    description: "Embed the I.T.S. platform into publicly-funded fatherhood initiatives to generate the longitudinal data that policy needs — but rarely gets.",
    gain: "Build the evidence base for fatherhood policy that actually moves the needle.",
  },
];

const deploymentModels = [
  {
    model: "Cohort Deployment",
    description: "Run MetaDAD cohorts within your site. Receive training, curriculum, intake protocols, and outcome tracking tools.",
    ideal: "Churches, schools, community orgs",
  },
  {
    model: "Research Collaboration",
    description: "Co-design studies using the platform's data infrastructure. Access aggregated, anonymized longitudinal datasets.",
    ideal: "Universities, research institutions",
  },
  {
    model: "Funder Intelligence Partnership",
    description: "Receive aggregate outcome reports and cross-site comparisons for your fatherhood investment portfolio.",
    ideal: "Foundations, philanthropists, government funders",
  },
  {
    model: "Platform Licensing",
    description: "License the full I.T.S. model for regional deployment — including data systems, curriculum, and training infrastructure.",
    ideal: "Regional nonprofits, government agencies",
  },
];

const whatPartnersGain = [
  "Access to the MetaDAD cohort curriculum and training",
  "Data collection infrastructure and outcome tracking tools",
  "Comparative outcome reports across all platform sites",
  "Published research that validates your local impact",
  "Ecosystem network connections with peer organizations",
  "Co-branded intelligence briefs and funder-ready reports",
];

export default function PartnersPage() {
  return (
    <>
      {/* HERO */}
      <section className="bg-navy-500 text-white section-padding">
        <div className="container-narrow">
          <p className="text-xs font-sans font-semibold tracking-[0.3em] uppercase text-blue-300 mb-6">
            Ecosystem Partnerships
          </p>
          <h1 className="text-5xl md:text-6xl font-serif text-white leading-tight mb-6 max-w-4xl">
            Deploy the platform in your community.
          </h1>
          <p className="text-navy-200 font-sans text-lg max-w-2xl leading-relaxed">
            The I.T.S. platform grows stronger with every partner site. Each new deployment
            adds data, extends reach, and strengthens the collective intelligence of the ecosystem.
          </p>
        </div>
      </section>

      {/* WHY PARTNER */}
      <section className="section-padding bg-white">
        <div className="container-narrow">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            <div>
              <h2 className="text-4xl font-serif text-stone-900 mb-6">Why Partner</h2>
              <div className="flex flex-col gap-5 font-sans text-stone-600 leading-relaxed">
                <p>
                  The I.T.S. platform is designed for ecosystem deployment. No single
                  organization has the reach, data, or resources to solve fatherhood absence
                  alone — but a connected network of partners, operating with shared protocols
                  and shared data, can.
                </p>
                <p>
                  Partnership gives you access to infrastructure that most organizations spend
                  years trying to build on their own: a structured intervention model, a
                  longitudinal data system, published outcome evidence, and a community of
                  peer organizations doing the same work.
                </p>
              </div>
            </div>
            <div className="bg-stone-50 border border-stone-200 p-8">
              <h3 className="text-lg font-serif text-stone-900 mb-6">What Partners Gain</h3>
              <ul className="flex flex-col gap-4">
                {whatPartnersGain.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm font-sans text-stone-700">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-navy-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* PARTNER TYPES */}
      <section className="section-padding bg-stone-50 border-t border-stone-200">
        <div className="container-narrow">
          <p className="text-xs font-sans font-semibold tracking-[0.3em] uppercase text-navy-500 mb-4">
            Who We Partner With
          </p>
          <h2 className="text-4xl font-serif text-stone-900 mb-12 max-w-3xl">
            Collaboration across the fatherhood ecosystem.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {partnerTypes.map((partner) => (
              <div key={partner.type} className="bg-white border border-stone-200 p-7 hover:border-navy-300 hover:shadow-sm transition-all">
                <h3 className="text-xl font-serif text-stone-900 mb-3">{partner.type}</h3>
                <p className="text-sm font-sans text-stone-500 leading-relaxed mb-4">{partner.description}</p>
                <p className="text-sm font-sans text-navy-600 font-medium italic">{partner.gain}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DEPLOYMENT MODELS */}
      <section className="section-padding bg-stone-900">
        <div className="container-narrow">
          <p className="text-xs font-sans font-semibold tracking-[0.3em] uppercase text-blue-400 mb-4">
            Deployment Models
          </p>
          <h2 className="text-4xl font-serif text-white mb-14 max-w-3xl">
            Multiple ways to engage the platform.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {deploymentModels.map((model) => (
              <div key={model.model} className="bg-stone-800 border border-stone-700 p-7">
                <h3 className="text-xl font-serif text-white mb-3">{model.model}</h3>
                <p className="text-sm font-sans text-stone-300 leading-relaxed mb-4">{model.description}</p>
                <p className="text-xs font-sans text-stone-500 uppercase tracking-wide">Ideal for: {model.ideal}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PARTNER INQUIRY */}
      <section className="section-padding bg-white border-t border-stone-200">
        <div className="container-narrow">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-serif text-stone-900 mb-4">Start a partnership conversation.</h2>
            <p className="font-sans text-stone-500 mb-10">
              Tell us about your organization and goals. We&apos;ll help you identify the right deployment model.
            </p>
          </div>
          <div className="max-w-2xl mx-auto">
            <div className="bg-stone-50 border border-stone-200 p-8">
              <p className="font-sans text-sm text-stone-600 mb-6">
                Complete the partner intake form to begin the conversation. We respond to all inquiries within 3 business days.
              </p>
              <Link href="/partner-intake" className="btn-primary">
                Complete Partner Intake Form <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
