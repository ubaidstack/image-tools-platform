import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/container";
import { SectionHeader } from "@/components/section-header";
import { ToolCard } from "@/components/tool-card";
import { tools } from "@/config/tools";

/** Grid of the most popular tools. */
export function PopularTools() {
  return (
    <section id="popular-tools" className="bg-gray-50">
      <Container className="py-16 sm:py-20">
        <SectionHeader
          eyebrow="Popular tools"
          title="Most-used image tools"
          description="Start with the tools our users reach for every day — compression, resizing, cropping and format conversion."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {tools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            href="/all-tools"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:border-accent/30 hover:text-accent"
          >
            View all tools
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
