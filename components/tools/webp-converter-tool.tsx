"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { ToolWorkspace, type WorkspaceApi } from "@/components/tools/tool-workspace";
import { ActionButton, Field, QualitySlider } from "@/components/tools/controls";
import {
  canvasToBlob,
  createOutput,
  drawImageRegion,
  fitToCanvasLimit,
  formatBytes,
  loadImageFromUrl,
  withExtension,
} from "@/lib/image/processing";

const ACCEPT = ["image/jpeg", "image/png"] as const;

/**
 * WebP Converter: re-encodes JPG/PNG input as WebP with a quality
 * control. WebP encoding is not available in every browser; the
 * workspace shows a clear error when that is the case.
 */
export function WebpConverterTool() {
  const [quality, setQuality] = useState(85);

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
      const blob = await canvasToBlob(canvas, "image/webp", quality / 100);
      const output = await createOutput(
        blob,
        withExtension(image.file.name, "webp"),
        canvas.width,
        canvas.height
      );
      const reduction = Math.round(((image.file.size - blob.size) / image.file.size) * 100);
      const meta = (
        <>
          {formatBytes(image.file.size)} → <strong className="text-gray-900">{formatBytes(blob.size)}</strong>
          {" · "}
          {reduction > 0 ? (
            <span className="font-medium text-green-700">{reduction}% smaller</span>
          ) : reduction < 0 ? (
            <span className="font-medium text-amber-700">
              {Math.abs(reduction)}% larger — try a lower quality
            </span>
          ) : (
            "same size"
          )}
          {fitted.limited ? (
            <span className="block text-gray-500">
              Scaled down to {canvas.width} × {canvas.height} px to stay
              within browser canvas limits.
            </span>
          ) : null}
        </>
      );
      setOutput(output, meta);
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
    <ToolWorkspace accept={ACCEPT} formatsLabel="JPG, PNG">
      {(api) => (
        <>
          <p className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-600">
            Convert a JPG or PNG into the modern WebP format for a smaller
            file with similar visual quality.
          </p>
          <Field label="WebP quality" hint="Lower quality means a smaller file.">
            <QualitySlider value={quality} onChange={setQuality} />
          </Field>
          <ActionButton onClick={() => convert(api)} disabled={api.isProcessing}>
            <RefreshCw className="size-4" aria-hidden="true" />
            Convert to WebP
          </ActionButton>
        </>
      )}
    </ToolWorkspace>
  );
}
