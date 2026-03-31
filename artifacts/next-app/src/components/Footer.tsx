import Link from "next/link";
import Image from "next/image";
import { Twitter, Linkedin, Facebook, Youtube } from "lucide-react";
import NewsletterForm from "./NewsletterForm";

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300">
      <div className="container-wide py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="flex flex-col gap-4">
            <div>
              <Link href="/" className="flex items-center gap-2.5 group">
                <Image
                  src="/logo-dark.png"
                  alt="I.T.S. Fatherhood"
                  width={44}
                  height={34}
                  className="flex-shrink-0"
                />
                <div className="flex flex-col leading-none">
                  <span className="text-base font-serif font-bold text-white group-hover:text-stone-200 transition-colors tracking-wide">
                    I.T.S. Fatherhood
                  </span>
                  <span className="text-[8px] font-sans tracking-[0.3em] uppercase text-stone-500 mt-0.5">
                    Research Hub
                  </span>
                </div>
              </Link>
            </div>
            <p className="text-sm font-sans text-stone-400 leading-relaxed">
              Advancing rigorous, community-informed research on fatherhood and family engagement
              across diverse populations.
            </p>
            <div className="flex gap-3 mt-2">
              <a
                href="#"
                className="text-stone-500 hover:text-white transition-colors"
                aria-label="Twitter/X"
              >
                <Twitter size={18} />
              </a>
              <a
                href="#"
                className="text-stone-500 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="#"
                className="text-stone-500 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href="#"
                className="text-stone-500 hover:text-white transition-colors"
                aria-label="YouTube"
              >
                <Youtube size={18} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-sans font-semibold uppercase tracking-wider text-stone-400 mb-4">
              Quick Links
            </h3>
            <ul className="flex flex-col gap-2.5">
              {[
                { href: "/", label: "Home" },
                { href: "/about", label: "About" },
                { href: "/research", label: "Research" },
                { href: "/publications", label: "Publications" },
                { href: "/data-surveys", label: "Data & Surveys" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-sans text-stone-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-sans font-semibold uppercase tracking-wider text-stone-400 mb-4">
              Programs & Engagement
            </h3>
            <ul className="flex flex-col gap-2.5">
              {[
                { href: "/programs", label: "Programs" },
                { href: "/partners", label: "Partners" },
                { href: "/news-events", label: "News & Events" },
                { href: "/get-involved", label: "Get Involved" },
                { href: "/donate", label: "Donate" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-sans text-stone-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-sans font-semibold uppercase tracking-wider text-stone-400 mb-4">
              Stay Connected
            </h3>
            <div className="flex flex-col gap-2 text-sm font-sans text-stone-400 mb-6">
              <p>
                <a
                  href="mailto:info@itsfatherhood.org"
                  className="hover:text-white transition-colors"
                >
                  info@itsfatherhood.org
                </a>
              </p>
              <p className="text-stone-500">[Phone — Coming Soon]</p>
              <p className="text-stone-500">[Office Address — Coming Soon]</p>
            </div>
            <div>
              <h4 className="text-xs font-sans font-semibold uppercase tracking-wider text-stone-400 mb-3">
                Newsletter
              </h4>
              <NewsletterForm variant="dark" />
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-stone-800">
        <div className="container-wide py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs font-sans text-stone-500">
            © 2025 I.T.S. Fatherhood Research Hub. All rights reserved.
          </p>
          <div className="flex gap-5">
            {["Privacy Policy", "Terms of Use", "Research Ethics"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-xs font-sans text-stone-500 hover:text-stone-300 transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
