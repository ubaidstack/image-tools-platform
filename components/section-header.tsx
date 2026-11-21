import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  align?: "center" | "left";
  /** Use "h1" when this block is the page's main heading. */
  as?: "h1" | "h2";
};

/** Consistent heading block for each page and homepage section. */
export function SectionHeader({
  eyebrow,
  title,
  description,
  className,
  align = "center",
  as: Heading = "h2",
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow ? (
        <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-gray-900/5 bg-white px-3 py-1 text-xs font-semibold tracking-[0.14em] text-accent uppercase shadow-xs">
          <span
            aria-hidden="true"
            className="size-1.5 rounded-full bg-gradient-to-r from-accent to-violet"
          />
          {eyebrow}
        </p>
      ) : null}
      <Heading className="text-3xl font-semibold tracking-tight text-ink text-balance sm:text-4xl">
        {title}
      </Heading>
      {description ? (
        <p className="mt-4 text-base leading-relaxed text-gray-600 text-pretty sm:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}
