import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getToolHref, type Tool } from "@/config/tools";

/** Colourful gradient per tool category keeps the grid lively but coherent. */
const categoryGradients: Record<string, string> = {
  compression: "from-accent to-cyan",
  conversion: "from-violet to-accent",
  resizing: "from-cyan to-accent",
  editing: "from-violet to-cyan",
};

/** Card for a single tool, used on the homepage and the All Tools page. */
export function ToolCard({ tool }: { tool: Tool }) {
  const Icon = tool.icon;
  const gradient = categoryGradients[tool.categoryId] ?? "from-accent to-violet";

  return (
    <Link
      href={getToolHref(tool)}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-900/5 bg-white p-6 shadow-sm shadow-gray-900/5 transition-all duration-300 hover:-translate-y-1 hover:border-accent/20 hover:shadow-xl hover:shadow-accent/10"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white via-white to-accent-soft/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
      <span
        className={`relative mb-4 flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-lg shadow-accent/20 transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105`}
      >
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <h3 className="relative text-base font-semibold text-ink">{tool.name}</h3>
      <p className="relative mt-1.5 text-sm leading-relaxed text-gray-600">
        {tool.description}
      </p>
      <span className="relative mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
        Try now
        <ArrowRight
          className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </span>
    </Link>
  );
}
