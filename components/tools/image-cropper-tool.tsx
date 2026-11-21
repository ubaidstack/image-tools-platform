"use client";

import { useCallback, useState } from "react";
import Cropper from "react-easy-crop";
import { Crop } from "lucide-react";
import { ToolWorkspace, type WorkspaceApi } from "@/components/tools/tool-workspace";
import {
  ToggleGroup,
} from "@/components/tools/controls";
import {
  canvasToBlob,
  createOutput,
  fitToCanvasLimit,
  formatBytes,
  withExtension,
  yieldToUi,
} from "@/lib/image/processing";
import type { Area } from "react-easy-crop";

const ACCEPT = ["image/jpeg", "image/png", "image/webp"] as const;

const ASPECT_OPTIONS = [
  { value: "free", label: "Free" },
  { value: "1", label: "1:1" },
  { value: "1.3333333", label: "4:3" },
  { value: "1.5", label: "3:2" },
  { value: "1.7777778", label: "16:9" },
  { value: "0.5625", label: "9:16" },
] as const;

/**
 * Image Cropper: interactive crop selection with aspect-ratio presets
 * and free cropping, producing a preview and downloadable result.
 */
export function ImageCropperTool() {
  const [aspect, setAspect] = useState<string>("free");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropComplete = useCallback((_area: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  const applyCrop = async (api: WorkspaceApi) => {
    const { image, setProcessing, setOutput, setError } = api;
    if (!croppedAreaPixels) {
      setError("Please select a crop area first.");
      return;
    }
    setProcessing(true);
    setError(null);
    try {
      const image_ = new Image();
      image_.src = image.url;
      await image_.decode();

      const area = croppedAreaPixels;
      const fitted = fitToCanvasLimit(area.width, area.height);
      const canvas = document.createElement("canvas");
      canvas.width = fitted.width;
      canvas.height = fitted.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas is not supported in this browser.");
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(
        image_,
        area.x,
        area.y,
        area.width,
        area.height,
        0,
        0,
        canvas.width,
        canvas.height
      );
      await yieldToUi();

      const blob = await canvasToBlob(
        canvas,
        image.file.type as "image/jpeg" | "image/png" | "image/webp"
      );
      const output = await createOutput(
        blob,
        withExtension(image.file.name, image.file.type === "image/jpeg" ? "jpg" : image.file.type === "image/webp" ? "webp" : "png"),
        canvas.width,
        canvas.height
      );
      const limitNote = fitted.limited
        ? ` · Scaled down to stay within browser canvas limits`
        : "";
      setOutput(
        output,
        `${formatBytes(blob.size)} · cropped to ${canvas.width} × ${canvas.height} px (was ${image.width} × ${image.height} px)${limitNote}`
      );
    } catch (processError) {
      setError(
        processError instanceof Error
          ? processError.message
          : "Cropping failed. Please try again."
      );
    } finally {
      setProcessing(false);
    }
  };

  return (
    <ToolWorkspace
      accept={ACCEPT}
      formatsLabel="JPG, PNG, WebP"
      renderPreview={(api) => (
        <div className="relative h-[340px] w-full overflow-hidden rounded-lg bg-gray-900 sm:h-[420px]">
          <Cropper
            image={api.image.url}
            crop={crop}
            zoom={zoom}
            aspect={aspect === "free" ? undefined : Number(aspect)}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            showGrid
            objectFit="contain"
            classes={{ containerClassName: "rounded-lg" }}
          />
        </div>
      )}
    >
      {(api) => (
        <>
          <ToggleGroup
            ariaLabel="Aspect ratio"
            options={ASPECT_OPTIONS.map((option) => ({
              value: option.value,
              label: option.label,
            }))}
            value={aspect}
            onChange={setAspect}
            disabled={api.isProcessing}
          />
          <div>
            <span className="mb-1.5 block text-sm font-medium text-gray-700">
              Zoom
            </span>
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              disabled={api.isProcessing}
              aria-label={`Zoom: ${zoom.toFixed(1)}x`}
              onChange={(event) => setZoom(Number(event.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-gray-200 accent-[var(--color-accent)] disabled:opacity-50"
            />
          </div>
          <p className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-600">
            Drag the image to choose the crop area. With “Free”, the corners
            of the crop box can be dragged to any shape.
          </p>
          <button
            type="button"
            onClick={() => applyCrop(api)}
            disabled={api.isProcessing || !croppedAreaPixels}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Crop className="size-4" aria-hidden="true" />
            Apply crop
          </button>
        </>
      )}
    </ToolWorkspace>
  );
}
