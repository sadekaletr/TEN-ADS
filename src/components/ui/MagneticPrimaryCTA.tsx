"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { ReactNode, MouseEventHandler } from "react";
import { cn } from "@/lib/utils";
import { useMotionSafe } from "@/lib/motion/useMotionSafe";
import { useMotion } from "@/components/motion/MotionProvider";
import { playTapClick } from "@/lib/sound/sfx";
import { TOKENS } from "@/styles/tokens";

type CtaSize = "sm" | "md" | "lg";

interface MagneticPrimaryCTAProps {
  href: string;
  label: ReactNode;
  icon?: ReactNode;
  size?: CtaSize;
  className?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}

const sizeClass: Record<CtaSize, string> = {
  sm: "rounded-lg px-4 py-2.5 text-sm min-h-11",
  md: "rounded-xl px-5 py-3 text-sm min-h-12",
  lg: "rounded-xl px-6 py-3 text-base min-h-12",
};

export function MagneticPrimaryCTA({
  href,
  label,
  icon,
  size = "lg",
  className,
  onClick,
}: MagneticPrimaryCTAProps) {
  const motionOk = useMotionSafe();
  const { soundEnabled } = useMotion();

  return (
    <motion.span
      className="inline-block"
      whileHover={motionOk ? { scale: 1.02 } : undefined}
      whileTap={motionOk ? { scale: 0.98 } : undefined}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Link
        href={href}
        onClick={(e) => {
          if (soundEnabled) playTapClick();
          onClick?.(e);
        }}
        className={cn(
          "focus-ring inline-flex items-center justify-center gap-2 border border-transparent font-semibold text-accent-foreground transition-[filter] duration-200 hover:brightness-110",
          sizeClass[size],
          className
        )}
        style={{
          background: TOKENS.gradient.buttonPrimary,
          boxShadow: `${TOKENS.shadow.button}, ${TOKENS.shadow.ctaGlow}`,
          minHeight: TOKENS.cta.minHeight,
        }}
      >
        {icon}
        {label}
      </Link>
    </motion.span>
  );
}
