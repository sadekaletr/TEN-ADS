"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Icon, type IconName } from "@/components/ui/Icon";
import type { DataDepthElevation } from "@/styles/tokens";
import { TOKENS } from "@/styles/tokens";

interface DataDepthCardProps {
  elevation?: DataDepthElevation;
  title?: string;
  value: ReactNode;
  meta?: ReactNode;
  icon?: IconName;
  featured?: boolean;
  className?: string;
  children?: ReactNode;
}

const elevationStyles: Record<DataDepthElevation, string> = {
  2: "border-subtle bg-surface-2 shadow-surface",
  3: "border-default bg-surface-stack",
  4: "border-strong shadow-pricing-featured bg-surface-stack",
};

export function DataDepthCard({
  elevation = 2,
  title,
  value,
  meta,
  icon,
  featured,
  className,
  children,
}: DataDepthCardProps) {
  const reducedMotion = useReducedMotion();
  const level = featured ? 4 : elevation;

  return (
    <motion.div
      className={cn(
        "relative overflow-hidden rounded-2xl border p-6 text-center",
        elevationStyles[level],
        featured && "ring-1 ring-gold-2/20",
        className
      )}
      initial={reducedMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      {featured && (
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-24 opacity-40"
          style={{ background: TOKENS.gradient.spotlightHero }}
          aria-hidden
        />
      )}
      <div className="relative">
        {icon && <Icon name={icon} size={32} className="mx-auto text-gold-2" />}
        {title && <p className="text-sm text-text-secondary">{title}</p>}
        <div
          className={cn(
            "font-brand text-gold-1",
            featured ? "mt-2 text-4xl md:text-5xl" : "mt-3 text-3xl"
          )}
        >
          {value}
        </div>
        {meta && <p className="mt-2 text-xs text-text-tertiary">{meta}</p>}
        {children}
      </div>
    </motion.div>
  );
}
