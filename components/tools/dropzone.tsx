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
          "flex cursor-pointer flex-col items-center rounded-3xl border-2 border-dashed bg-gradient-to-b from-white to-accent-soft/50 px-6 py-12 text-center transition-all duration-300 outline-none sm:py-16",
          dragActive
            ? "scale-[1.01] border-accent bg-accent-soft"
            : "border-accent/25 hover:border-accent/60 hover:shadow-lg hover:shadow-accent/5 focus-visible:border-accent focus-visible:ring-4 focus-visible:ring-accent/15"
        )}
      >
        <span className="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-violet text-white shadow-xl shadow-accent/30 motion-safe:animate-float-soft">
          <Upload className="size-7" aria-hidden="true" />
        </span>
        <p className="mt-5 text-xl font-semibold text-ink">
          Drag &amp; drop your image here
        </p>
        <p className="mt-1 text-sm text-gray-500">or</p>
        <span className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent to-violet px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-accent/25 transition-all duration-200">
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

      <p className="mt-4 text-center text-xs font-medium text-gray-500">
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
