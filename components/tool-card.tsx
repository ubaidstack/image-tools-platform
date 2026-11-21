import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getToolHref, type Tool } from "@/config/tools";

/** Card for a single tool, used on the homepage and the All Tools page. */
export function ToolCard({ tool }: { tool: Tool }) {
  const Icon = tool.icon;

  return (
    <Link
      href={getToolHref(tool)}
      className="group flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-md"
    >
      <span className="mb-4 flex size-11 items-center justify-center rounded-xl bg-accent-soft text-accent transition-colors group-hover:bg-accent group-hover:text-white">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <h3 className="text-base font-semibold text-gray-900">{tool.name}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-gray-600">
        {tool.description}
      </p>
      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
        Try now
        <ArrowRight
          className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </span>
    </Link>
  );
}
