import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "TENEGTA Spark",
    short_name: "TENEGTA",
    description: "حوّل كل متابع إلى عميل حقيقي",
    start_url: "/discover",
    display: "standalone",
    background_color: "#030304",
    theme_color: "#030304",
    lang: "ar",
    dir: "rtl",
    icons: [
      {
        src: "/brand/tenegta-logo.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
