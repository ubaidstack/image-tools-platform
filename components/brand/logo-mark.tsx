type LogoMarkProps = {
  /** Sizing and layout classes for the SVG. */
  className?: string;
  /**
   * Gradient id namespace. Give each placement its own prefix so several
   * marks can render in one document without colliding ids.
   */
  idPrefix?: string;
};

/**
 * FixShrink brand mark: an image frame being squeezed by two inward arrows.
 *
 * Pure vector, no text, transparent background. Drawn on a 64-unit grid with
 * bold geometry so it stays readable at favicon sizes.
 */
export function LogoMark({ className, idPrefix = "fixshrink" }: LogoMarkProps) {
  const frameId = `${idPrefix}-logo-frame`;
  const fillId = `${idPrefix}-logo-fill`;

  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient
          id={frameId}
          x1="13"
          y1="10"
          x2="51"
          y2="54"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#22D3EE" />
          <stop offset=".5" stopColor="#3B82F6" />
          <stop offset="1" stopColor="#5267F5" />
        </linearGradient>
        <linearGradient
          id={fillId}
          x1="18"
          y1="44"
          x2="46"
          y2="24"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#22D3EE" />
          <stop offset="1" stopColor="#3B82F6" />
        </linearGradient>
      </defs>

      {/* Image frame */}
      <rect
        x="15"
        y="12"
        width="34"
        height="40"
        rx="10.5"
        stroke={`url(#${frameId})`}
        strokeWidth="5.5"
      />

      {/* Photo motif: sun and mountains */}
      <circle cx="25.5" cy="24.5" r="2.9" fill={`url(#${fillId})`} />
      <path
        d="M21.5 43.5 28 34.5l5 6 3.5-4.5 6 7.5z"
        fill={`url(#${fillId})`}
      />

      {/* Compression arrows squeezing the frame */}
      <path d="M3 27.5h5.5v-4.5L16 32l-7.5 9v-4.5H3z" fill={`url(#${fillId})`} />
      <path
        d="M61 27.5h-5.5v-4.5L48 32l7.5 9v-4.5H61z"
        fill={`url(#${fillId})`}
      />
    </svg>
  );
}
