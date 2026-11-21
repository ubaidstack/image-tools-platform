import Image from "next/image";
import Link from "next/link";
import { footerLinkGroups, siteConfig } from "@/config/site";
import { cacheLife } from "next/cache";

/** Cache the copyright year — it only changes when the site is rebuilt. */
async function getCopyrightYear(): Promise<number> {
  "use cache";
  cacheLife("max");
  return new Date().getFullYear();
}

/** Global footer with brand column, link groups and copyright. */
export async function SiteFooter() {
  const year = await getCopyrightYear();

  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand column */}
          <div className="sm:col-span-2 lg:pr-8">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <Image
                src="/fixshrink-icon.png"
                alt=""
                width={256}
                height={256}
                sizes="36px"
                className="size-9 rounded-lg"
              />
              <span className="text-sm font-semibold tracking-tight text-gray-900">
                {siteConfig.name}
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-gray-600">
              {siteConfig.description}
            </p>
          </div>

          {/* Link groups */}
          {footerLinkGroups.map((group) => (
            <nav key={group.heading} aria-label={group.heading}>
              <h2 className="text-sm font-semibold text-gray-900">
                {group.heading}
              </h2>
              <ul className="mt-4 space-y-3">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-600 transition-colors hover:text-accent"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 border-t border-gray-200 pt-6">
          <p className="text-center text-sm text-gray-500">
            © {year} {siteConfig.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
