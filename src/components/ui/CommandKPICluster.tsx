"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { MagneticPrimaryCTA } from "@/components/ui/MagneticPrimaryCTA";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { TOKENS } from "@/styles/tokens";

interface KpiSecondary {
  label: string;
  value: ReactNode;
}

interface CommandKPIClusterProps {
  primary: { label: string; value: ReactNode; meta?: string };
  /** At most 2 secondary KPIs (Dub-style ATF clarity) */
  secondary: [KpiSecondary] | [KpiSecondary, KpiSecondary];
  primaryAction?: { href: string; label: string; icon?: ReactNode };
  secondaryAction?: { href: string; label: string };
  className?: string;
}

export function CommandKPICluster({
  primary,
  secondary,
  primaryAction,
  secondaryAction,
  className,
}: CommandKPIClusterProps) {
  const reducedMotion = useReducedMotion();

  return (
    <div className={cn("space-y-4", className)}>
      <motion.div
        className="relative overflow-hidden rounded-2xl border border-strong bg-surface-stack p-6 shadow-pricing-featured"
        initial={reducedMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-32 opacity-50"
          style={{ background: TOKENS.gradient.spotlightHero }}
          aria-hidden
        />
        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm text-text-secondary">{primary.label}</p>
            <p className="mt-1 font-brand text-4xl text-gold-1 md:text-5xl [&_.font-mono]:font-mono">
              {primary.value}
            </p>
            {primary.meta && (
              <p className="mt-1 text-xs text-text-tertiary">{primary.meta}</p>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {primaryAction && (
              <MagneticPrimaryCTA
                href={primaryAction.href}
                label={primaryAction.label}
                icon={primaryAction.icon}
                size="md"
              />
            )}
            {secondaryAction && (
              <Button href={secondaryAction.href} variant="secondary" className="min-h-12">
                {secondaryAction.label}
              </Button>
            )}
          </div>
        </div>
      </motion.div>

      <div className="grid gap-3 sm:grid-cols-2">
        {secondary.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            className="rounded-xl border border-subtle bg-surface-2 px-4 py-3"
            initial={reducedMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 * (i + 1) }}
          >
            <p className="text-xs text-text-tertiary">{kpi.label}</p>
            <p className="mt-1 font-mono text-lg text-text-primary">{kpi.value}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
