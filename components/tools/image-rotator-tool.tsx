"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { FlipHorizontal, FlipVertical, RotateCw } from "lucide-react";
import { ToolWorkspace, type WorkspaceApi } from "@/components/tools/tool-workspace";
import {
  ACCEPTED_IMAGE_TYPES,
  canvasToBlob,
  createOutput,
  drawImageToCanvas,
  extForMime,
  fitToCanvasLimit,
  formatBytes,
  loadImageFromUrl,
  withExtension,
} from "@/lib/image/processing";
import { cn } from "@/lib/utils";

type Transform = {
  /** Cumulative rotation in degrees. */
  rotate: 0 | 90 | 180 | 270;
  flipX: boolean;
  flipY: boolean;
};

const DEFAULT_TRANSFORM: Transform = { rotate: 0, flipX: false, flipY: false };

/**
 * Transform state lives in a tiny external store so the preview (left
 * column) and the controls (right column) can share it, and so it can
 * be reset whenever a different image is chosen.
 */
let transformState: Transform = DEFAULT_TRANSFORM;
const listeners = new Set<() => void>();

function notify() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

const getTransform = () => transformState;

function updateTransform(patch: Partial<Transform>) {
  transformState = { ...transformState, ...patch };
  notify();
}

function resetTransform() {
  transformState = DEFAULT_TRANSFORM;
  notify();
}

/** Image Rotator: rotate 90°/180°/270° and flip horizontally or
 * vertically, with a live canvas preview and full-resolution output.
 */
export function ImageRotatorTool() {
  return (
    <ToolWorkspace
      accept={ACCEPTED_IMAGE_TYPES}
      formatsLabel="JPG, PNG, WebP"
      renderPreview={(api) => <RotatorPreview api={api} />}
    >
      {(api) => <RotatorControls api={api} />}
    </ToolWorkspace>
  );
}

/** Live-transformed preview drawn onto a display-sized canvas. */
function RotatorPreview({ api }: { api: WorkspaceApi }) {
  const transform = useSyncExternalStore(subscribe, getTransform);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Reset the transform whenever a different image is loaded.
  useEffect(() => {
    resetTransform();
  }, [api.image.url]);

  useEffect(() => {
    let cancelled = false;
    const draw = async () => {
      try {
        const img = await loadImageFromUrl(api.image.url);
        if (cancelled) return;
        const fitted = drawImageToCanvas(img, transform);
        const canvas = canvasRef.current;
        if (!canvas) return;
        const maxSide = 640;
        const scale = Math.min(1, maxSide / Math.max(fitted.width, fitted.height));
        canvas.width = Math.max(1, Math.round(fitted.width * scale));
        canvas.height = Math.max(1, Math.round(fitted.height * scale));
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(fitted, 0, 0, canvas.width, canvas.height);
      } catch {
        // Non-fatal: the apply path surfaces real errors.
      }
    };
    void draw();
    return () => {
      cancelled = true;
    };
  }, [api.image.url, transform]);

  return (
    <canvas
      ref={canvasRef}
      aria-label="Rotated preview"
      className="max-h-[420px] w-auto max-w-full rounded-lg shadow-sm"
    />
  );
}

function RotatorControls({ api }: { api: WorkspaceApi }) {
  const transform = useSyncExternalStore(subscribe, getTransform);

  const apply = async () => {
    const { image, setProcessing, setOutput, setError } = api;
    setProcessing(true);
    setError(null);
    try {
      const img = await loadImageFromUrl(image.url);
      const fitted = fitToCanvasLimit(image.width, image.height);
      const canvas = drawImageToCanvas(img, transform);
      const blob = await canvasToBlob(
        canvas,
        image.file.type as "image/jpeg" | "image/png" | "image/webp"
      );
      const output = await createOutput(
        blob,
        withExtension(image.file.name, extForMime(image.file.type)),
        canvas.width,
        canvas.height
      );
      const limitNote = fitted.limited
        ? ` · Scaled to ${canvas.width} × ${canvas.height} px to stay within browser canvas limits`
        : "";
      setOutput(
        output,
        `${formatBytes(blob.size)} · ${canvas.width} × ${canvas.height} px${limitNote}`
      );
    } catch (processError) {
      setError(
        processError instanceof Error
          ? processError.message
          : "Could not process the image. Please try again."
      );
    } finally {
      setProcessing(false);
    }
  };

  return (
    <>
      <p className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-600">
        The preview updates as you rotate and flip. Rotations apply
        clockwise.
      </p>
      <div className="grid grid-cols-2 gap-2">
        {[90, 180, 270].map((degrees) => (
          <button
            key={degrees}
            type="button"
            disabled={api.isProcessing}
            onClick={() =>
              updateTransform({
                rotate: (((transform.rotate + degrees) % 360) as Transform["rotate"]),
              })
            }
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:border-accent/40 hover:text-accent disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RotateCw
              className={cn("size-4", degrees === 180 && "-scale-x-100")}
              aria-hidden="true"
            />
            {degrees}°
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          disabled={api.isProcessing}
          aria-pressed={transform.flipX}
          onClick={() => updateTransform({ flipX: !transform.flipX })}
          className={cn(
            "inline-flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium shadow-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50",
            transform.flipX
              ? "border-accent bg-accent-soft text-accent"
              : "border-gray-300 bg-white text-gray-700 hover:border-accent/40 hover:text-accent"
          )}
        >
          <FlipHorizontal className="size-4" aria-hidden="true" />
          Flip H
        </button>
        <button
          type="button"
          disabled={api.isProcessing}
          aria-pressed={transform.flipY}
          onClick={() => updateTransform({ flipY: !transform.flipY })}
          className={cn(
            "inline-flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium shadow-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50",
            transform.flipY
              ? "border-accent bg-accent-soft text-accent"
              : "border-gray-300 bg-white text-gray-700 hover:border-accent/40 hover:text-accent"
          )}
        >
          <FlipVertical className="size-4" aria-hidden="true" />
          Flip V
        </button>
      </div>
      <button
        type="button"
        onClick={apply}
        disabled={api.isProcessing}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-50"
      >
        <RotateCw className="size-4" aria-hidden="true" />
        Apply rotation
      </button>
    </>
  );
}
