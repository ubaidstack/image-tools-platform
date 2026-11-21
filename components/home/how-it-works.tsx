import {
  ArrowRight,
  Download,
  MousePointerClick,
  SlidersHorizontal,
} from "lucide-react";
import { Container } from "@/components/container";
import { SectionHeader } from "@/components/section-header";
import { howItWorksSteps } from "@/config/content";

const stepIcons = [MousePointerClick, SlidersHorizontal, Download];

/** Three-step "how it works" walkthrough. */
export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-white">
      <Container className="py-20 sm:py-28">
        <SectionHeader
          eyebrow="How it works"
          title="Edit images in three simple steps"
          description="No tutorials needed — the whole flow takes less than a minute."
        />
        <div className="relative mt-14">
          <ol className="grid gap-6 sm:grid-cols-3">
            {howItWorksSteps.map((step, index) => {
              const Icon = stepIcons[index];
              return (
                <li
                  key={step.title}
                  className="group relative flex flex-col items-center rounded-2xl border border-gray-900/5 bg-white p-8 text-center shadow-sm shadow-gray-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-accent/10"
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute top-3 right-5 text-5xl font-semibold tracking-tight text-gray-900/[0.04] select-none"
                  >
                    0{index + 1}
                  </span>
                  <span className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-violet text-white shadow-lg shadow-accent/25">
                    <Icon className="size-6" aria-hidden="true" />
                  </span>
                  <span className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-2.5 py-0.5 text-[11px] font-semibold tracking-[0.1em] text-accent uppercase">
                    Step {index + 1}
                  </span>
                  <h3 className="mt-3 text-lg font-semibold text-ink">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">
                    {step.description}
                  </p>
                </li>
              );
            })}
          </ol>

          {/* Connectors between steps (desktop only) */}
          {[33.33, 66.66].map((left) => (
            <span
              key={left}
              aria-hidden="true"
              className="absolute top-[3.75rem] hidden -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-gray-900/5 bg-white p-1 text-accent shadow-sm sm:flex"
              style={{ left: `${left}%` }}
            >
              <ArrowRight className="size-3.5" />
            </span>
          ))}
        </div>
      </Container>
    </section>
  );
}
