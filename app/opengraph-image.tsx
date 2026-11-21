import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Default social preview image. Uses only the existing placeholder brand
 * name and tagline — no logo or domain is invented here.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 55%, #0e7490 100%)",
          color: "#f8fafc",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "64px",
              height: "64px",
              borderRadius: "16px",
              background: "#0891b2",
              fontSize: "34px",
              fontWeight: 700,
            }}
          >
            {siteConfig.shortName}
          </div>
          <div style={{ display: "flex", fontSize: "26px", letterSpacing: "0.12em", fontWeight: 600 }}>
            {siteConfig.name}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
          <div style={{ display: "flex", fontSize: "68px", fontWeight: 700, lineHeight: 1.1, maxWidth: "960px" }}>
            Edit, convert and compress images in your browser
          </div>
          <div style={{ display: "flex", fontSize: "30px", color: "#cbd5e1" }}>
            {siteConfig.tagline} · No signup · Files stay on your device
          </div>
        </div>

        <div style={{ display: "flex", gap: "16px" }}>
          {siteConfig.formats.map((format) => (
            <div
              key={format}
              style={{
                display: "flex",
                padding: "10px 24px",
                borderRadius: "999px",
                border: "2px solid rgba(203, 213, 225, 0.4)",
                fontSize: "24px",
                fontWeight: 600,
                color: "#e2e8f0",
              }}
            >
              {format}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
