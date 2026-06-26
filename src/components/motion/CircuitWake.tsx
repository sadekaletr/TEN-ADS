"use client";

import { motion } from "framer-motion";
import { useMotion } from "@/components/motion/MotionProvider";
import { duration, transition } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface CircuitWakeProps {
  intensity?: "light" | "normal" | "strong";
  className?: string;
}

export function CircuitWake({
  intensity = "normal",
  className,
}: CircuitWakeProps) {
  const { circuitWakeEnabled } = useMotion();

  const opacity =
    intensity === "light" ? 0.04 : intensity === "strong" ? 0.1 : 0.06;

  if (!circuitWakeEnabled) {
    return (
      <div
        className={cn("pointer-events-none fixed inset-0 -z-10 bg-circuit-grid", className)}
        aria-hidden
      />
    );
  }

  return (
    <div className={cn("pointer-events-none fixed inset-0 -z-10 overflow-hidden", className)} aria-hidden>
      <motion.div
        className="absolute inset-0 bg-circuit-grid"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: duration.slow, ease: transition.normal.ease }}
      />
      <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
        {[0, 1, 2, 3].map((i) => (
          <motion.line
            key={i}
            x1="0"
            y1={`${i * 25}%`}
            x2="100%"
            y2={`${i * 25}%`}
            stroke="rgba(212,168,85,0.25)"
            strokeWidth="0.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity }}
            transition={{
              duration: duration.slow,
              delay: i * 0.12,
              ease: transition.normal.ease,
            }}
          />
        ))}
        {[0, 1, 2, 3].map((i) => (
          <motion.line
            key={`v-${i}`}
            x1={`${i * 25}%`}
            y1="0"
            x2={`${i * 25}%`}
            y2="100%"
            stroke="rgba(212,168,85,0.2)"
            strokeWidth="0.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: opacity * 0.8 }}
            transition={{
              duration: duration.slow,
              delay: 0.15 + i * 0.1,
              ease: transition.normal.ease,
            }}
          />
        ))}
      </svg>
    </div>
  );
}
