import { Check } from "lucide-react";
import { Container } from "@/components/container";
import { UploadArea } from "@/components/home/upload-area";
import { siteConfig } from "@/config/site";

const heroHighlights = ["100% free", "No signup", "Files stay on your device"];

/** Homepage hero: headline, description and the large upload area. */
export function Hero() {
  return (
    <section className="border-b border-gray-200 bg-white">
      <Container className="py-16 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
            Edit, convert and compress images{" "}
            <span className="text-accent">right in your browser</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-gray-600">
            {siteConfig.name} is a complete suite of free online image tools.
            Compress, resize, crop, rotate and convert JPG, PNG and WebP files
            in seconds — no software to install, nothing to sign up for.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-2xl">
          <UploadArea />
        </div>

        <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {heroHighlights.map((highlight) => (
            <li
              key={highlight}
              className="inline-flex items-center gap-1.5 text-sm text-gray-600"
            >
              <Check className="size-4 text-accent" aria-hidden="true" />
              {highlight}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
