"use client";

import type { ReactNode, MouseEventHandler } from "react";
import { Button } from "@/components/ui/Button";

type CtaSize = "sm" | "md" | "lg";

interface MagneticPrimaryCTAProps {
  href: string;
  label: ReactNode;
  icon?: ReactNode;
  size?: CtaSize;
  className?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}

/** @deprecated Prefer `<Button variant="primary" glow href="..." />` */
export function MagneticPrimaryCTA({
  href,
  label,
  icon,
  size = "lg",
  className,
  onClick,
}: MagneticPrimaryCTAProps) {
  return (
    <Button
      href={href}
      variant="primary"
      glow
      size={size}
      className={className}
      icon={icon}
    >
      {label}
    </Button>
  );
}
