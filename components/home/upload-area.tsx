"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type DragEvent,
  type KeyboardEvent,
} from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Crop,
  Download,
  Loader2,
  Maximize2,
  Minimize2,
  RefreshCw,
  Sparkles,
  Target,
  Upload,
  X,
} from "lucide-react";
import { siteConfig } from "@/config/site";
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_INPUT_BYTES,
  canvasToBlob,
  createOutput,
  downloadBlob,
  drawImageRegion,
  extForMime,
  fitToCanvasLimit,
  formatBytes,
  isAcceptedType,
  labelForMime,
  loadImageFile,
  loadImageFromUrl,
  withExtension,
  type ToolOutput,
} from "@/lib/image/processing";
import { cn } from "@/lib/utils";

type SelectedFile = {
  file: File;
  /** Object URL for the preview; revoked when replaced or on unmount. */
  url: string;
  width: number;
  height: number;
};

const moreToolsList = [
  {
    name: "Image Resizer",
    desc: "Scale dimensions & pixels",
    href: "/tools/image-resizer",
    icon: Maximize2,
  },
  {
    name: "Image Cropper",
    desc: "Crop to 1:1, 16:9, or freeform",
    href: "/tools/image-cropper",
    icon: Crop,
  },
  {
    name: "WebP Converter",
    desc: "Convert to modern WebP",
    href: "/tools/webp-converter",
    icon: RefreshCw,
  },
  {
    name: "Image to KB",
    desc: "Compress to exact 100 KB / 50 KB",
    href: "/tools/image-to-kb",
    icon: Target,
  },
];

/**
 * Direct Image Compressor & Upload Area on the landing page hero.
 *
 * Allows users to upload an image, adjust compression settings,
 * preview byte savings, and download the compressed image directly on
 * the landing page, with instant access to more tools on the right.
 */
