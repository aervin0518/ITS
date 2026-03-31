import Link from "next/link";

interface CtaButton {
  label: string;
  href: string;
  external?: boolean;
}

interface HeroProps {
  headline: string;
  subhead: string;
  primaryCta: CtaButton;
  secondaryCta?: CtaButton;
}

export default function Hero({ headline, subhead, primaryCta, secondaryCta }: HeroProps) {
  return (
    <section className="bg-stone-900 text-white section-padding">
      <div className="container-narrow">
        <div className="max-w-4xl">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif leading-tight mb-6 text-white">
            {headline}
          </h1>
          <p className="text-stone-300 font-sans text-lg md:text-xl leading-relaxed mb-10 max-w-2xl">
            {subhead}
          </p>
          <div className="flex flex-wrap gap-4">
            {primaryCta.external ? (
              <a
                href={primaryCta.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-white text-stone-900 font-sans font-medium text-sm tracking-wide uppercase hover:bg-stone-100 transition-colors duration-200"
              >
                {primaryCta.label}
              </a>
            ) : (
              <Link
                href={primaryCta.href}
                className="inline-flex items-center px-6 py-3 bg-white text-stone-900 font-sans font-medium text-sm tracking-wide uppercase hover:bg-stone-100 transition-colors duration-200"
              >
                {primaryCta.label}
              </Link>
            )}
            {secondaryCta && (
              secondaryCta.external ? (
                <a
                  href={secondaryCta.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 border border-white text-white font-sans font-medium text-sm tracking-wide uppercase hover:bg-white/10 transition-colors duration-200"
                >
                  {secondaryCta.label}
                </a>
              ) : (
                <Link
                  href={secondaryCta.href}
                  className="inline-flex items-center px-6 py-3 border border-white text-white font-sans font-medium text-sm tracking-wide uppercase hover:bg-white/10 transition-colors duration-200"
                >
                  {secondaryCta.label}
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
