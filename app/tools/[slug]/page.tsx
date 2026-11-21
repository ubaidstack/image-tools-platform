import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/container";
import { ImageCompressorTool } from "@/components/tools/image-compressor-tool";
import { ImageResizerTool } from "@/components/tools/image-resizer-tool";
import { ImageCropperTool } from "@/components/tools/image-cropper-tool";
import { JpgToPngTool } from "@/components/tools/jpg-to-png-tool";
import { PngToJpgTool } from "@/components/tools/png-to-jpg-tool";
import { WebpConverterTool } from "@/components/tools/webp-converter-tool";
import { ImageToKbTool } from "@/components/tools/image-to-kb-tool";
import { ImageRotatorTool } from "@/components/tools/image-rotator-tool";
import { ToolSeoSection } from "@/components/tools/tool-seo-section";
import { JsonLd, getToolJsonLd } from "@/components/seo/json-ld";
import { getToolBySlug, tools } from "@/config/tools";
import { toolSeoData } from "@/config/tool-seo";
import { siteConfig } from "@/config/site";
import { createPageMetadata } from "@/lib/metadata";

type ToolPageProps = {
  params: Promise<{ slug: string }>;
};

/** Pre-render a page for every tool defined in the config. */
export function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return {};

  const seo = toolSeoData[slug];

  return createPageMetadata({
    title: seo ? seo.seoTitle : tool.name,
    description: seo
      ? seo.seoDescription
      : `${tool.description} Free and fully browser-based on ${siteConfig.name}.`,
    path: `/tools/${tool.slug}`,
    keywords: [
      tool.name,
      `${tool.name.toLowerCase()} online`,
      "free image tool",
      "browser image processing",
      "no upload image tool",
    ],
  });
}

/** Tool slug → client component. Every entry processes images locally. */
const toolComponents: Record<string, React.ComponentType> = {
  "image-compressor": ImageCompressorTool,
  "image-resizer": ImageResizerTool,
  "image-cropper": ImageCropperTool,
  "jpg-to-png": JpgToPngTool,
  "png-to-jpg": PngToJpgTool,
  "webp-converter": WebpConverterTool,
  "image-to-kb": ImageToKbTool,
  "image-rotator": ImageRotatorTool,
};

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  const ToolComponent = tool ? toolComponents[tool.slug] : undefined;
  if (!tool || !ToolComponent) notFound();

  const seo = toolSeoData[tool.slug];
  const Icon = tool.icon;
  const schemas = seo ? getToolJsonLd(tool, seo) : null;

  return (
    <Container className="py-10 sm:py-14">
      {schemas ? (
        <>
          <JsonLd data={schemas.webAppSchema} />
          <JsonLd data={schemas.breadcrumbSchema} />
          <JsonLd data={schemas.faqSchema} />
        </>
      ) : null}

      {/* Tool header */}
      <div className="mx-auto mb-8 max-w-3xl text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-accent-soft text-accent">
          <Icon className="size-6" aria-hidden="true" />
        </span>
        <h1 className="mt-5 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
          {seo ? seo.h1 : tool.name}
        </h1>
        <p className="mt-3 text-base leading-relaxed text-gray-600">
          {tool.description}
        </p>
        <p className="mt-3 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-1.5 text-xs font-medium text-gray-500">
          Processes locally in your browser — your image never leaves your device
        </p>
      </div>

      {/* Shared workspace with tool-specific controls */}
      <div className="mx-auto max-w-4xl">
        <ToolComponent />
      </div>

      {/* Unique Tool SEO Content Section */}
      {seo ? <ToolSeoSection content={seo} tool={tool} /> : null}
    </Container>
  );
}
