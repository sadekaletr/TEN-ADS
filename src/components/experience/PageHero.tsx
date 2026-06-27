"use client";

import { memo, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { fadeUp } from "@/lib/motion/variants";
import { transition } from "@/lib/motion/tokens";
import { cn } from "@/lib/utils";

interface PageHeroProps {
  eyebrow?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  meta?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
}

export const PageHero = memo(function PageHero({
  eyebrow,
  title,
  subtitle,
  meta,
  actions,
  children,
  className,
}: PageHeroProps) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.section
      className={cn(
        "relative overflow-hidden rounded-3xl border border-gold-4/20 bg-gradient-to-br from-[#0a0908] via-[#050406] to-[#0d0b08] p-6 md:p-10",
        className
      )}
      initial={reducedMotion ? false : fadeUp.initial}
      animate={fadeUp.animate}
      transition={transition.normal}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(240,201,122,0.12), transparent 70%)",
        }}
        aria-hidden
      />
      <div className="relative z-10 space-y-4">
        {eyebrow && (
          <div className="text-xs font-semibold uppercase tracking-widest text-gold-2">{eyebrow}</div>
        )}
        <h1 className="font-brand text-3xl font-bold text-text-primary md:text-4xl">{title}</h1>
        {subtitle && <p className="max-w-2xl text-base text-text-secondary">{subtitle}</p>}
        {meta && <div className="text-sm text-gold-2">{meta}</div>}
        {actions && <div className="flex flex-wrap gap-3 pt-2">{actions}</div>}
        {children}
      </div>
    </motion.section>
  );
});
