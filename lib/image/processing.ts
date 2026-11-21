/**
 * Browser-only image processing helpers.
 *
 * Everything here runs locally with HTML Canvas — no file ever leaves
 * the user's device.
 */

export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export type AcceptedImageType = (typeof ACCEPTED_IMAGE_TYPES)[number];

/** Reject absurdly large inputs before decoding them. */
export const MAX_INPUT_BYTES = 30 * 1024 * 1024; // 30 MB

/**
 * Hard source limits. Images above these are rejected after decoding so
 * a corrupt or malicious file cannot exhaust the browser's memory.
 */
export const MAX_SOURCE_DIMENSION = 20_000;
export const MAX_SOURCE_PIXELS = 80_000_000; // 80 MP

/**
 * Largest canvas side we allow. Keeps output compatible with all
 * browsers (Safari caps canvas area far below Chrome) and prevents
 * multi-hundred-megapixel freezes.
 */
export const MAX_CANVAS_DIMENSION = 8192;

/**
 * Largest canvas area we allow. iOS Safari caps canvas memory near
 * 16.7 MP, so staying within that keeps every tool working there.
 */
export const MAX_CANVAS_PIXELS = 16_777_216; // 16.7 MP

/** Human-friendly megapixel label, e.g. 16.7 MP or 80 MP. */
export function formatPixels(pixels: number): string {
  const megapixels = pixels / 1_000_000;
  const rounded =
    megapixels >= 100 ? Math.round(megapixels) : Number(megapixels.toFixed(1));
  return `${rounded} MP`;
}

export type LoadedSourceImage = {
  /** Object URL for previews. Caller owns revoking it. */
  url: string;
  width: number;
  height: number;
};

export function isAcceptedType(type: string): type is AcceptedImageType {
  return (ACCEPTED_IMAGE_TYPES as readonly string[]).includes(type);
}

export function formatBytes(bytes: number): string {
  if (bytes <= 0) {
    return "0 KB";
  }
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

/** Strip the extension from a file name. */
export function baseName(fileName: string): string {
  const dot = fileName.lastIndexOf(".");
  return dot > 0 ? fileName.slice(0, dot) : fileName;
}

/** Replace the extension of a file name. */
export function withExtension(fileName: string, ext: string): string {
  return `${baseName(fileName)}.${ext}`;
}

const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export function extForMime(mime: string): string {
  return MIME_TO_EXT[mime] ?? "img";
}

/** Human label used in the UI ("JPG" for image/jpeg etc.). */
export function labelForMime(mime: string): string {
  const label: Record<string, string> = {
    "image/jpeg": "JPG",
    "image/png": "PNG",
    "image/webp": "WebP",
  };
  return label[mime] ?? mime;
}

/**
 * Decode a selected file for preview and processing.
 * Throws when the browser cannot decode the file (corrupt image).
 */
export async function loadImageFile(file: File): Promise<LoadedSourceImage> {
  const url = URL.createObjectURL(file);
  let image: HTMLImageElement;

  try {
    image = new Image();
    image.src = url;
    await image.decode();
  } catch (error) {
    URL.revokeObjectURL(url);
    throw new Error(
      "This file could not be decoded as an image. It may be corrupted or an unsupported format.",
      { cause: error }
    );
  }

  const width = image.naturalWidth;
  const height = image.naturalHeight;
  if (!width || !height) {
    URL.revokeObjectURL(url);
    throw new Error("Could not read the image dimensions.");
  }

  if (
    width > MAX_SOURCE_DIMENSION ||
    height > MAX_SOURCE_DIMENSION ||
    width * height > MAX_SOURCE_PIXELS
  ) {
    URL.revokeObjectURL(url);
    throw new Error(
      `This image is ${width} × ${height} px, which is larger than the supported maximum of ${MAX_SOURCE_DIMENSION} px per side and ${formatPixels(MAX_SOURCE_PIXELS)}. Please choose a smaller image.`
    );
  }

  return { url, width, height };
}

/** Decode an object URL (e.g. for a second pass on the same image). */
export async function loadImageFromUrl(url: string): Promise<HTMLImageElement> {
  const image = new Image();
  image.src = url;
  await image.decode();
  return image;
}

/**
 * Scale that keeps both sides within MAX_CANVAS_DIMENSION and the total
 * area within MAX_CANVAS_PIXELS. Returns the fitted size and whether any
 * scaling was applied so callers can tell the user.
 */
export function fitToCanvasLimit(
  width: number,
  height: number
): { width: number; height: number; limited: boolean } {
  if (
    width <= MAX_CANVAS_DIMENSION &&
    height <= MAX_CANVAS_DIMENSION &&
    width * height <= MAX_CANVAS_PIXELS
  ) {
    return { width, height, limited: false };
  }

  let scale = 1;
  const largest = Math.max(width, height);
  if (largest > MAX_CANVAS_DIMENSION) {
    scale = MAX_CANVAS_DIMENSION / largest;
  }

  const scaledPixels = width * height * scale * scale;
  if (scaledPixels > MAX_CANVAS_PIXELS) {
    scale *= Math.sqrt(MAX_CANVAS_PIXELS / scaledPixels);
  }

  return {
    width: Math.max(1, Math.floor(width * scale)),
    height: Math.max(1, Math.floor(height * scale)),
    limited: true,
  };
}

/** Whether a requested output size fits the browser canvas limits. */
export function isCanvasSizeAllowed(width: number, height: number): boolean {
  return (
    Number.isFinite(width) &&
    Number.isFinite(height) &&
    width >= 1 &&
    height >= 1 &&
    width <= MAX_CANVAS_DIMENSION &&
    height <= MAX_CANVAS_DIMENSION &&
    width * height <= MAX_CANVAS_PIXELS
  );
}

/** Throw a clear, user-facing error before allocating an oversized canvas. */
function assertCanvasSize(width: number, height: number): void {
  if (!Number.isFinite(width) || !Number.isFinite(height) || width < 1 || height < 1) {
    throw new Error("Please enter an output size of at least 1 × 1 pixel.");
  }
  if (
    width > MAX_CANVAS_DIMENSION ||
    height > MAX_CANVAS_DIMENSION ||
    width * height > MAX_CANVAS_PIXELS
  ) {
    throw new Error(
      `This output size (${Math.round(width)} × ${Math.round(height)} px) is too large for the browser. The maximum is ${MAX_CANVAS_DIMENSION} px per side and ${formatPixels(MAX_CANVAS_PIXELS)}.`
    );
  }
}

export type DrawOptions = {
  /** Horizontal flip. */
  flipX?: boolean;
  /** Vertical flip. */
  flipY?: boolean;
  /** Rotation in degrees (90, 180, 270). */
  rotate?: 0 | 90 | 180 | 270;
  /** Fill colour drawn before the image (used for transparency). */
  background?: string;
};

/**
 * Draw an image to a new canvas at (canvas-limit-fitted) natural size,
 * with optional flip/rotation/background. Output dimensions already
 * account for rotation swapping sides.
 */
export function drawImageToCanvas(
  image: HTMLImageElement,
  options: DrawOptions = {}
): HTMLCanvasElement {
  const { flipX = false, flipY = false, rotate = 0, background } = options;

  const fitted = fitToCanvasLimit(image.naturalWidth, image.naturalHeight);
  const swapSides = rotate === 90 || rotate === 270;
  const outWidth = swapSides ? fitted.height : fitted.width;
  const outHeight = swapSides ? fitted.width : fitted.height;

  assertCanvasSize(outWidth, outHeight);

  const canvas = document.createElement("canvas");
  canvas.width = outWidth;
  canvas.height = outHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not supported in this browser.");

  if (background) {
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, outWidth, outHeight);
  }

  ctx.save();
  ctx.translate(outWidth / 2, outHeight / 2);
  ctx.rotate((rotate * Math.PI) / 180);
  ctx.scale(flipX ? -1 : 1, flipY ? -1 : 1);
  ctx.drawImage(image, -fitted.width / 2, -fitted.height / 2);
  ctx.restore();

  return canvas;
}

