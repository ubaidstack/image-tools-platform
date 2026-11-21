"use client";

import {
  useEffect,
  useRef,
  useState,
  type DragEvent,
  type KeyboardEvent,
} from "react";
import Image from "next/image";
import { AlertCircle, Check, Loader2, Upload, X } from "lucide-react";
import { siteConfig } from "@/config/site";
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_INPUT_BYTES,
  formatBytes,
  isAcceptedType,
  loadImageFile,
} from "@/lib/image/processing";
import { cn } from "@/lib/utils";

type SelectedFile = {
  file: File;
  /** Object URL for the preview; revoked when replaced or on unmount. */
  url: string;
  width: number;
  height: number;
};

/**
 * Drag-and-drop upload area for the hero section.
 *
 * Selecting a file validates it, decodes it locally and shows a preview
 * with its name, size and dimensions. No image processing is performed
 * here — the user can clear the selection or choose another file.
 */
export function UploadArea() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<SelectedFile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const previewUrl = selectedFile?.url;

  // The first render has no URL, so Strict Mode's double-invoked effects
  // cannot revoke a preview that is still on screen.
  useEffect(() => {
    if (!previewUrl) return;
    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const openFilePicker = () => {
    inputRef.current?.click();
  };

  const acceptFile = async (file: File | undefined | null) => {
    if (!file) return;
    setError(null);

    if (!isAcceptedType(file.type)) {
      setError(
        `Unsupported file type. Please choose one of: ${siteConfig.formats.join(", ")}.`
      );
      return;
    }
    if (file.size > MAX_INPUT_BYTES) {
      setError(
        `This file is ${formatBytes(file.size)}, which is larger than the ${formatBytes(MAX_INPUT_BYTES)} limit. Please choose a smaller image.`
      );
      return;
    }

    setIsLoading(true);
    try {
      const loaded = await loadImageFile(file);
      setSelectedFile({ file, ...loaded });
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "This image could not be opened. Please try a different file."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setError(null);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(false);
    void acceptFile(event.dataTransfer.files?.[0]);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openFilePicker();
    }
  };

  return (
    <div className="w-full">
      {selectedFile ? (
        <div className="relative rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50/60 px-6 py-8">
          <div className="flex flex-col items-center gap-4">
            <Image
              src={selectedFile.url}
              alt={`Preview of ${selectedFile.file.name}`}
              width={selectedFile.width}
              height={selectedFile.height}
              unoptimized
              className="max-h-52 w-auto max-w-full rounded-lg object-contain shadow-sm"
            />
            <div className="min-w-0 text-center">
              <p className="max-w-full truncate text-base font-semibold text-gray-900">
                {selectedFile.file.name}
              </p>
              <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-gray-500">
                <Check className="size-4 text-accent" aria-hidden="true" />
                {formatBytes(selectedFile.file.size)} · {selectedFile.width} ×{" "}
                {selectedFile.height} px
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={openFilePicker}
                disabled={isLoading}
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Upload className="size-4" aria-hidden="true" />
                Choose different image
              </button>
              <button
                type="button"
                onClick={clearSelection}
                disabled={isLoading}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:border-gray-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X className="size-4" aria-hidden="true" />
                Remove
              </button>
            </div>
          </div>

          {isLoading ? (
            <div
              className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-2xl bg-white/80 backdrop-blur-sm"
              role="status"
              aria-live="polite"
            >
              <Loader2 className="size-8 animate-spin text-accent" aria-hidden="true" />
              <p className="text-sm font-medium text-gray-700">Loading image…</p>
            </div>
          ) : null}
        </div>
      ) : (
        /* The whole area is one keyboard-accessible control */
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
          aria-busy={isLoading}
          className={cn(
            "group flex cursor-pointer flex-col items-center rounded-2xl border-2 border-dashed bg-gray-50/60 px-6 py-12 text-center transition-colors duration-200 outline-none sm:py-16",
            dragActive
              ? "border-accent bg-accent-soft"
              : "border-gray-300 hover:border-accent/50 hover:bg-accent-soft/40 focus-visible:border-accent focus-visible:ring-4 focus-visible:ring-accent/15"
          )}
        >
          {isLoading ? (
            <div className="flex flex-col items-center">
              <span className="flex size-14 items-center justify-center rounded-full bg-white text-accent shadow-sm ring-1 ring-gray-200">
                <Loader2 className="size-6 animate-spin" aria-hidden="true" />
              </span>
              <p className="mt-4 text-lg font-semibold text-gray-900">
                Loading image…
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Reading your file locally
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <span className="flex size-14 items-center justify-center rounded-full bg-white text-accent shadow-sm ring-1 ring-gray-200">
                <Upload className="size-6" aria-hidden="true" />
              </span>
              <p className="mt-4 text-lg font-semibold text-gray-900">
                Drag &amp; drop your image here
              </p>
              <p className="mt-1 text-sm text-gray-500">or</p>
              {/* Styled as a button; the container is the real control */}
              <span className="mt-4 inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors group-hover:bg-accent-strong">
                <Upload className="size-4" aria-hidden="true" />
                Browse files
              </span>
            </div>
          )}
        </div>
      )}

      {/* Hidden input — the controls above open the file picker */}
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_IMAGE_TYPES.join(",")}
        className="hidden"
        onChange={(event) => {
          void acceptFile(event.target.files?.[0]);
          event.target.value = "";
        }}
      />

      {/* Supported formats */}
      <ul className="mt-5 flex flex-wrap items-center justify-center gap-2">
        {siteConfig.formats.map((format) => (
          <li
            key={format}
            className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold tracking-wide text-gray-600"
          >
            {format}
          </li>
        ))}
      </ul>

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
