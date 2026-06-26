"use client";

/** Ambient gold aurora blobs behind the hero — CSS-only for performance. */
export function LandingAurora() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="landing-aurora landing-aurora-a" />
      <div className="landing-aurora landing-aurora-b" />
      <div className="landing-aurora landing-aurora-c" />
      <div className="landing-grid-glow" />
    </div>
  );
}
