import Image from "next/image";
import { cn } from "@/lib/utils";
import { BRAND_ICON_PATH, BRAND_LOGO_PATH } from "@/lib/brand";

export type BrandLogoVariant = "icon" | "logo";

const SIZE_PX = {
  xs: 28,
  nav: 36,
  md: 44,
  footer: 52,
  auth: 88,
  hero: 120,
} as const;

export type BrandLogoSize = keyof typeof SIZE_PX;

export interface BrandLogoProps {
  variant?: BrandLogoVariant;
  size?: BrandLogoSize;
  className?: string;
  priority?: boolean;
}

export function BrandLogo({
  variant = "logo",
  size = "nav",
  className,
  priority = false,
}: BrandLogoProps) {
  const px = SIZE_PX[size];
  const src = variant === "icon" ? BRAND_ICON_PATH : BRAND_LOGO_PATH;

  return (
    <Image
      src={src}
      alt="TENEGTA"
      width={px}
      height={px}
      priority={priority}
      className={cn(
        "shrink-0 object-contain",
        variant === "icon" && "rounded-full ring-1 ring-gold-rich/25 shadow-surface",
        className
      )}
      style={{ width: px, height: px }}
    />
  );
}
