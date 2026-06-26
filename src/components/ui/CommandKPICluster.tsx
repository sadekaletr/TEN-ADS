"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import { transition } from "@/lib/motion/tokens";
import { TOKENS } from "@/styles/tokens";

interface KpiSecondary {
  label: string;
  value: ReactNode;
  trend?: string;
}

interface CommandKPIClusterProps {
  primary: { label: string; value: ReactNode; meta?: string };
  secondary: [KpiSecondary] | [KpiSecondary, KpiSecondary];
  primaryAction?: {
    href: string;
    label: string;
    icon?: ReactNode;
    onClick?: () => void;
  };
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
      <motion.section
        aria-label={primary.label}
        className="relative overflow-hidden rounded-2xl border border-strong bg-surface-stack p-6 shadow-pricing-featured md:p-8"
        initial={reducedMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={transition.normal}
      >
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-36 opacity-60"
          style={{ background: TOKENS.gradient.spotlightHero }}
          aria-hidden
        />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-medium text-text-secondary">{primary.label}</p>
            <p className="mt-2 font-brand text-4xl leading-none text-gold-accent md:text-5xl [&_.font-mono]:font-mono [&_.font-mono]:tabular-nums">
              {primary.value}
            </p>
            {primary.meta && (
              <p className="mt-2 flex items-center gap-1.5 text-xs text-text-tertiary">
                <Icon name="spark" size={14} className="shrink-0 text-gold-3" />
                {primary.meta}
              </p>
            )}
          </div>
          <div className="flex w-full flex-col gap-2 sm:flex-row sm:flex-wrap lg:w-auto lg:justify-end">
            {primaryAction && (
              <Button
                href={primaryAction.href}
                variant="primary"
                glow
                size="lg"
                className="min-h-12 w-full sm:w-auto"
                icon={primaryAction.icon}
                onClick={primaryAction.onClick}
              >
                {primaryAction.label}
              </Button>
            )}
            {secondaryAction && (
              <Button
                href={secondaryAction.href}
                variant="secondary"
                size="lg"
                className="min-h-12 w-full sm:w-auto"
              >
                {secondaryAction.label}
              </Button>
            )}
          </div>
        </div>
      </motion.section>

      <div className="grid gap-3 sm:grid-cols-2">
        {secondary.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            className="rounded-xl border border-strong bg-bg-elevated/90 px-4 py-4 shadow-surface"
            initial={reducedMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...transition.fast, delay: reducedMotion ? 0 : 0.05 * (i + 1) }}
          >
            <p className="text-xs font-medium uppercase tracking-wide text-text-tertiary">
              {kpi.label}
            </p>
            <p className="mt-1.5 font-mono text-xl font-semibold tabular-nums text-text-primary">
              {kpi.value}
            </p>
            {kpi.trend && (
              <p className="mt-1 text-xs text-text-secondary">{kpi.trend}</p>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
