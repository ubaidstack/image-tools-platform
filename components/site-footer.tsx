import Link from "next/link";
import { Code2, Mail } from "lucide-react";
import { LogoMark } from "@/components/brand/logo-mark";
import { footerLinkGroups, siteConfig } from "@/config/site";
import { cacheLife } from "next/cache";

/** Cache the copyright year — it only changes when the site is rebuilt. */
async function getCopyrightYear(): Promise<number> {
  "use cache";
  cacheLife("max");
  return new Date().getFullYear();
}

const socialLinks = [
  {
    label: "GitHub repository",
    href: "https://github.com/ubaidstack/image-tools-platform",
    icon: Code2,
  },
  { label: "Contact us", href: "/contact", icon: Mail },
];

/** Global footer with brand column, link groups and copyright. */
export async function SiteFooter() {
  const year = await getCopyrightYear();

  return (
    <footer className="relative overflow-hidden bg-navy text-gray-300">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-72 w-[42rem] max-w-full -translate-x-1/2 rounded-full bg-accent/20 blur-3xl"
      />
      <div className="relative mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand column */}
          <div className="sm:col-span-2 lg:pr-8">
            <Link href="/" className="inline-flex items-center gap-3">
              <LogoMark idPrefix="footer" className="size-10 shrink-0" />
              <span className="text-base font-semibold tracking-tight text-white">
                {siteConfig.name}
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-gray-400">
              {siteConfig.description}
            </p>
            <ul className="mt-6 flex items-center gap-2">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <li key={social.label}>
                    <Link
                      href={social.href}
                      aria-label={social.label}
                      className="inline-flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-300 transition-colors hover:border-white/25 hover:bg-white/10 hover:text-white"
                    >
                      <Icon className="size-4" aria-hidden="true" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Link groups */}
          {footerLinkGroups.map((group) => (
            <nav key={group.heading} aria-label={group.heading}>
              <h2 className="text-xs font-semibold tracking-[0.14em] text-white/60 uppercase">
                {group.heading}
              </h2>
              <ul className="mt-4 space-y-3">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-400">
            © {year} {siteConfig.name}. All rights reserved.
          </p>
          <p className="text-xs text-gray-500">
            Free browser-based image tools — your files stay on your device.
          </p>
        </div>
      </div>
    </footer>
  );
}
