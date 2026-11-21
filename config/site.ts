/**
 * Central site/brand configuration.
 *
 * The brand name has not been finalized — to rebrand the site later,
 * change `name`, `shortName` and `tagline` here. Every component reads
 * from this file, so no other code needs to change.
 */
export const siteConfig = {
  /** Temporary brand name shown in the logo, metadata and footer. */
  name: "IMAGE TOOL PLATFORM",
  /** Compact brand name for tight layouts (e.g. very small screens). */
  shortName: "ITP",
  tagline: "Free online image editing tools",
  description:
    "Edit, convert, compress and resize images online — free, fast and right in your browser. No signup required.",
  /**
   * Production origin. Set NEXT_PUBLIC_SITE_URL when deploying; the
   * example.com fallback is a clearly marked placeholder, not a real
   * domain. It is used for canonical URLs, sitemap and robots.txt.
   */
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com").replace(
    /\/$/,
    ""
  ),
  /** Formats advertised across the homepage and FAQ. */
  formats: ["JPG", "PNG", "WEBP"],
} as const;

/** Build an absolute URL for metadata, sitemap and robots entries. */
export function absoluteUrl(path = "/"): string {
  return new URL(path, `${siteConfig.url}/`).toString();
}

export type NavLink = {
  label: string;
  href: string;
};

export const navLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "All Tools", href: "/all-tools" },
  { label: "WebP Converter", href: "/tools/webp-converter" },
  { label: "Image Compressor", href: "/tools/image-compressor" },
  { label: "About", href: "/about" },
];

export type FooterLinkGroup = {
  heading: string;
  links: NavLink[];
};

export const footerLinkGroups: FooterLinkGroup[] = [
  {
    heading: "Product",
    links: [
      { label: "All Tools", href: "/all-tools" },
      { label: "WebP Converter", href: "/tools/webp-converter" },
      { label: "Image Compressor", href: "/tools/image-compressor" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms of Service", href: "/terms-of-service" },
    ],
  },
];
