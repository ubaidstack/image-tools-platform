"use client";

import { useState } from "react";
import { Target } from "lucide-react";
import { ToolWorkspace, type WorkspaceApi } from "@/components/tools/tool-workspace";
import {
  ActionButton,
  Field,
  NumberField,
  SelectField,
  ToggleGroup,
} from "@/components/tools/controls";
import {
  canvasToBlob,
  createOutput,
  drawImageRegion,
  fitToCanvasLimit,
  formatBytes,
  loadImageFromUrl,
  withExtension,
  yieldToUi,
} from "@/lib/image/processing";

const ACCEPT = ["image/jpeg", "image/png", "image/webp"] as const;

const TARGET_PRESETS = ["50", "100", "200", "500"] as const;

type TargetFormat = "image/jpeg" | "image/webp";

type CompressToTargetResult = {
  blob: Blob;
  width: number;
  height: number;
  /** True when the result is at or under the target size. */
  achieved: boolean;
};

/**
 * Binary-search the encoder quality, then progressively scale the image
 * down if needed. Returns the closest result found under the target, or
 * the best (smallest) attempt if the target is unreachable.
 */
async function compressToTargetSize(
  source: HTMLImageElement,
  naturalWidth: number,
  naturalHeight: number,
  targetBytes: number,
  format: TargetFormat
): Promise<CompressToTargetResult> {
  const MIN_QUALITY = 0.05;
  const MAX_QUALITY = 0.95;
  const SEARCH_ITERATIONS = 6;
  const MAX_SCALE_STEPS = 8;

  let scale = 1;
  let best: { blob: Blob; width: number; height: number; quality: number } | null = null;

  for (let step = 0; step <= MAX_SCALE_STEPS; step++) {
    const width = Math.max(1, Math.round(naturalWidth * scale));
    const height = Math.max(1, Math.round(naturalHeight * scale));

    let low = MIN_QUALITY;
    let high = MAX_QUALITY;
    let stepBest: { blob: Blob; quality: number } | null = null;

    // Find the highest quality that stays under the target at this scale.
    for (let i = 0; i < SEARCH_ITERATIONS; i++) {
      const quality = (low + high) / 2;
      const canvas = drawImageRegion(source, { width, height });
      const blob = await canvasToBlob(canvas, format, quality);
      if (blob.size <= targetBytes) {
        stepBest = { blob, quality };
        low = quality; // try higher quality
      } else {
        high = quality; // need smaller output
      }
      await yieldToUi();
      if (high - low < 0.01) break;
    }

    if (stepBest) {
      best = { blob: stepBest.blob, width, height, quality: stepBest.quality };
      break; // under target at this scale — largest usable quality found
    }

    if (step === MAX_SCALE_STEPS) break;

    scale *= 0.75; // still too large — shrink and try again
  }

  if (best) {
    return { blob: best.blob, width: best.width, height: best.height, achieved: true };
  }

  // Target unreachable: fall back to the smallest output we could make.
  scale = Math.max(scale, 0.05);
  for (let attempt = 0; attempt < 3; attempt++) {
    const width = Math.max(1, Math.round(naturalWidth * scale));
    const height = Math.max(1, Math.round(naturalHeight * scale));
    const canvas = drawImageRegion(source, { width, height });
    const blob = await canvasToBlob(canvas, format, MIN_QUALITY);
    if (!best || blob.size < best.blob.size) {
      best = { blob, width, height, quality: MIN_QUALITY };
    }
    if (blob.size <= targetBytes) {
      best = { blob, width, height, quality: MIN_QUALITY };
      break;
    }
    scale *= 0.6;
    await yieldToUi();
  }

  return {
    blob: best!.blob,
    width: best!.width,
    height: best!.height,
    achieved: best!.blob.size <= targetBytes,
  };
}

/**
 * Image to KB: compress an image towards an exact file-size target.
 * The result clearly states whether the target was achieved.
 */
export function ImageToKbTool() {
  const [preset, setPreset] = useState("100");
  const [customTarget, setCustomTarget] = useState("");
  const [format, setFormat] = useState<TargetFormat>("image/jpeg");

  const resolveTargetBytes = (): number | null => {
    const kb = customTarget !== "" ? Number.parseInt(customTarget, 10) : Number.parseInt(preset, 10);
    if (!Number.isFinite(kb) || kb < 1) return null;
    return kb * 1024;
  };

  const compress = async (api: WorkspaceApi) => {
    const { image, setProcessing, setOutput, setError } = api;
    const targetBytes = resolveTargetBytes();
    if (targetBytes === null) {
      setError("Please enter a target size of at least 1 KB.");
      return;
    }

    setProcessing(true);
    setError(null);
    try {
      const img = await loadImageFromUrl(image.url);
      const fitted = fitToCanvasLimit(image.width, image.height);
      const result = await compressToTargetSize(
        img,
        fitted.width,
        fitted.height,
        targetBytes,
        format
      );
      const ext = format === "image/jpeg" ? "jpg" : "webp";
      const output = await createOutput(
        result.blob,
        withExtension(image.file.name, ext),
        result.width,
        result.height
      );

      const achieved = result.achieved;
      const targetLabel = formatBytes(targetBytes);
      const actualLabel = formatBytes(result.blob.size);
      const meta = (
        <>
          {achieved ? (
            <span className="font-medium text-green-700">
              Target achieved — {actualLabel} (target: {targetLabel})
            </span>
          ) : (
            <span className="font-medium text-amber-700">
              Target not fully reached — smallest possible result is{" "}
              <strong className="text-gray-900">{actualLabel}</strong> vs target{" "}
              {targetLabel}
            </span>
          )}
          {result.width !== image.width || result.height !== image.height ? (
            <span className="block text-gray-500">
              Image was scaled down to {result.width} × {result.height} px to
              get closer to the target.
            </span>
          ) : null}
          {fitted.limited ? (
            <span className="block text-gray-500">
              The source was first scaled to {fitted.width} × {fitted.height} px
              to stay within browser canvas limits.
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
    <ToolWorkspace accept={ACCEPT} formatsLabel="JPG, PNG, WebP">
      {(api) => (
        <>
          <Field label="Target file size">
            <ToggleGroup
              ariaLabel="Target file size presets"
              options={TARGET_PRESETS.map((kb) => ({ value: kb, label: `${kb} KB` }))}
              value={preset}
              onChange={(value) => {
                setPreset(value);
                setCustomTarget("");
              }}
              disabled={api.isProcessing}
            />
          </Field>
          <Field label="Custom target (KB)" hint="Overrides the preset when filled in.">
            <NumberField
              value={customTarget}
              onChange={setCustomTarget}
              suffix="KB"
              ariaLabel="Custom target size in kilobytes"
              disabled={api.isProcessing}
            />
          </Field>
          <Field
            label="Output format"
            hint="JPEG gives the best size control. PNG is lossless and cannot be size-targeted."
          >
            <SelectField
              value={format}
              onChange={(value) => setFormat(value as TargetFormat)}
              options={[
                { value: "image/jpeg", label: "JPG" },
                { value: "image/webp", label: "WebP" },
              ]}
              ariaLabel="Output format"
              disabled={api.isProcessing}
            />
          </Field>
          <ActionButton onClick={() => compress(api)} disabled={api.isProcessing}>
            <Target className="size-4" aria-hidden="true" />
            Compress to target
          </ActionButton>
        </>
      )}
    </ToolWorkspace>
  );
}
