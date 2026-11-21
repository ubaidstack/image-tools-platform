"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import { AlertCircle, CheckCircle2, Download, Loader2, RefreshCw } from "lucide-react";
import { Dropzone } from "@/components/tools/dropzone";
import {
  MAX_INPUT_BYTES,
  downloadBlob,
  formatBytes,
  isAcceptedType,
  loadImageFile,
  type ToolOutput,
} from "@/lib/image/processing";
import { cn } from "@/lib/utils";

export type SelectedImage = {
  file: File;
  /** Object URL for previews; owned and revoked by the workspace. */
  url: string;
  width: number;
  height: number;
};

export type OutputMeta = ReactNode;

export type WorkspaceApi = {
  image: SelectedImage;
  output: ToolOutput | null;
  outputMeta: OutputMeta;
  isProcessing: boolean;
  /** Wrap long work in try/finally with setProcessing(false). */
  setProcessing: (value: boolean) => void;
  /** Set the processed result and its summary line(s). */
  setOutput: (output: ToolOutput, meta?: OutputMeta) => void;
  /** Show an error message near the controls. */
  setError: (message: string | null) => void;
  /** Discard the result but keep the selected image. */
  clearOutput: () => void;
};

type ToolWorkspaceProps = {
  accept: readonly string[];
  formatsLabel: string;
  /** Rendered once an image is selected; receives the workspace API. */
  children: (api: WorkspaceApi) => ReactNode;
  /** Optional replacement for the default <img> preview (e.g. canvas). */
  renderPreview?: (api: WorkspaceApi) => ReactNode;
};

/**
 * Shared skeleton for every tool: upload step → image + controls →
 * result with download and start-again. Tool components only supply
 * their own controls through the render prop.
 */
export function ToolWorkspace({
  accept,
  formatsLabel,
  children,
  renderPreview,
}: ToolWorkspaceProps) {
  const [image, setImage] = useState<SelectedImage | null>(null);
  const [output, setOutputState] = useState<ToolOutput | null>(null);
  const [outputMeta, setOutputMeta] = useState<OutputMeta>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingImage, setIsLoadingImage] = useState(false);

  const imageUrl = image?.url;
  const outputUrl = output?.url;

  /*
   * Revoke the previous object URL when it is replaced and the final one
   * on unmount. The first render has a null URL, so React Strict Mode's
   * double-invoked effects cannot revoke a URL that is still in use.
   */
  useEffect(() => {
    if (!imageUrl) return;
    return () => URL.revokeObjectURL(imageUrl);
  }, [imageUrl]);

  useEffect(() => {
    if (!outputUrl) return;
    return () => URL.revokeObjectURL(outputUrl);
  }, [outputUrl]);

  const resetOutput = useCallback(() => {
    setOutputState(null);
    setOutputMeta(null);
  }, []);

  const resetAll = useCallback(() => {
    resetOutput();
    setImage(null);
    setError(null);
  }, [resetOutput]);

  const acceptFile = useCallback(
    async (file: File) => {
      setError(null);
      resetOutput();

      if (!isAcceptedType(file.type)) {
        setError(
          `Unsupported file type. Please choose one of: ${formatsLabel}.`
        );
        return;
      }
      if (file.size > MAX_INPUT_BYTES) {
        setError(
          `This file is ${formatBytes(file.size)}, which is larger than the ${formatBytes(MAX_INPUT_BYTES)} limit. Please choose a smaller image.`
        );
        return;
      }

      setIsLoadingImage(true);
      try {
        const loaded = await loadImageFile(file);
        setImage({
          file,
          url: loaded.url,
          width: loaded.width,
          height: loaded.height,
        });
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "This image could not be opened. Please try a different file."
        );
      } finally {
        setIsLoadingImage(false);
      }
    },
    [formatsLabel, resetOutput]
  );

  const setOutput = useCallback((next: ToolOutput, meta: OutputMeta = null) => {
    setOutputState(next);
    setOutputMeta(meta);
  }, []);

  const api: WorkspaceApi = {
    image: image as SelectedImage,
    output,
    outputMeta,
    isProcessing,
    setProcessing: setIsProcessing,
    setOutput,
    setError,
    clearOutput: resetOutput,
  };

  return (
    <div className="w-full">
      {image === null ? (
        <Dropzone
          accept={accept.join(",")}
          formatsLabel={formatsLabel}
          maxSizeLabel={formatBytes(MAX_INPUT_BYTES)}
          onFileAccepted={acceptFile}
          error={error}
        />
      ) : (
        <div className="flex flex-col gap-5">
          {/* Selected file summary */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-gray-900">
                {image.file.name}
              </p>
              <p className="mt-0.5 text-sm text-gray-500">
                {formatBytes(image.file.size)} · {image.width} × {image.height}{" "}
                px
              </p>
            </div>
            <button
              type="button"
              onClick={resetAll}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:border-gray-400"
            >
              <RefreshCw className="size-4" aria-hidden="true" />
              Choose different image
            </button>
          </div>

          <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
            {/* Preview / result */}
            <div
              className={cn(
                "relative flex items-center justify-center overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 p-4",
                "min-h-[260px] sm:min-h-[340px]"
              )}
            >
              {renderPreview && !output ? (
                renderPreview(api)
              ) : output ? (
                <Image
                  src={output.url}
                  alt="Processed result"
                  width={output.width}
                  height={output.height}
                  unoptimized
                  className="max-h-[420px] w-auto max-w-full rounded-lg object-contain shadow-sm"
                />
              ) : (
                <Image
                  src={image.url}
                  alt={`Preview of ${image.file.name}`}
                  width={image.width}
                  height={image.height}
                  unoptimized
                  className="max-h-[420px] w-auto max-w-full rounded-lg object-contain shadow-sm"
                />
              )}

              {(isProcessing || isLoadingImage) && (
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
                    {isLoadingImage ? "Loading image…" : "Processing…"}
                  </p>
                </div>
              )}

              {output ? (
                <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                  <CheckCircle2 className="size-3.5" aria-hidden="true" />
                  Result ready
                </span>
              ) : null}
            </div>

            {/* Tool-specific controls */}
            <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              {children(api)}

              {error ? (
                <p
                  role="alert"
                  className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700"
                >
                  <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  {error}
                </p>
              ) : null}
            </div>
          </div>

          {/* Result summary + download */}
          {output ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900">
                    {output.name}
                  </p>
                  <p className="mt-0.5 text-sm text-gray-500">
                    {outputMeta ?? `${formatBytes(output.blob.size)} · ${output.width} × ${output.height} px`}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={resetOutput}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:border-gray-400"
                  >
                    <RefreshCw className="size-4" aria-hidden="true" />
                    Adjust settings
                  </button>
                  <button
                    type="button"
                    onClick={() => downloadBlob(output.blob, output.name)}
                    className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-accent-strong"
                  >
                    <Download className="size-4" aria-hidden="true" />
                    Download
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
