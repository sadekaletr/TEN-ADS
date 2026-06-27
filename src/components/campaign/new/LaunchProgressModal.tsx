"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Icon } from "@/components/ui/Icon";
import { successSpring } from "@/lib/motion/presets";
import { MOTION } from "@/styles/motion";

const LAUNCH_STEPS = [
  { id: "allocating", label: "Allocating Spark..." },
  { id: "codes", label: "Generating Codes..." },
  { id: "qr", label: "Creating QR..." },
  { id: "publish", label: "Publishing Campaign..." },
] as const;

interface LaunchProgressModalProps {
  open: boolean;
  onComplete: () => void;
}

export function LaunchProgressModal({ open, onComplete }: LaunchProgressModalProps) {
  const reducedMotion = useReducedMotion();
  const [stepIndex, setStepIndex] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!open) {
      setStepIndex(0);
      setDone(false);
      return;
    }
    if (reducedMotion) {
      onComplete();
      return;
    }
    const stepMs = MOTION.slow * 1000;
    const timers: ReturnType<typeof setTimeout>[] = [];
    LAUNCH_STEPS.forEach((_, i) => {
      timers.push(
        setTimeout(() => setStepIndex(i), i * stepMs)
      );
    });
    timers.push(
      setTimeout(() => {
        setDone(true);
        setTimeout(onComplete, stepMs);
      }, LAUNCH_STEPS.length * stepMs)
    );
    return () => timers.forEach(clearTimeout);
  }, [open, onComplete, reducedMotion]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-void/80 p-4 backdrop-blur-sm">
      <GlassCard featured className="w-full max-w-md" innerClassName="p-8">
        <AnimatePresence mode="wait">
          {!done ? (
            <motion.div
              key="progress"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <p className="mb-6 text-center text-sm text-text-secondary">إطلاق الحملة</p>
              <ul className="space-y-4">
                {LAUNCH_STEPS.map((step, i) => {
                  const active = i === stepIndex;
                  const complete = i < stepIndex;
                  return (
                    <li
                      key={step.id}
                      className="flex items-center gap-3 text-sm"
                    >
                      <span
                        className={
                          complete
                            ? "text-gold-1"
                            : active
                              ? "text-gold-2"
                              : "text-text-tertiary"
                        }
                      >
                        {complete ? (
                          <Icon name="check" size={16} />
                        ) : active ? (
                          <Icon name="spinner" size={16} className="animate-spin" />
                        ) : (
                          <span className="inline-block h-4 w-4 rounded-full border border-default" />
                        )}
                      </span>
                      <span className={active ? "text-text-primary" : "text-text-secondary"}>
                        {step.label}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              className="text-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={successSpring}
            >
              <motion.div
                className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gold-2/20 text-gold-1"
                animate={{ scale: [1, 1.05, 1] }}
                transition={successSpring}
              >
                <Icon name="rocket" size={28} />
              </motion.div>
              <p className="font-brand text-2xl font-bold text-gold-1">Campaign Live</p>
            </motion.div>
          )}
        </AnimatePresence>
      </GlassCard>
    </div>
  );
}
