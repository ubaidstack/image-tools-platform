"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";
import { Container } from "@/components/container";

type ErrorPageProps = {
  error: unknown;
  /** Next.js 16 stable retry helper: re-fetches and re-renders the segment. */
  retry: () => void;
};

export default function ErrorPage({ error, retry }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const digest =
    error instanceof Error && "digest" in error
      ? (error as Error & { digest?: string }).digest
      : undefined;

  return (
    <Container className="flex flex-1 flex-col items-center justify-center py-24 text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-red-50 text-red-600">
        <AlertTriangle className="size-6" aria-hidden="true" />
      </span>
      <h1 className="mt-6 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
        Something went wrong
      </h1>
      <p className="mt-3 max-w-md text-base leading-relaxed text-gray-600">
        An unexpected error stopped this page from loading. Try again, or head
        back to the homepage if the problem continues.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => retry()}
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-accent-strong"
        >
          <RotateCcw className="size-4" aria-hidden="true" />
          Try again
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:border-gray-400"
        >
          <Home className="size-4" aria-hidden="true" />
          Back to home
        </Link>
      </div>
      {digest ? (
        <p className="mt-6 text-xs text-gray-400">Reference: {digest}</p>
      ) : null}
    </Container>
  );
}
