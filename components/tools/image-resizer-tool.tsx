"use client";

import { useState } from "react";
import { Maximize2, Link2, Link2Off } from "lucide-react";
import { ToolWorkspace, type WorkspaceApi } from "@/components/tools/tool-workspace";
import { Field } from "@/components/tools/controls";
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_CANVAS_DIMENSION,
  MAX_CANVAS_PIXELS,
  canvasToBlob,
  createOutput,
  drawImageRegion,
  extForMime,
  formatBytes,
  formatPixels,
  isCanvasSizeAllowed,
  labelForMime,
  loadImageFromUrl,
  withExtension,
} from "@/lib/image/processing";
import { cn } from "@/lib/utils";

const WIDTH_PRESETS = [1920, 1600, 1280, 1024, 800, 640, 320];

type OutputFormat = "same" | "image/jpeg" | "image/png" | "image/webp";

/**
 * Image Resizer: custom width/height with aspect-ratio lock, width
 * presets, and an output-format choice.
 *
 * Field values are derived from the image when empty, so no state
 * syncing effects are needed.
 */
export function ImageResizerTool() {
  const [widthInput, setWidthInput] = useState("");
  const [heightInput, setHeightInput] = useState("");
  const [lockRatio, setLockRatio] = useState(true);
  const [format, setFormat] = useState<OutputFormat>("same");
  const [quality, setQuality] = useState(92);

  const resize = async (api: WorkspaceApi) => {
    const { image, setProcessing, setOutput, setError } = api;
    const width = widthInput === "" ? image.width : Number.parseInt(widthInput, 10);
    const height = heightInput === "" ? image.height : Number.parseInt(heightInput, 10);

    if (!Number.isFinite(width) || !Number.isFinite(height) || width < 1 || height < 1) {
      setError("Please enter a width and height of at least 1 pixel.");
      return;
    }
    if (!isCanvasSizeAllowed(width, height)) {
      setError(
        `The requested size (${width} × ${height} px) is too large for the browser. The maximum is ${MAX_CANVAS_DIMENSION} px per side and ${formatPixels(MAX_CANVAS_PIXELS)}.`
      );
      return;
    }

    setProcessing(true);
    setError(null);
    try {
      const img = await loadImageFromUrl(image.url);
      const canvas = drawImageRegion(img, { width, height });
      const targetMime = format === "same" ? image.file.type : format;
      const lossy = targetMime !== "image/png";
      const blob = await canvasToBlob(
        canvas,
        targetMime as "image/jpeg" | "image/png" | "image/webp",
        lossy ? quality / 100 : undefined
      );
      const output = await createOutput(
        blob,
        withExtension(image.file.name, extForMime(targetMime)),
        canvas.width,
        canvas.height
      );
      setOutput(
        output,
        `${formatBytes(blob.size)} · resized from ${image.width} × ${image.height} px`
      );
    } catch (processError) {
      setError(
        processError instanceof Error
          ? processError.message
          : "Resizing failed. Please try again."
      );
    } finally {
      setProcessing(false);
    }
  };

  return (
    <ToolWorkspace accept={ACCEPTED_IMAGE_TYPES} formatsLabel="JPG, PNG, WebP">
      {(api) => {
        const image = api.image;
        const ratio = image.width / image.height;

        const width = widthInput === "" ? image.width : Number.parseInt(widthInput, 10);
        const height = heightInput === "" ? image.height : Number.parseInt(heightInput, 10);
        const isValid =
          Number.isFinite(width) && Number.isFinite(height) && width >= 1 && height >= 1;
        const withinLimits = isValid && isCanvasSizeAllowed(width, height);

        const changeWidth = (raw: string) => {
          setWidthInput(raw);
          if (lockRatio) {
            const w = Number.parseInt(raw, 10);
            setHeightInput(Number.isFinite(w) && w >= 1 ? String(Math.max(1, Math.round(w / ratio))) : "");
          }
        };

        const changeHeight = (raw: string) => {
          setHeightInput(raw);
          if (lockRatio) {
            const h = Number.parseInt(raw, 10);
            setWidthInput(Number.isFinite(h) && h >= 1 ? String(Math.max(1, Math.round(h * ratio))) : "");
          }
        };

        const effectiveFormat = format === "same" ? image.file.type : format;

        return (
          <>
            <Field label="Presets" hint="Presets set the width and keep the aspect ratio.">
              <div className="flex flex-wrap gap-1.5">
                {WIDTH_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    disabled={api.isProcessing}
                    onClick={() => changeWidth(String(preset))}
                    className={cn(
                      "rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
                      width === preset
                        ? "border-accent bg-accent-soft text-accent"
                        : "border-gray-300 bg-white text-gray-600 hover:border-gray-400 hover:text-gray-900"
                    )}
                  >
                    {preset}w
                  </button>
                ))}
              </div>
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Width">
                <input
                  type="text"
                  inputMode="numeric"
                  value={widthInput === "" ? String(image.width) : widthInput}
                  disabled={api.isProcessing}
                  aria-label="Width in pixels"
                  onChange={(event) => changeWidth(event.target.value.replace(/[^0-9]/g, ""))}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none disabled:opacity-50"
                />
              </Field>
              <Field label="Height">
                <input
                  type="text"
                  inputMode="numeric"
                  value={heightInput === "" ? String(image.height) : heightInput}
                  disabled={api.isProcessing}
                  aria-label="Height in pixels"
                  onChange={(event) => changeHeight(event.target.value.replace(/[^0-9]/g, ""))}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none disabled:opacity-50"
                />
              </Field>
            </div>

            <p className="text-xs text-gray-500">
              Maximum output: {MAX_CANVAS_DIMENSION} px per side and{" "}
              {formatPixels(MAX_CANVAS_PIXELS)} total.
            </p>

            {isValid && !withinLimits ? (
              <p
                role="alert"
                className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800"
              >
                This size is too large for the browser. Please choose smaller
                dimensions.
              </p>
            ) : null}

            <button
              type="button"
              disabled={api.isProcessing}
              aria-pressed={lockRatio}
              onClick={() => setLockRatio((locked) => !locked)}
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 transition-colors hover:text-accent disabled:opacity-50"
            >
              {lockRatio ? (
                <Link2 className="size-4 text-accent" aria-hidden="true" />
              ) : (
                <Link2Off className="size-4 text-gray-400" aria-hidden="true" />
              )}
              {lockRatio ? "Aspect ratio locked" : "Aspect ratio unlocked"}
            </button>

            <Field label="Output format">
              <select
                value={format}
                disabled={api.isProcessing}
                aria-label="Output format"
                onChange={(event) => setFormat(event.target.value as OutputFormat)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none disabled:opacity-50"
              >
                <option value="same">Keep {labelForMime(image.file.type)}</option>
                <option value="image/jpeg">JPG</option>
                <option value="image/png">PNG</option>
                <option value="image/webp">WebP</option>
              </select>
            </Field>

            {effectiveFormat !== "image/png" ? (
              <Field label="Quality">
                <input
                  type="range"
                  min={10}
                  max={100}
                  value={quality}
                  disabled={api.isProcessing}
                  aria-label={`Quality: ${quality}%`}
                  onChange={(event) => setQuality(Number(event.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-full bg-gray-200 accent-[var(--color-accent)] disabled:opacity-50"
                />
              </Field>
            ) : null}

            <p className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-600">
              Original: {image.width} × {image.height} px → New:{" "}
              <strong className="text-gray-900">{isValid ? `${width} × ${height} px` : "—"}</strong>
            </p>

            <button
              type="button"
              onClick={() => resize(api)}
              disabled={api.isProcessing || !withinLimits}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Maximize2 className="size-4" aria-hidden="true" />
              Resize image
            </button>
          </>
        );
      }}
    </ToolWorkspace>
  );
}
