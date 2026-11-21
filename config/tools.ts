import type { LucideIcon } from "lucide-react";
import {
  Crop,
  FileOutput,
  Maximize2,
  Minimize2,
  RefreshCw,
  Replace,
  RotateCw,
  Shrink,
  Target,
} from "lucide-react";

export type ToolCategory = {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
};

export type Tool = {
  name: string;
  /** URL segment under /tools/ */
  slug: string;
  description: string;
  icon: LucideIcon;
  categoryId: ToolCategory["id"];
};

export const toolCategories: ToolCategory[] = [
  {
    id: "compression",
    name: "Image Compression",
    description:
      "Shrink file sizes for faster websites, emails and uploads — without visible quality loss.",
    icon: Shrink,
  },
  {
    id: "conversion",
    name: "Image Conversion",
    description:
      "Convert between JPG, PNG and WebP in one click while keeping your images looking sharp.",
    icon: RefreshCw,
  },
  {
    id: "resizing",
    name: "Image Resizing",
    description:
      "Change image dimensions by pixels, percentage or exact file-size targets in seconds.",
    icon: Maximize2,
  },
  {
    id: "editing",
    name: "Image Editing",
    description:
      "Crop, rotate and fine-tune your photos with simple, browser-based editing tools.",
    icon: Crop,
  },
];

export const tools: Tool[] = [
  {
    name: "Image Compressor",
    slug: "image-compressor",
    description:
      "Reduce JPG, PNG and WebP file sizes without losing visible quality.",
    icon: Minimize2,
    categoryId: "compression",
  },
  {
    name: "Image Resizer",
    slug: "image-resizer",
    description:
      "Resize images by width, height, pixels or percentage — with aspect ratio lock.",
    icon: Maximize2,
    categoryId: "resizing",
  },
  {
    name: "Image Cropper",
    slug: "image-cropper",
    description:
      "Crop images to the perfect frame or a standard aspect ratio like 1:1 and 16:9.",
    icon: Crop,
    categoryId: "editing",
  },
  {
    name: "JPG to PNG",
    slug: "jpg-to-png",
    description:
      "Convert JPG photos into high-quality PNG images with transparency support.",
    icon: Replace,
    categoryId: "conversion",
  },
  {
    name: "PNG to JPG",
    slug: "png-to-jpg",
    description:
      "Convert PNG files into compact, share-friendly JPG images in seconds.",
    icon: FileOutput,
    categoryId: "conversion",
  },
  {
    name: "WebP Converter",
    slug: "webp-converter",
    description:
      "Convert images to or from the modern WebP format for smaller, faster pages.",
    icon: RefreshCw,
    categoryId: "conversion",
  },
  {
    name: "Image to KB",
    slug: "image-to-kb",
    description:
      "Compress an image to an exact size target, such as 100 KB, for forms and uploads.",
    icon: Target,
    categoryId: "compression",
  },
  {
    name: "Image Rotator",
    slug: "image-rotator",
    description:
      "Rotate images 90° or 180°, straighten them, or flip horizontally and vertically.",
    icon: RotateCw,
    categoryId: "editing",
  },
];

/** Count of tools per category, derived from the tool list above. */
export function getToolCount(categoryId: ToolCategory["id"]): number {
  return tools.filter((tool) => tool.categoryId === categoryId).length;
}

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((tool) => tool.slug === slug);
}

export function getToolHref(tool: Tool): string {
  return `/tools/${tool.slug}`;
}