/** Basic resize/crop draw (no rotation). */
export function drawImageRegion(
  image: HTMLImageElement,
  opts: { width: number; height: number; sx?: number; sy?: number; sWidth?: number; sHeight?: number; background?: string }
): HTMLCanvasElement {
  const width = Math.max(1, Math.round(opts.width));
  const height = Math.max(1, Math.round(opts.height));
  assertCanvasSize(width, height);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not supported in this browser.");
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  if (opts.background) {
    ctx.fillStyle = opts.background;
    ctx.fillRect(0, 0, width, height);
  }

  if (opts.sx !== undefined) {
    ctx.drawImage(
      image,
      opts.sx,
      opts.sy ?? 0,
      opts.sWidth ?? width,
      opts.sHeight ?? height,
      0,
      0,
      width,
      height
    );
  } else {
    ctx.drawImage(image, 0, 0, width, height);
  }
  return canvas;
}

/**
 * Encode a canvas. Resolves to null-safe blob and rejects when the
 * browser cannot encode the requested type (e.g. WebP on old Safari).
 */
export function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: "image/jpeg" | "image/png" | "image/webp",
  quality?: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("This browser could not encode the image."));
          return;
        }
        if (blob.type !== type) {
          reject(
            new Error(
              `This browser does not support encoding ${labelForMime(type)} images.`
            )
          );
          return;
        }
        resolve(blob);
      },
      type,
      quality
    );
  });
}

export type ToolOutput = {
  blob: Blob;
  /** Object URL for the result preview. Caller owns revoking it. */
  url: string;
  name: string;
  width: number;
  height: number;
};

export async function createOutput(
  blob: Blob,
  name: string,
  width: number,
  height: number
): Promise<ToolOutput> {
  return { blob, url: URL.createObjectURL(blob), name, width, height };
}

/** Trigger a local download of a processed blob. */
export function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  // Give the browser a tick to start the download before revoking.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Yield to the browser so long operations don't lock up the UI.
 * Call between heavy steps (encode loops, multi-pass searches).
 *
 * requestAnimationFrame is throttled in background tabs and can stop
 * firing entirely, which would freeze a long loop. A timeout fallback
 * guarantees progress even when the page is not visible.
 */
export function yieldToUi(): Promise<void> {
  return new Promise((resolve) => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      clearTimeout(fallback);
      resolve();
    };
    const fallback = setTimeout(finish, 50);
    requestAnimationFrame(finish);
  });
}
