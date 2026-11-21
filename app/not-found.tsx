import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ImageOff, LayoutGrid } from "lucide-react";
import { Container } from "@/components/container";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you are looking for does not exist or has moved.",
};

export default function NotFound() {
  return (
    <Container className="flex flex-1 flex-col items-center justify-center py-24 text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-accent-soft text-accent">
        <ImageOff className="size-6" aria-hidden="true" />
      </span>
      <p className="mt-6 text-sm font-semibold tracking-wide text-accent uppercase">
        404
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
        Page not found
      </h1>
      <p className="mt-3 max-w-md text-base leading-relaxed text-gray-600">
        The page you are looking for does not exist, or it may have moved. Try
        one of the links below instead.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-accent-strong"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to home
        </Link>
        <Link
          href="/all-tools"
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:border-gray-400"
        >
          <LayoutGrid className="size-4" aria-hidden="true" />
          Browse all tools
        </Link>
      </div>
    </Container>
  );
}
