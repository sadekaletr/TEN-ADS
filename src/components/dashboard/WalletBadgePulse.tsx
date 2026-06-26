"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { onSparkFlow } from "@/lib/spark-flow-events";
import { pulseGlow } from "@/lib/motion";
import { SparkBadge } from "@/components/ui/SparkBadge";

export function WalletBadgePulse({
  amount,
  sparkUnit,
}: {
  amount: number;
  sparkUnit: number;
}) {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    return onSparkFlow(() => {
      setPulse(true);
      setTimeout(() => setPulse(false), 1200);
    });
  }, []);

  return (
    <motion.div animate={pulse ? pulseGlow.animate : undefined}>
      <SparkBadge amount={amount} sparkUnit={sparkUnit} />
    </motion.div>
  );
}
