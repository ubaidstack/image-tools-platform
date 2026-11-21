"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, Sparkles, X } from "lucide-react";
import { LogoMark } from "@/components/brand/logo-mark";
import { navLinks, siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/** Top navigation bar with responsive mobile menu. */
export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActiveLink = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-900/5 bg-white/75 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:h-18 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-2.5"
          aria-label={`${siteConfig.name} — home`}
        >
          <LogoMark
            idPrefix="header"
            className="size-9 shrink-0 transition-transform duration-300 group-hover:-rotate-6"
          />
          <span className="flex flex-col">
            <span className="text-base font-semibold tracking-tight text-ink">
              {siteConfig.name}
            </span>
            <span className="mt-0.5 hidden text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400 sm:block">
              Image tools
            </span>
          </span>
        </Link>

        {/* Desktop navigation */}
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-0.5 rounded-full border border-gray-900/5 bg-gray-50/80 p-1 lg:flex"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActiveLink(link.href) ? "page" : undefined}
              className={cn(
                "rounded-full px-3.5 py-2 text-sm font-medium transition-all duration-200",
                isActiveLink(link.href)
                  ? "bg-white text-ink shadow-sm shadow-gray-900/5"
                  : "text-gray-600 hover:bg-white/70 hover:text-ink"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Primary action + mobile menu toggle */}
        <div className="flex items-center gap-2">
          <Link
            href="/tools/image-compressor"
            className="hidden items-center gap-2 rounded-full bg-gradient-to-r from-accent to-violet px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-accent/25 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-accent/30 sm:inline-flex"
          >
            <Sparkles className="size-4" aria-hidden="true" />
            Compress now
          </Link>

          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-full border border-gray-900/5 bg-white text-gray-700 shadow-sm transition-colors hover:bg-gray-50 lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? (
              <X className="size-5" aria-hidden="true" />
            ) : (
              <Menu className="size-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile navigation panel */}
      {menuOpen ? (
        <nav
          id="mobile-menu"
          aria-label="Mobile navigation"
          className="border-t border-gray-900/5 bg-white/95 backdrop-blur-xl lg:hidden"
        >
          <ul className="mx-auto w-full max-w-6xl space-y-1 px-4 py-4 sm:px-6">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isActiveLink(link.href) ? "page" : undefined}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "block rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors",
                    isActiveLink(link.href)
                      ? "bg-accent-soft text-accent"
                      : "text-gray-600 hover:bg-gray-50 hover:text-ink"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <Link
                href="/tools/image-compressor"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent to-violet px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-accent/25"
              >
                <Sparkles className="size-4" aria-hidden="true" />
                Compress now
              </Link>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
