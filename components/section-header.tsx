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
        <p className="mb-2 text-sm font-semibold tracking-wide text-accent uppercase">
          {eyebrow}
        </p>
      ) : null}
      <Heading className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
        {title}
      </Heading>
      {description ? (
        <p className="mt-3 text-base leading-relaxed text-gray-600 sm:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}
