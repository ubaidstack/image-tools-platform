import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/container";
import { SectionHeader } from "@/components/section-header";
import { ToolCard } from "@/components/tool-card";
import { tools } from "@/config/tools";

/** Grid of the most popular tools. */
export function PopularTools() {
  return (
    <section id="popular-tools" className="bg-white">
      <Container className="py-20 sm:py-28">
        <SectionHeader
          eyebrow="Popular tools"
          title="Most-used image tools"
          description="Start with the tools our users reach for every day — compression, resizing, cropping and format conversion."
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {tools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link
            href="/all-tools"
            className="inline-flex items-center gap-2 rounded-full border border-gray-900/10 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm shadow-gray-900/5 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/30 hover:text-accent hover:shadow-md"
          >
            View all tools
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
