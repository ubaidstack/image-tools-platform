import type { ToolSeoContent } from "@/config/tool-seo";
import type { Tool } from "@/config/tools";
import { absoluteUrl, siteConfig } from "@/config/site";
import type { FaqItem } from "@/config/content";

/** Renders a script tag with type="application/ld+json". */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** Generates structured data for an individual image tool. */
export function getToolJsonLd(tool: Tool, seo: ToolSeoContent) {
  const toolUrl = absoluteUrl(`/tools/${tool.slug}`);

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: seo.h1,
    url: toolUrl,
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires HTML5 Canvas and JavaScript",
    description: seo.seoDescription,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: absoluteUrl("/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "All Tools",
        item: absoluteUrl("/all-tools"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: tool.name,
        item: toolUrl,
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: seo.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return {
    webAppSchema,
    breadcrumbSchema,
    faqSchema,
  };
}

/** Generates structured data for the homepage. */
export function getHomeJsonLd(faqs: readonly FaqItem[]) {
  const homeUrl = absoluteUrl("/");

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: homeUrl,
    description: siteConfig.description,
  };

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: homeUrl,
    description: siteConfig.description,
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return {
    websiteSchema,
    orgSchema,
    faqSchema,
  };
}
