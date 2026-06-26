"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { SparkIcon } from "@/components/ui/SparkIcon";
import { Button } from "@/components/ui/Button";
import { useLocale } from "@/lib/i18n";
import { JourneyPhaseFrame } from "@/components/landing/JourneyPhaseFrame";

const phaseKeys = ["create", "code", "reveal"] as const;

export function JourneyAutoplay() {
  const { t } = useLocale();
  const reducedMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const phases = phaseKeys.map((key) => ({
    key,
    title: t(`landing.journey.${key}Title`),
    body: t(`landing.journey.${key}Body`),
  }));

  useEffect(() => {
    if (paused || reducedMotion) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % phases.length);
    }, 2800);
    return () => clearInterval(timer);
  }, [paused, reducedMotion, phases.length]);

  const phase = phases[index];

  return (
    <GlassCard className="w-full border-gold-4/30 shadow-[0_0_48px_rgba(212,168,85,0.08)]" innerClassName="p-6 md:p-8">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs text-dim">{t("landing.journey.phaseLabel")}</span>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setPaused((p) => !p)}
          aria-pressed={paused}
        >
          {paused ? t("landing.journey.play") : t("landing.journey.pause")}
        </Button>
      </div>
      <div aria-live="polite" aria-atomic="true">
        <AnimatePresence mode="wait">
          <motion.div
            key={phase.key}
            initial={reducedMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? undefined : { opacity: 0, y: -16 }}
            transition={{ type: "spring", stiffness: 280, damping: 24 }}
            className="min-h-[180px] text-center"
          >
            {phase.key === "reveal" ? (
              <motion.div
                className="flex justify-center"
                animate={reducedMotion ? undefined : { scale: [0.8, 1.15, 1], rotate: [0, 8, 0] }}
                transition={{ duration: 0.8 }}
              >
                <SparkIcon size={56} />
              </motion.div>
            ) : (
              <JourneyPhaseFrame phase={phase.key} />
            )}
            <p className="mt-4 font-brand text-lg text-gold-1">{phase.title}</p>
            <p className="mt-1 text-sm text-dim">{phase.body}</p>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="mt-4 flex justify-center gap-2" role="tablist">
        {phases.map((p, i) => (
          <button
            key={p.key}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={p.title}
            onClick={() => setIndex(i)}
            className={`h-1.5 w-6 rounded-full transition-colors ${
              i === index ? "bg-gold-2" : "bg-surface-2 hover:bg-gold-4/40"
            }`}
          />
        ))}
      </div>
    </GlassCard>
  );
}
