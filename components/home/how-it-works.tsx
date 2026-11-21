import { Download, MousePointerClick, SlidersHorizontal } from "lucide-react";
import { Container } from "@/components/container";
import { SectionHeader } from "@/components/section-header";
import { howItWorksSteps } from "@/config/content";

const stepIcons = [MousePointerClick, SlidersHorizontal, Download];

/** Three-step "how it works" walkthrough. */
export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-gray-50">
      <Container className="py-16 sm:py-20">
        <SectionHeader
          eyebrow="How it works"
          title="Edit images in three simple steps"
          description="No tutorials needed — the whole flow takes less than a minute."
        />
        <ol className="mt-12 grid gap-8 sm:grid-cols-3 sm:gap-5">
          {howItWorksSteps.map((step, index) => {
            const Icon = stepIcons[index];
            return (
              <li
                key={step.title}
                className="relative flex flex-col items-center rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm"
              >
                <span
                  className="absolute top-4 left-5 text-sm font-semibold text-gray-500"
                  aria-hidden="true"
                >
                  0{index + 1}
                </span>
                <span className="flex size-12 items-center justify-center rounded-full bg-accent-soft text-accent">
                  <Icon className="size-6" aria-hidden="true" />
                </span>
                <span
                  className="mt-5 text-xs font-semibold tracking-wide text-accent uppercase"
                  aria-hidden="true"
                >
                  Step {index + 1}
                </span>
                <h3 className="mt-1 text-lg font-semibold text-gray-900">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {step.description}
                </p>
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}
