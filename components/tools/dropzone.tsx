"use client";

import { useRef, useState, type DragEvent, type KeyboardEvent } from "react";
import { AlertCircle, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

type DropzoneProps = {
  /** Space-separated MIME types accepted, e.g. "image/jpeg,image/png". */
  accept: string;
  /** Human-readable format list shown under the dropzone. */
  formatsLabel: string;
  /** Max size shown under the dropzone, e.g. "30 MB". */
  maxSizeLabel: string;
  onFileAccepted: (file: File) => void;
  /** Shown when validation fails (unsupported type, too large…). */
  error?: string | null;
};

/**
 * Drag-and-drop upload card for tool workspaces. The whole card is a
 * single keyboard-accessible control, matching the hero upload style.
 */
export function Dropzone({
  accept,
  formatsLabel,
  maxSizeLabel,
  onFileAccepted,
  error,
}: DropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const openFilePicker = () => {
    inputRef.current?.click();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openFilePicker();
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(false);
    const file = event.dataTransfer.files?.[0];
    if (file) onFileAccepted(file);
  };

  return (
    <div className="w-full">
      <div
        role="button"
        tabIndex={0}
        onClick={openFilePicker}
        onKeyDown={handleKeyDown}
        onDragEnter={(event) => {
          event.preventDefault();
          setDragActive(true);
        }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        aria-label="Drag and drop an image here or browse files"
        className={cn(
          "flex cursor-pointer flex-col items-center rounded-2xl border-2 border-dashed bg-gray-50/60 px-6 py-12 text-center transition-colors duration-200 outline-none sm:py-14",
          dragActive
            ? "border-accent bg-accent-soft"
            : "border-gray-300 hover:border-accent/50 hover:bg-accent-soft/40 focus-visible:border-accent focus-visible:ring-4 focus-visible:ring-accent/15"
        )}
      >
        <span className="flex size-14 items-center justify-center rounded-full bg-white text-accent shadow-sm ring-1 ring-gray-200">
          <Upload className="size-6" aria-hidden="true" />
        </span>
        <p className="mt-4 text-lg font-semibold text-gray-900">
          Drag &amp; drop your image here
        </p>
        <p className="mt-1 text-sm text-gray-500">or</p>
        <span className="mt-4 inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-accent-strong">
          <Upload className="size-4" aria-hidden="true" />
          Browse files
        </span>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) onFileAccepted(file);
          event.target.value = "";
        }}
      />

      <p className="mt-4 text-center text-sm text-gray-500">
        Supported formats: {formatsLabel} · Up to {maxSizeLabel}
      </p>

      {error ? (
        <p
          role="alert"
          className="mt-3 flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700"
        >
          <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : null}
    </div>
  );
}
