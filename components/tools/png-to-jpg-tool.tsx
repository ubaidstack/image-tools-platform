"use client";

import { useState } from "react";
import { FileOutput } from "lucide-react";
import { ToolWorkspace, type WorkspaceApi } from "@/components/tools/tool-workspace";
import { ActionButton, ColorField, Field } from "@/components/tools/controls";
import {
  canvasToBlob,
  createOutput,
  drawImageRegion,
  fitToCanvasLimit,
  formatBytes,
  loadImageFromUrl,
  withExtension,
} from "@/lib/image/processing";

const ACCEPT = ["image/png"] as const;

/**
 * PNG to JPG: flattens transparency onto a user-chosen background
 * colour and encodes a JPG.
 */
export function PngToJpgTool() {
  const [background, setBackground] = useState("#ffffff");

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
        background,
      });
      const blob = await canvasToBlob(canvas, "image/jpeg", 0.92);
      const output = await createOutput(
        blob,
        withExtension(image.file.name, "jpg"),
        canvas.width,
        canvas.height
      );
      const delta = blob.size - image.file.size;
      const sizeNote =
        delta < 0
          ? `${formatBytes(image.file.size)} → ${formatBytes(blob.size)} · ${Math.round((-delta / image.file.size) * 100)}% smaller`
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
    <ToolWorkspace accept={ACCEPT} formatsLabel="PNG">
      {(api) => (
        <>
          <p className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-600">
            Convert your PNG into a compact JPG. JPG has no transparency, so
            transparent areas are filled with the colour below.
          </p>
          <Field label="Background colour" hint="Used for transparent areas of the PNG.">
            <ColorField value={background} onChange={setBackground} />
          </Field>
          <ActionButton onClick={() => convert(api)} disabled={api.isProcessing}>
            <FileOutput className="size-4" aria-hidden="true" />
            Convert to JPG
          </ActionButton>
        </>
      )}
    </ToolWorkspace>
  );
}
