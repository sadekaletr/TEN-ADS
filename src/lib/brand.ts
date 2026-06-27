/** Canonical brand asset paths — single source for manifest, SW, metadata */
export const BRAND_ICON_PATH = "/brand/tenegta-icon.png";
export const BRAND_LOGO_PATH = "/brand/tenegta-logo.png";

export const BRAND_MANIFEST_ICONS = [
  {
    src: BRAND_ICON_PATH,
    sizes: "512x512",
    type: "image/png",
    purpose: "any" as const,
  },
  {
    src: BRAND_ICON_PATH,
    sizes: "512x512",
    type: "image/png",
    purpose: "maskable" as const,
  },
];
