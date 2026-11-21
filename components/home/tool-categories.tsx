import { Container } from "@/components/container";
import { CategoryCard } from "@/components/category-card";
import { SectionHeader } from "@/components/section-header";
import { toolCategories } from "@/config/tools";

/** Overview of the tool categories. */
export function ToolCategories() {
  return (
    <section id="tool-categories" className="border-y border-gray-900/5 bg-surface">
      <Container className="py-20 sm:py-28">
        <SectionHeader
          eyebrow="Categories"
          title="Browse tools by category"
          description="Whatever you need to do with an image, there is a focused category of tools for the job."
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {toolCategories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </Container>
    </section>
  );
}
