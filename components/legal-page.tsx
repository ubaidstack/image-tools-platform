import type { ReactNode } from "react";
import { Container } from "@/components/container";
import { SectionHeader } from "@/components/section-header";

type LegalPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  lastUpdated: string;
  children: ReactNode;
};

/**
 * Shared layout for legal pages. The draft banner and review date make it
 * obvious that the text still needs legal approval before publication.
 */
export function LegalPage({
  eyebrow,
  title,
  description,
  lastUpdated,
  children,
}: LegalPageProps) {
  return (
    <Container className="py-16 sm:py-20">
      <SectionHeader
        as="h1"
        eyebrow={eyebrow}
        title={title}
        description={description}
      />
      <div className="mx-auto mt-10 max-w-3xl">
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-900">
          <strong className="font-semibold">Draft for review.</strong> This
          document is a first draft prepared for review. It must be checked and
          approved by qualified legal counsel before publication.
        </div>
        <p className="mt-6 text-sm text-gray-500">Last updated: {lastUpdated}</p>
        <div className="mt-8 space-y-8 text-sm leading-relaxed text-gray-600 [&_a]:font-medium [&_a]:text-accent [&_a]:underline [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-gray-900 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-gray-900 [&_li]:pl-1 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
          {children}
        </div>
      </div>
    </Container>
  );
}
