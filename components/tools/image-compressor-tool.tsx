"use client";

import { useState } from "react";
import { Minimize2 } from "lucide-react";
import { ToolWorkspace, type WorkspaceApi } from "@/components/tools/tool-workspace";
import { ActionButton, Field, QualitySlider } from "@/components/tools/controls";
import {
  ACCEPTED_IMAGE_TYPES,
  canvasToBlob,
  createOutput,
  drawImageRegion,
  extForMime,
  fitToCanvasLimit,
  formatBytes,
  labelForMime,
  loadImageFromUrl,
  withExtension,
} from "@/lib/image/processing";

/**
 * Image Compressor: re-encodes the image in the browser at a chosen
 * quality. PNG is lossless, so the quality slider does not apply to it.
 */
export function ImageCompressorTool() {
  const [quality, setQuality] = useState(80);

  const compress = async (api: WorkspaceApi) => {
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
      const blob = await canvasToBlob(canvas, image.file.type as "image/jpeg" | "image/png" | "image/webp", quality / 100);
      const output = await createOutput(
        blob,
        withExtension(image.file.name, extForMime(image.file.type)),
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
              {Math.abs(reduction)}% larger — this image was already well optimised
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
          : "Compression failed. Please try again."
      );
    } finally {
      setProcessing(false);
    }
  };

  return (
    <ToolWorkspace accept={ACCEPTED_IMAGE_TYPES} formatsLabel="JPG, PNG, WebP">
      {(api) => (
        <>
          <Field
            label="Compression quality"
            hint={
              api.image.file.type === "image/png"
                ? "PNG is a lossless format, so quality does not apply. Size reduction is limited — convert to JPG or WebP for smaller files."
                : "Lower quality means a smaller file."
            }
          >
            <QualitySlider value={quality} onChange={setQuality} disabled={api.image.file.type === "image/png"} />
          </Field>
          <ActionButton
            onClick={() => compress(api)}
            disabled={api.isProcessing}
          >
            <Minimize2 className="size-4" aria-hidden="true" />
            Compress {labelForMime(api.image.file.type)} image
          </ActionButton>
        </>
      )}
    </ToolWorkspace>
  );
}
