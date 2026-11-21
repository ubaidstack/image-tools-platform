import { Check, Sparkles } from "lucide-react";
import { Container } from "@/components/container";
import { UploadArea } from "@/components/home/upload-area";
import { siteConfig } from "@/config/site";

const heroHighlights = ["100% free", "No signup", "Files stay on your device"];

/** Homepage hero: headline, description and the large upload area. */
export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-gray-900/5 bg-surface">
      {/* Soft gradient decorations */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-hero-grid opacity-60 [mask-image:radial-gradient(ellipse_at_top,black,transparent_72%)]" />
        <div className="absolute -top-32 -left-24 size-96 rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute -top-20 right-0 size-80 rounded-full bg-violet/20 blur-3xl" />
        <div className="absolute top-40 left-1/3 size-72 rounded-full bg-cyan/15 blur-3xl" />
      </div>

      <Container className="relative py-16 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/15 bg-white/80 px-3.5 py-1.5 text-xs font-semibold text-accent shadow-sm shadow-accent/5 backdrop-blur">
            <Sparkles className="size-3.5" aria-hidden="true" />
            Free forever · No signup · Browser-based
          </span>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-ink text-balance sm:text-5xl lg:text-6xl">
            Edit, convert and compress images{" "}
            <span className="bg-gradient-to-r from-accent via-violet to-[#4f46e5] bg-clip-text text-transparent">
              right in your browser
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-gray-600 text-pretty sm:text-lg">
            {siteConfig.name} is a complete suite of free online image tools.
            Compress, resize, crop, rotate and convert JPG, PNG and WebP files
            in seconds — no software to install, nothing to sign up for.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-4xl">
          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute -inset-x-6 -top-4 -bottom-6 rounded-[2rem] bg-gradient-to-b from-white/70 via-white/20 to-transparent blur-xl"
            />
            <div className="relative rounded-3xl border border-white/70 bg-white/70 p-1.5 shadow-2xl shadow-accent/10 backdrop-blur-sm sm:p-2">
              <div className="rounded-[1.25rem] bg-white p-3 sm:p-5">
                <UploadArea />
              </div>
            </div>
          </div>
        </div>

        <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
          {heroHighlights.map((highlight) => (
            <li
              key={highlight}
              className="inline-flex items-center gap-1.5 rounded-full border border-gray-900/5 bg-white/70 px-3 py-1 text-xs font-medium text-gray-600 shadow-xs backdrop-blur"
            >
              <Check className="size-3.5 text-accent" aria-hidden="true" />
              {highlight}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
