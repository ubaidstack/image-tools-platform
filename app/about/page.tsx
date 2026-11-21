import type { Metadata } from "next";
import { Check } from "lucide-react";
import { Container } from "@/components/container";
import { SectionHeader } from "@/components/section-header";
import { siteConfig } from "@/config/site";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "About",
  description: `Learn more about ${siteConfig.name} — a free, privacy-first suite of online image editing tools.`,
  path: "/about",
});

const aboutPoints = [
  "Free core tools with no watermarks",
  "Browser-based processing for privacy and speed",
  "Clean, focused interface with no distractions",
  "Works on desktop, tablet and mobile",
];

export default function AboutPage() {
  return (
    <Container className="py-16 sm:py-20">
      <SectionHeader
        as="h1"
        eyebrow="About"
        title={`About ${siteConfig.name}`}
        description="A focused suite of free online image tools, built to be fast, private and easy to use."
      />
      <div className="mx-auto mt-10 max-w-2xl space-y-4 text-base leading-relaxed text-gray-600">
        <p>
          {siteConfig.name} exists to make everyday image editing simple. Most
          people just need to compress a photo for a website, resize an image
          for a form, or convert a file to a different format — and they
          shouldn&apos;t need heavyweight software or an account to do it.
        </p>
        <p>
          Our approach is privacy-first: the core tools process images
          directly in your browser, so your files never leave your device.
          Everything is free, with no watermarks and no signup.
        </p>
      </div>
      <ul className="mx-auto mt-10 max-w-2xl grid gap-3 sm:grid-cols-2">
        {aboutPoints.map((point) => (
          <li
            key={point}
            className="flex items-center gap-2.5 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 shadow-sm"
          >
            <Check className="size-4 shrink-0 text-accent" aria-hidden="true" />
            {point}
          </li>
        ))}
      </ul>
    </Container>
  );
}
