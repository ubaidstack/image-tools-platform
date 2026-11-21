import { HardDrive, Lock, ShieldCheck } from "lucide-react";
import { Container } from "@/components/container";
import { SectionHeader } from "@/components/section-header";
import { privacyPoints } from "@/config/content";

const pointIcons = [ShieldCheck, Lock, HardDrive];

/** Privacy promise: browser-side processing, no server uploads. */
export function PrivacySection() {
  return (
    <section id="privacy" className="border-y border-gray-900/5 bg-surface">
      <Container className="py-20 sm:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeader
              align="left"
              eyebrow="Privacy first"
              title="Your images never leave your device"
              description="Most online editors upload your photos to a server before processing them. We take a different approach: the core tools run entirely in your browser, powered by modern web technology."
            />
            <ul className="mt-8 flex flex-wrap gap-2">
              {["No uploads", "No account", "100% local"].map((chip) => (
                <li
                  key={chip}
                  className="rounded-full border border-accent/15 bg-white px-3 py-1 text-xs font-semibold text-accent shadow-xs"
                >
                  {chip}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-accent/10 via-violet/10 to-cyan/10 blur-2xl"
            />
            <ul className="relative space-y-4">
              {privacyPoints.map((point, index) => {
                const Icon = pointIcons[index];
                return (
                  <li
                    key={point.title}
                    className="group flex gap-4 rounded-2xl border border-white/70 bg-white/85 p-5 shadow-sm shadow-gray-900/5 backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/10"
                  >
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent/10 to-violet/10 text-accent ring-1 ring-accent/10 transition-colors group-hover:from-accent group-hover:to-violet group-hover:text-white group-hover:ring-transparent">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="text-base font-semibold text-ink">
                        {point.title}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-gray-600">
                        {point.description}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
