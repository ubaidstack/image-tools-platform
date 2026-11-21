"use client";

import { Replace } from "lucide-react";
import { ToolWorkspace, type WorkspaceApi } from "@/components/tools/tool-workspace";
import {
  canvasToBlob,
  createOutput,
  drawImageRegion,
  fitToCanvasLimit,
  formatBytes,
  loadImageFromUrl,
  withExtension,
} from "@/lib/image/processing";

const ACCEPT = ["image/jpeg"] as const;

/** JPG to PNG: re-encodes a JPEG as a lossless PNG, fully in-browser. */
export function JpgToPngTool() {
  const convert = async (api: WorkspaceApi) => {
    const { image, setProcessing, setOutput, setError } = api;
    setProcessing(true);
    setError(null);
    try {
      const img = await loadImageFromUrl(image.url);
      const fitted = fitToCanvasLimit(img.naturalWidth, img.naturalHeight);
      const canvas = drawImageRegion(img, {
        width: fitted.width,
        height: fitted.height,
      });
      const blob = await canvasToBlob(canvas, "image/png");
      const output = await createOutput(
        blob,
        withExtension(image.file.name, "png"),
        canvas.width,
        canvas.height
      );
      const delta = blob.size - image.file.size;
      const sizeNote =
        delta > 0
          ? `${formatBytes(image.file.size)} → ${formatBytes(blob.size)} · PNG files are usually larger than JPG`
          : `${formatBytes(image.file.size)} → ${formatBytes(blob.size)}`;
      const limitNote = fitted.limited
        ? ` · Scaled down to ${canvas.width} × ${canvas.height} px to stay within browser canvas limits`
        : "";
      setOutput(output, `${sizeNote}${limitNote}`);
    } catch (processError) {
      setError(
        processError instanceof Error
          ? processError.message
          : "Conversion failed. Please try again."
      );
    } finally {
      setProcessing(false);
    }
  };

  return (
    <ToolWorkspace accept={ACCEPT} formatsLabel="JPG">
      {(api) => (
        <>
          <p className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-600">
            Convert your JPG photo into a high-quality PNG. The output keeps
            the original dimensions.
          </p>
          <button
            type="button"
            onClick={() => convert(api)}
            disabled={api.isProcessing}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Replace className="size-4" aria-hidden="true" />
            Convert to PNG
          </button>
        </>
      )}
    </ToolWorkspace>
  );
}
