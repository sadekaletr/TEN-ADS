"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { onSparkFlow } from "@/lib/spark-flow-events";
import { pulseGlow } from "@/lib/motion";

export function SparkScorePulse({ score }: { score: number }) {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    return onSparkFlow(() => {
      setPulse(true);
      setTimeout(() => setPulse(false), 1200);
    });
  }, []);

  return (
    <motion.div
      className="text-center"
      animate={pulse ? pulseGlow.animate : undefined}
    >
      <p className="font-mono text-sm text-gold-1">{score}</p>
      <p className="text-[10px] text-dim">Spark Score</p>
    </motion.div>
  );
}
