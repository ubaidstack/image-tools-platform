import type { Metadata } from "next";
import { Briefcase, Mail, Scale, ShieldCheck } from "lucide-react";
import { Container } from "@/components/container";
import { SectionHeader } from "@/components/section-header";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Contact",
  description:
    "Contact details for support, privacy requests, legal questions and business enquiries about PIXSHRINK.",
  path: "/contact",
});

const contactChannels = [
  {
    icon: Mail,
    title: "General support",
    description:
      "Questions about a tool, help with a result, or feedback on the website.",
    detail: "[SUPPORT EMAIL PLACEHOLDER]",
  },
  {
    icon: ShieldCheck,
    title: "Privacy requests",
    description:
      "Access, correction, deletion or other data-protection requests.",
    detail: "[PRIVACY EMAIL PLACEHOLDER]",
  },
  {
    icon: Scale,
    title: "Legal",
    description:
      "Questions about the Terms of Service, intellectual property or legal notices.",
    detail: "[LEGAL EMAIL PLACEHOLDER]",
  },
  {
    icon: Briefcase,
    title: "Business and partnerships",
    description:
      "Partnerships, integrations, media enquiries and other business matters.",
    detail: "[BUSINESS EMAIL PLACEHOLDER]",
  },
];

export default function ContactPage() {
  return (
    <Container className="py-16 sm:py-20">
      <SectionHeader
        as="h1"
        eyebrow="Contact"
        title="Get in touch"
        description="We welcome feedback, tool requests, bug reports and privacy questions. Choose the channel that fits your enquiry."
      />

      <div className="mx-auto mt-10 max-w-3xl">
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-900">
          <strong className="font-semibold">Contact details are placeholders.</strong>{" "}
          Replace each bracketed entry with a monitored address before the site
          is published. No email address, phone number or postal address has
          been invented for this draft.
        </div>
      </div>

      <div className="mx-auto mt-8 grid max-w-4xl gap-5 sm:grid-cols-2">
        {contactChannels.map((channel) => {
          const Icon = channel.icon;
          return (
            <div
              key={channel.title}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <span className="flex size-11 items-center justify-center rounded-xl bg-accent-soft text-accent">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <h2 className="mt-4 text-base font-semibold text-gray-900">
                {channel.title}
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-gray-600">
                {channel.description}
              </p>
              <p className="mt-4 rounded-lg bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700">
                {channel.detail}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mx-auto mt-10 grid max-w-4xl gap-5 sm:grid-cols-2">
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900">
            Before you write
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-gray-600">
            To help us respond quickly, include:
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-gray-600">
            <li>the tool you were using and what you expected to happen;</li>
            <li>your browser, operating system and device type;</li>
            <li>the image format and approximate file size;</li>
            <li>the exact error message, if one appeared; and</li>
            <li>steps that reproduce the problem.</li>
          </ul>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900">
            A note about images
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-gray-600">
            The core tools process images locally in your browser, so we cannot
            see the image you were working on. Please do not send sensitive or
            confidential images unless they are necessary to explain the
            problem.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-gray-600">
            We aim to respond within{" "}
            <strong>[RESPONSE TIME PLACEHOLDER]</strong>. Support is provided in{" "}
            <strong>[LANGUAGE PLACEHOLDER]</strong>.
          </p>
        </section>
      </div>

      <p className="mx-auto mt-8 max-w-3xl text-center text-sm text-gray-500">
        Postal address and company registration details:{" "}
        <strong>[POSTAL ADDRESS / COMPANY NUMBER PLACEHOLDER]</strong>.
      </p>
    </Container>
  );
}