export function UploadArea() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<SelectedFile | null>(null);
  const [output, setOutput] = useState<ToolOutput | null>(null);
  const [quality, setQuality] = useState(80);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const previewUrl = selectedFile?.url;
  const outputUrl = output?.url;

  // Revoke object URLs on change or unmount
  useEffect(() => {
    if (!previewUrl) return;
    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  useEffect(() => {
    if (!outputUrl) return;
    return () => URL.revokeObjectURL(outputUrl);
  }, [outputUrl]);

  const openFilePicker = () => {
    inputRef.current?.click();
  };

  const acceptFile = async (file: File | undefined | null) => {
    if (!file) return;
    setError(null);
    setOutput(null);

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

  const clearSelection = useCallback(() => {
    setSelectedFile(null);
    setOutput(null);
    setError(null);
  }, []);

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

  /** Direct browser compression */
  const handleCompress = async () => {
    if (!selectedFile) return;
    setIsProcessing(true);
    setError(null);

    try {
      const img = await loadImageFromUrl(selectedFile.url);
      const fitted = fitToCanvasLimit(img.naturalWidth, img.naturalHeight);
      const canvas = drawImageRegion(img, {
        width: fitted.width,
        height: fitted.height,
      });

      const mimeType = selectedFile.file.type as
        | "image/jpeg"
        | "image/png"
        | "image/webp";
      const blob = await canvasToBlob(
        canvas,
        mimeType,
        mimeType === "image/png" ? undefined : quality / 100
      );

      const out = await createOutput(
        blob,
        withExtension(selectedFile.file.name, extForMime(mimeType)),
        canvas.width,
        canvas.height
      );

      setOutput(out);
    } catch (processError) {
      setError(
        processError instanceof Error
          ? processError.message
          : "Compression failed. Please try again."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const reduction =
    selectedFile && output
      ? Math.round(
          ((selectedFile.file.size - output.blob.size) / selectedFile.file.size) *
            100
        )
      : 0;

  return (
    <div className="w-full">
      {/* Top Header: Active Image Compressor + More Tools on the right */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-4 py-2.5 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-lg bg-accent text-white">
            <Minimize2 className="size-4" aria-hidden="true" />
          </span>
          <span className="text-sm font-semibold text-gray-900">
            Image Compressor
          </span>
          <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-medium text-accent">
            Active Tool
          </span>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <span className="hidden text-xs font-medium text-gray-500 sm:inline">
            More tools:
          </span>
          <Link
            href="/tools/image-resizer"
            className="rounded-lg px-2.5 py-1 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
          >
            Resize
          </Link>
          <Link
            href="/tools/image-cropper"
            className="rounded-lg px-2.5 py-1 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
          >
            Crop
          </Link>
          <Link
            href="/tools/webp-converter"
            className="rounded-lg px-2.5 py-1 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
          >
            WebP
          </Link>
          <Link
            href="/all-tools"
            className="inline-flex items-center gap-1 rounded-lg bg-gray-50 px-2.5 py-1 text-xs font-semibold text-accent transition-colors hover:bg-accent-soft"
          >
            All tools
            <ArrowRight className="size-3" aria-hidden="true" />
          </Link>
        </div>
      </div>

      {selectedFile ? (
        <div className="flex flex-col gap-5">
          {/* File summary bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
            <div className="min-w-0">
              <p className="max-w-md truncate text-sm font-semibold text-gray-900">
                {selectedFile.file.name}
              </p>
              <p className="mt-0.5 text-xs text-gray-500">
                {formatBytes(selectedFile.file.size)} · {selectedFile.width} ×{" "}
                {selectedFile.height} px · {labelForMime(selectedFile.file.type)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={openFilePicker}
                disabled={isProcessing || isLoading}
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-xs transition-colors hover:border-gray-400 disabled:opacity-50"
              >
                <Upload className="size-3.5" aria-hidden="true" />
                Change image
              </button>
              <button
                type="button"
                onClick={clearSelection}
                disabled={isProcessing || isLoading}
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-xs transition-colors hover:border-gray-400 disabled:opacity-50"
              >
                <X className="size-3.5" aria-hidden="true" />
                Remove
              </button>
            </div>
          </div>

          {/* Main 2-column workspace: Preview on Left, Compressor + More Tools on Right */}
          <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
            {/* Left Column: Image Preview / Result */}
            <div
              className={cn(
                "relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 p-4",
                "min-h-[280px] sm:min-h-[360px]"
              )}
            >
              {output ? (
                <div className="flex flex-col items-center gap-3">
                  <Image
                    src={output.url}
                    alt="Compressed result"
                    width={output.width}
                    height={output.height}
                    unoptimized
                    className="max-h-[340px] w-auto max-w-full rounded-lg object-contain shadow-sm"
                  />
                  <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-2 text-center text-xs text-green-800">
                    <span className="font-semibold">
                      {formatBytes(selectedFile.file.size)} →{" "}
                      {formatBytes(output.blob.size)}
                    </span>
                    {" · "}
                    {reduction > 0 ? (
                      <span className="font-bold text-green-700">
                        {reduction}% smaller
                      </span>
                    ) : (
                      <span>Optimized file</span>
                    )}
                  </div>
                </div>
              ) : (
                <Image
                  src={selectedFile.url}
                  alt={`Preview of ${selectedFile.file.name}`}
                  width={selectedFile.width}
                  height={selectedFile.height}
                  unoptimized
                  className="max-h-[360px] w-auto max-w-full rounded-lg object-contain shadow-sm"
                />
              )}

              {(isProcessing || isLoading) && (
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-2xl bg-white/80 backdrop-blur-sm"
                  role="status"
                  aria-live="polite"
                >
                  <Loader2
                    className="size-8 animate-spin text-accent"
                    aria-hidden="true"
                  />
                  <p className="text-sm font-medium text-gray-700">
                    {isLoading ? "Reading image…" : "Compressing image locally…"}
                  </p>
                </div>
              )}

              {output ? (
                <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                  <CheckCircle2 className="size-3.5" aria-hidden="true" />
                  Compressed Result Ready
                </span>
              ) : null}
            </div>

            {/* Right Column: Compressor Controls + More Tools */}
            <div className="flex flex-col gap-4">
              {/* Compressor Controls Card */}
              <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Minimize2 className="size-4 text-accent" aria-hidden="true" />
                    <span className="text-sm font-semibold text-gray-900">
                      Compressor Controls
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-gray-500">
                    {quality}% Quality
                  </span>
                </div>

                <div>
                  <label
                    htmlFor="hero-quality-slider"
                    className="mb-1.5 block text-xs font-medium text-gray-700"
                  >
                    Compression quality
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      id="hero-quality-slider"
                      type="range"
                      min={10}
                      max={100}
                      value={quality}
                      disabled={
                        isProcessing || selectedFile.file.type === "image/png"
                      }
                      onChange={(e) => setQuality(Number(e.target.value))}
                      aria-label={`Quality: ${quality}%`}
                      className="h-2 w-full cursor-pointer appearance-none rounded-full bg-gray-200 accent-[var(--color-accent)] disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    <span className="w-12 shrink-0 rounded-md bg-gray-100 px-2 py-1 text-center text-xs font-medium text-gray-700 tabular-nums">
                      {quality}%
                    </span>
                  </div>
                  {selectedFile.file.type === "image/png" ? (
                    <p className="mt-1.5 text-xs text-amber-700">
                      PNG is a lossless format. For aggressive size cuts, convert
                      to JPG or WebP using the tools below.
                    </p>
                  ) : (
                    <p className="mt-1.5 text-xs text-gray-500">
                      Lower quality reduces file size; 75-85% is recommended.
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleCompress}
                  disabled={isProcessing || isLoading}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isProcessing ? (
                    <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <Sparkles className="size-4" aria-hidden="true" />
                  )}
                  {output ? "Re-compress image" : "Compress image now"}
                </button>

                {output ? (
                  <button
                    type="button"
                    onClick={() => downloadBlob(output.blob, output.name)}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-green-600 bg-green-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-green-700"
                  >
                    <Download className="size-4" aria-hidden="true" />
                    Download compressed image
                  </button>
                ) : null}

                {error ? (
                  <p
                    role="alert"
                    className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2 text-xs text-red-700"
                  >
                    <AlertCircle
                      className="mt-0.5 size-3.5 shrink-0"
                      aria-hidden="true"
                    />
                    {error}
                  </p>
                ) : null}
              </div>

              {/* More Tools Panel on the Right */}
              <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-xs font-bold tracking-wider text-gray-900 uppercase">
                    More Tools
                  </h3>
                  <Link
                    href="/all-tools"
                    className="text-xs font-semibold text-accent hover:underline"
                  >
                    View all 8 →
                  </Link>
                </div>
                <div className="grid gap-2">
                  {moreToolsList.map((t) => {
                    const Icon = t.icon;
                    return (
                      <Link
                        key={t.name}
                        href={t.href}
                        className="group flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/60 p-2.5 transition-all hover:border-accent/30 hover:bg-accent-soft/40"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="flex size-7 items-center justify-center rounded-lg bg-white text-gray-600 shadow-2xs group-hover:bg-accent group-hover:text-white transition-colors">
                            <Icon className="size-4" aria-hidden="true" />
                          </span>
                          <div className="text-left">
                            <p className="text-xs font-semibold text-gray-900 group-hover:text-accent transition-colors">
                              {t.name}
                            </p>
                            <p className="text-[11px] text-gray-500">
                              {t.desc}
                            </p>
                          </div>
                        </div>
                        <ArrowRight
                          className="size-3.5 text-gray-400 group-hover:text-accent transition-colors"
                          aria-hidden="true"
                        />
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Empty / Idle State: Clean dropzone */
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
          aria-label="Drag and drop an image here or browse files to compress"
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
                Drag &amp; drop an image to compress
              </p>
              <p className="mt-1 text-sm text-gray-500">or</p>
              <span className="mt-4 inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors group-hover:bg-accent-strong">
                <Upload className="size-4" aria-hidden="true" />
                Browse files
              </span>
            </div>
          )}
        </div>
      )}

      {/* Hidden input */}
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

      {error && !selectedFile ? (
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
