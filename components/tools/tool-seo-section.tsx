import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Download,
  FileType,
  HelpCircle,
  Info,
  ShieldCheck,
  Sparkles,
  Upload,
} from "lucide-react";
import type { ToolSeoContent } from "@/config/tool-seo";
import { getToolBySlug, type Tool } from "@/config/tools";
import { ToolCard } from "@/components/tool-card";

type ToolSeoSectionProps = {
  content: ToolSeoContent;
  tool: Tool;
};

export function ToolSeoSection({ content, tool }: ToolSeoSectionProps) {
  const relatedTools = content.relatedSlugs
    .map((slug) => getToolBySlug(slug))
    .filter((t): t is Tool => t !== undefined);

  return (
    <article className="mt-16 border-t border-gray-900/5 pt-16 sm:mt-24">
      {/* Overview & Instructions Guide */}
      <div className="mx-auto max-w-4xl space-y-14">
        {/* About & In-depth Introduction */}
        <section aria-labelledby="about-tool-heading" className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-accent uppercase">
            <Info className="size-4" aria-hidden="true" />
            Comprehensive Guide
          </div>
          <h2
            id="about-tool-heading"
            className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl"
          >
            About {tool.name}
          </h2>
          <p className="text-base leading-relaxed text-gray-700">
            {content.intro}
          </p>
        </section>

        {/* How to upload, adjust and download */}
        <section
          aria-labelledby="usage-guide-heading"
          className="rounded-2xl border border-gray-900/5 bg-surface p-6 sm:p-8"
        >
          <h3
            id="usage-guide-heading"
            className="text-xl font-bold text-gray-900"
          >
            How to Use {tool.name}
          </h3>
          <p className="mt-1 text-sm text-gray-600">
            Follow these straightforward steps to process and download your images:
          </p>

          <div className="mt-6 grid gap-6 md:grid-cols-3">
            <div className="flex flex-col gap-2 rounded-2xl border border-gray-900/5 bg-white p-5 shadow-sm shadow-gray-900/5">
              <span className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-violet text-white shadow-md shadow-accent/20">
                <Upload className="size-5" aria-hidden="true" />
              </span>
              <h4 className="font-semibold text-gray-900">1. Upload Image</h4>
              <p className="text-sm leading-relaxed text-gray-600">
                {content.uploadInstructions.upload}
              </p>
            </div>

            <div className="flex flex-col gap-2 rounded-2xl border border-gray-900/5 bg-white p-5 shadow-sm shadow-gray-900/5">
              <span className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-violet text-white shadow-md shadow-accent/20">
                <Sparkles className="size-5" aria-hidden="true" />
              </span>
              <h4 className="font-semibold text-gray-900">2. Adjust Settings</h4>
              <p className="text-sm leading-relaxed text-gray-600">
                {content.uploadInstructions.adjust}
              </p>
            </div>

            <div className="flex flex-col gap-2 rounded-2xl border border-gray-900/5 bg-white p-5 shadow-sm shadow-gray-900/5">
              <span className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-violet text-white shadow-md shadow-accent/20">
                <Download className="size-5" aria-hidden="true" />
              </span>
              <h4 className="font-semibold text-gray-900">3. Save &amp; Download</h4>
              <p className="text-sm leading-relaxed text-gray-600">
                {content.uploadInstructions.download}
              </p>
            </div>
          </div>
        </section>

        {/* Step-by-Step Instructions */}
        <section aria-labelledby="steps-heading" className="space-y-6">
          <h3 id="steps-heading" className="text-xl font-bold text-gray-900">
            Step-by-Step Instructions
          </h3>
          <ol className="grid gap-4 sm:grid-cols-2">
            {content.steps.map((step) => (
              <li
                key={step.step}
                className="flex items-start gap-4 rounded-2xl border border-gray-900/5 bg-white p-5 shadow-sm shadow-gray-900/5"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent to-violet font-semibold text-sm text-white shadow-sm shadow-accent/30">
                  {step.step}
                </span>
                <div>
                  <h4 className="text-base font-semibold text-gray-900">
                    {step.title}
                  </h4>
                  <p className="mt-1 text-sm leading-relaxed text-gray-600">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Supported Formats */}
        <section
          aria-labelledby="formats-heading"
          className="rounded-2xl border border-gray-900/5 bg-white p-6 shadow-sm shadow-gray-900/5 sm:p-8"
        >
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-accent uppercase">
            <FileType className="size-4" aria-hidden="true" />
            Compatibility
          </div>
          <h3 id="formats-heading" className="mt-2 text-xl font-bold text-gray-900">
            Supported Formats
          </h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-surface p-4">
              <span className="text-xs font-medium text-gray-500 uppercase">Input Formats</span>
              <p className="mt-1 font-semibold text-gray-900">
                {content.supportedFormats.input.join(", ")}
              </p>
            </div>
            <div className="rounded-xl bg-surface p-4">
              <span className="text-xs font-medium text-gray-500 uppercase">Output Formats</span>
              <p className="mt-1 font-semibold text-gray-900">
                {content.supportedFormats.output.join(", ")}
              </p>
            </div>
          </div>
          <p className="mt-3 text-sm text-gray-600 italic">
            {content.supportedFormats.note}
          </p>
        </section>

        {/* Benefits & Limitations */}
        <section aria-labelledby="benefits-heading" className="space-y-6">
          <h3 id="benefits-heading" className="text-xl font-bold text-gray-900">
            Key Benefits &amp; Technical Limitations
          </h3>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Benefits */}
            <div className="rounded-2xl border border-green-200 bg-green-50/40 p-6">
              <h4 className="flex items-center gap-2 font-semibold text-green-900">
                <CheckCircle2 className="size-5 text-green-600" aria-hidden="true" />
                Benefits &amp; Advantages
              </h4>
              <ul className="mt-4 space-y-3">
                {content.benefits.map((benefit) => (
                  <li key={benefit.title} className="text-sm">
                    <strong className="font-semibold text-gray-900">
                      {benefit.title}:
                    </strong>{" "}
                    <span className="text-gray-700">{benefit.description}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Limitations */}
            <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-6">
              <h4 className="flex items-center gap-2 font-semibold text-amber-900">
                <ShieldCheck className="size-5 text-amber-600" aria-hidden="true" />
                Limitations &amp; Browser Considerations
              </h4>
              <ul className="mt-4 space-y-3">
                {content.limitations.map((limit) => (
                  <li key={limit.title} className="text-sm">
                    <strong className="font-semibold text-gray-900">
                      {limit.title}:
                    </strong>{" "}
                    <span className="text-gray-700">{limit.description}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Frequently Asked Questions */}
        <section aria-labelledby="tool-faq-heading" className="space-y-6">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-accent uppercase">
            <HelpCircle className="size-4" aria-hidden="true" />
            Questions &amp; Answers
          </div>
          <h3 id="tool-faq-heading" className="text-2xl font-bold text-gray-900">
            Frequently Asked Questions
          </h3>

          <div className="space-y-3">
            {content.faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-2xl border border-gray-900/5 bg-white shadow-xs transition-all open:border-accent/25 open:shadow-lg open:shadow-accent/5"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-4 p-5 font-semibold text-gray-900 transition-colors select-none hover:text-accent list-none [&::-webkit-details-marker]:hidden">
                  <span>{faq.question}</span>
                  <ChevronDown
                    className="size-5 shrink-0 text-gray-400 transition-transform duration-200 group-open:rotate-180 group-open:text-accent"
                    aria-hidden="true"
                  />
                </summary>
                <div className="border-t border-gray-900/5 px-5 pt-3 pb-5 text-sm leading-relaxed text-gray-600">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* Related Tools */}
        {relatedTools.length > 0 ? (
          <section aria-labelledby="related-tools-heading" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 id="related-tools-heading" className="text-xl font-bold text-gray-900">
                Related Image Tools
              </h3>
              <Link
                href="/all-tools"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
              >
                Explore all tools
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {relatedTools.map((relTool) => (
                <ToolCard key={relTool.slug} tool={relTool} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </article>
  );
}
