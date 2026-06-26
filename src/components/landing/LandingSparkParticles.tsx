"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";
import { SparkIcon } from "@/components/ui/SparkIcon";

const COUNT = 14;

export function LandingSparkParticles() {
  const reduced = useReducedMotion();

  const particles = useMemo(
    () =>
      Array.from({ length: COUNT }, (_, i) => ({
        id: i,
        left: `${8 + ((i * 17) % 84)}%`,
        top: `${12 + ((i * 23) % 76)}%`,
        size: 12 + (i % 4) * 6,
        delay: (i % 7) * 0.35,
        duration: 4 + (i % 5),
      })),
    []
  );

  if (reduced) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute opacity-20"
          style={{ left: p.left, top: p.top }}
          animate={{
            y: [0, -18, 0],
            opacity: [0.12, 0.35, 0.12],
            rotate: [0, 12, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <SparkIcon size={p.size} />
        </motion.div>
      ))}
    </div>
  );
}
