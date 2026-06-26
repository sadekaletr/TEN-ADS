import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };

export function buildOgImage(title: string, subtitle: string, eyebrow?: string) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "radial-gradient(ellipse at top, #16140f 0%, #030304 70%)",
          padding: 64,
        }}
      >
        {eyebrow && (
          <div
            style={{
              fontSize: 22,
              color: "#9a6e20",
              marginBottom: 16,
              letterSpacing: 2,
            }}
          >
            {eyebrow}
          </div>
        )}
        <div
          style={{
            fontSize: 52,
            fontWeight: 700,
            color: "#f0c97a",
            textAlign: "center",
            lineHeight: 1.2,
            maxWidth: 1000,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 28,
            color: "#b8aea0",
            marginTop: 24,
            textAlign: "center",
            maxWidth: 900,
          }}
        >
          {subtitle}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 48,
            fontSize: 20,
            color: "#d4a855",
            letterSpacing: 4,
          }}
        >
          TENEGTA SPARK
        </div>
      </div>
    ),
    ogSize
  );
}
