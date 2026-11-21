"use client";

import type { ChangeEvent, ReactNode } from "react";
import { cn } from "@/lib/utils";

/* Shared form controls for tool workspaces. */

type FieldProps = {
  label: string;
  hint?: string;
  children: ReactNode;
};

export function Field({ label, hint, children }: FieldProps) {
  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium text-gray-700">
        {label}
      </span>
      {children}
      {hint ? <p className="mt-1.5 text-xs text-gray-500">{hint}</p> : null}
    </div>
  );
}

type QualitySliderProps = {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  min?: number;
  max?: number;
};

export function QualitySlider({
  value,
  onChange,
  disabled = false,
  min = 10,
  max = 100,
}: QualitySliderProps) {
  return (
    <div className="flex items-center gap-3">
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(Number(event.target.value))}
        aria-label={`Quality: ${value}%`}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-gray-200 accent-[var(--color-accent)] disabled:cursor-not-allowed disabled:opacity-50"
      />
      <span className="w-14 shrink-0 rounded-md bg-gray-100 px-2 py-1 text-center text-sm font-medium text-gray-700 tabular-nums">
        {value}%
      </span>
    </div>
  );
}

type SelectFieldProps = {
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  disabled?: boolean;
  ariaLabel?: string;
};

export function SelectField({
  value,
  onChange,
  options,
  disabled = false,
  ariaLabel,
}: SelectFieldProps) {
  return (
    <select
      value={value}
      disabled={disabled}
      aria-label={ariaLabel}
      onChange={(event) => onChange(event.target.value)}
      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

type NumberFieldProps = {
  value: string;
  onChange: (value: string) => void;
  min?: number;
  max?: number;
  suffix?: string;
  ariaLabel?: string;
  disabled?: boolean;
};

export function NumberField({
  value,
  onChange,
  min = 1,
  max,
  suffix,
  ariaLabel,
  disabled = false,
}: NumberFieldProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const next = event.target.value.replace(/[^0-9]/g, "");
    onChange(next);
  };

  return (
    <div className="relative">
      <input
        type="text"
        inputMode="numeric"
        value={value}
        min={min}
        max={max}
        disabled={disabled}
        aria-label={ariaLabel}
        onChange={handleChange}
        className={cn(
          "w-full rounded-lg border border-gray-300 bg-white py-2 text-sm text-gray-900 shadow-sm transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          suffix ? "pr-12" : "px-3"
        )}
      />
      {suffix ? (
        <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs font-medium text-gray-400">
          {suffix}
        </span>
      ) : null}
    </div>
  );
}

type ColorFieldProps = {
  value: string;
  onChange: (value: string) => void;
  presets?: string[];
  disabled?: boolean;
};

export function ColorField({
  value,
  onChange,
  presets = ["#ffffff", "#000000", "#f3f4f6"],
  disabled = false,
}: ColorFieldProps) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={value}
        disabled={disabled}
        aria-label="Background colour"
        onChange={(event) => onChange(event.target.value)}
        className="size-9 shrink-0 cursor-pointer rounded-lg border border-gray-300 bg-white p-1 disabled:cursor-not-allowed"
      />
      {presets.map((preset) => (
        <button
          key={preset}
          type="button"
          disabled={disabled}
          aria-label={`Use colour ${preset}`}
          aria-pressed={value.toLowerCase() === preset.toLowerCase()}
          onClick={() => onChange(preset)}
          className={cn(
            "size-9 shrink-0 rounded-lg border shadow-sm transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50",
            value.toLowerCase() === preset.toLowerCase()
              ? "border-accent ring-2 ring-accent/30"
              : "border-gray-300"
          )}
          style={{ backgroundColor: preset }}
        />
      ))}
    </div>
  );
}

type ActionButtonProps = {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary";
};

export function ActionButton({
  children,
  onClick,
  disabled = false,
  variant = "primary",
}: ActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex w-full items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto",
        variant === "primary"
          ? "bg-accent text-white hover:bg-accent-strong"
          : "border border-gray-300 bg-white text-gray-700 hover:border-gray-400"
      )}
    >
      {children}
    </button>
  );
}

type ToggleGroupProps = {
  options: Array<{ value: string; label: string }>;
  value: string;
  onChange: (value: string) => void;
  ariaLabel?: string;
  disabled?: boolean;
};

/** Segmented-button group for small option sets (e.g. aspect ratios). */
export function ToggleGroup({
  options,
  value,
  onChange,
  ariaLabel,
  disabled = false,
}: ToggleGroupProps) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className="flex flex-wrap gap-1.5"
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          disabled={disabled}
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            "rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
            value === option.value
              ? "border-accent bg-accent-soft text-accent"
              : "border-gray-300 bg-white text-gray-600 hover:border-gray-400 hover:text-gray-900"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
