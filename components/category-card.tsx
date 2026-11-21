import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getToolCount, type ToolCategory } from "@/config/tools";

/** Colourful gradient per category, matching the tool cards. */
const categoryGradients: Record<string, string> = {
  compression: "from-accent to-cyan",
  conversion: "from-violet to-accent",
  resizing: "from-cyan to-accent",
  editing: "from-violet to-cyan",
};

/** Card for a tool category, linking into the All Tools overview. */
export function CategoryCard({ category }: { category: ToolCategory }) {
  const Icon = category.icon;
  const toolCount = getToolCount(category.id);
  const gradient = categoryGradients[category.id] ?? "from-accent to-violet";

  return (
    <Link
      href="/all-tools"
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-900/5 bg-white p-6 shadow-sm shadow-gray-900/5 transition-all duration-300 hover:-translate-y-1 hover:border-accent/20 hover:shadow-xl hover:shadow-accent/10"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white via-white to-accent-soft/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
      <div className="relative flex items-center justify-between">
        <span
          className={`flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-lg shadow-accent/20 transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105`}
        >
          <Icon className="size-5" aria-hidden="true" />
        </span>
        <span className="rounded-full border border-gray-900/5 bg-surface px-2.5 py-1 text-xs font-semibold text-gray-600 transition-colors group-hover:bg-white">
          {toolCount} {toolCount === 1 ? "tool" : "tools"}
        </span>
      </div>
      <h3 className="relative mt-4 text-base font-semibold text-ink">
        {category.name}
      </h3>
      <p className="relative mt-1.5 text-sm leading-relaxed text-gray-600">
        {category.description}
      </p>
      <span className="relative mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
        View tools
        <ArrowRight
          className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </span>
    </Link>
  );
}
