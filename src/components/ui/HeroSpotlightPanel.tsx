"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { LandingAurora } from "@/components/landing/LandingAurora";
import { LandingSparkParticles } from "@/components/landing/LandingSparkParticles";
import { TOKENS } from "@/styles/tokens";

interface HeroSpotlightPanelProps {
  eyebrow?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  children?: ReactNode;
  visual?: ReactNode;
  className?: string;
}

export function HeroSpotlightPanel({
  eyebrow,
  title,
  subtitle,
  children,
  visual,
  className,
}: HeroSpotlightPanelProps) {
  const reducedMotion = useReducedMotion();
  const fadeUp = (delay: number) =>
    reducedMotion
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.55, delay, ease: "easeOut" as const },
        };

  return (
    <section
      className={cn(
        "relative min-h-[88vh] overflow-hidden px-6 py-16 md:py-24",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0">
        <LandingAurora />
        <LandingSparkParticles />
      </div>
      <div className="hero-spotlight pointer-events-none absolute inset-0" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{ background: TOKENS.gradient.heroGlow }}
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2 lg:gap-10">
        <div className="text-center lg:text-start">
          {eyebrow && <motion.div {...fadeUp(0)}>{eyebrow}</motion.div>}
          <motion.div {...fadeUp(0.1)}>
            <div className={`${TOKENS.type.heroTitle} font-brand text-text-primary`}>
              {title}
            </div>
          </motion.div>
          {subtitle && (
            <motion.div {...fadeUp(0.2)}>
              <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-warm-white/85 lg:mx-0">
                {subtitle}
              </p>
            </motion.div>
          )}
          {children && (
            <motion.div className="mt-10" {...fadeUp(0.3)}>
              {children}
            </motion.div>
          )}
        </div>
        {visual && (
          <motion.div
            className="relative flex justify-center lg:justify-end"
            initial={reducedMotion ? false : { opacity: 0, scale: 0.94, y: 32 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <div className="landing-hero-glow absolute inset-0 -z-10 scale-110 rounded-full blur-3xl" />
            <div className="w-full max-w-md">{visual}</div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
