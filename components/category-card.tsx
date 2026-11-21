import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getToolCount, type ToolCategory } from "@/config/tools";

/** Card for a tool category, linking into the All Tools overview. */
export function CategoryCard({ category }: { category: ToolCategory }) {
  const Icon = category.icon;
  const toolCount = getToolCount(category.id);

  return (
    <Link
      href="/all-tools"
      className="group flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-md"
    >
      <div className="flex items-center justify-between">
        <span className="flex size-11 items-center justify-center rounded-xl bg-accent-soft text-accent transition-colors group-hover:bg-accent group-hover:text-white">
          <Icon className="size-5" aria-hidden="true" />
        </span>
        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
          {toolCount} {toolCount === 1 ? "tool" : "tools"}
        </span>
      </div>
      <h3 className="mt-4 text-base font-semibold text-gray-900">
        {category.name}
      </h3>
      <p className="mt-1.5 text-sm leading-relaxed text-gray-600">
        {category.description}
      </p>
      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
        View tools
        <ArrowRight
          className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </span>
    </Link>
  );
}
