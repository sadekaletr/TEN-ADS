import type { MetadataRoute } from "next";
import { BRAND_MANIFEST_ICONS } from "@/lib/brand";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "TENEGTA Spark",
    short_name: "TENEGTA",
    description: "حوّل كل متابع إلى عميل حقيقي",
    start_url: "/discover",
    display: "standalone",
    background_color: "#fafaf9",
    theme_color: "#fafaf9",
    lang: "ar",
    dir: "rtl",
    icons: BRAND_MANIFEST_ICONS.map((icon) => ({
      src: icon.src,
      sizes: icon.sizes,
      type: icon.type,
      purpose: icon.purpose,
    })),
  };
}
