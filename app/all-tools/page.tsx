import type { Metadata } from "next";
import { Container } from "@/components/container";
import { SectionHeader } from "@/components/section-header";
import { ToolCard } from "@/components/tool-card";
import { tools } from "@/config/tools";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "All Tools",
  description:
    "Browse every free online image tool — compression, conversion, resizing and editing for JPG, PNG and WebP files.",
  path: "/all-tools",
});

export default function AllToolsPage() {
  return (
    <Container className="py-16 sm:py-20">
      <SectionHeader
        as="h1"
        eyebrow="All tools"
        title="Every image tool in one place"
        description="Free browser-based tools for compressing, converting, resizing and editing your images."
      />
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {tools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>
    </Container>
  );
}
