import type { Metadata } from "next";
import { FaqSection } from "@/components/home/faq-section";
import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { PopularTools } from "@/components/home/popular-tools";
import { PrivacySection } from "@/components/home/privacy-section";
import { ToolCategories } from "@/components/home/tool-categories";
import { JsonLd, getHomeJsonLd } from "@/components/seo/json-ld";
import { faqItems } from "@/config/content";
import { siteConfig } from "@/config/site";

const homeTitle = `${siteConfig.name} — Free Online Image Editing Tools`;

export const metadata: Metadata = {
  title: { absolute: homeTitle },
  description: siteConfig.description,
  alternates: { canonical: "/" },
  openGraph: {
    title: homeTitle,
    description: siteConfig.description,
    url: "/",
    siteName: siteConfig.name,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: homeTitle,
    description: siteConfig.description,
  },
};

export default function HomePage() {
  const homeSchemas = getHomeJsonLd(faqItems);

  return (
    <>
      <JsonLd data={homeSchemas.websiteSchema} />
      <JsonLd data={homeSchemas.orgSchema} />
      <JsonLd data={homeSchemas.faqSchema} />

      <Hero />
      <PopularTools />
      <ToolCategories />
      <HowItWorks />
      <PrivacySection />
      <FaqSection />
    </>
  );
}
