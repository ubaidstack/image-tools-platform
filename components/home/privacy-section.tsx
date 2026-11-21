import { ShieldCheck } from "lucide-react";
import { Container } from "@/components/container";
import { SectionHeader } from "@/components/section-header";
import { privacyPoints } from "@/config/content";

/** Privacy promise: browser-side processing, no server uploads. */
export function PrivacySection() {
  return (
    <section id="privacy" className="bg-white">
      <Container className="py-16 sm:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeader
              align="left"
              eyebrow="Privacy first"
              title="Your images never leave your device"
              description="Most online editors upload your photos to a server before processing them. We take a different approach: the core tools run entirely in your browser, powered by modern web technology."
            />
          </div>
          <div>
            <ul className="space-y-5">
              {privacyPoints.map((point) => (
                <li
                  key={point.title}
                  className="flex gap-4 rounded-2xl border border-gray-200 bg-gray-50/60 p-5"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
                    <ShieldCheck className="size-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">
                      {point.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-gray-600">
                      {point.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
