"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

function AnimatedNumber({ value }: { value: number }) {
  const spring = useSpring(value, { stiffness: 80, damping: 18 });
  const display = useTransform(spring, (v) => Math.round(v));
  const [text, setText] = useState(String(value));

  useEffect(() => {
    spring.set(value);
    return display.on("change", (v) => setText(String(v)));
  }, [value, spring, display]);

  return (
    <motion.span className="font-mono text-3xl text-gold-1" suppressHydrationWarning>
      {text}
    </motion.span>
  );
}

export function GlobalCounters({
  redemptions,
  activeCampaigns,
  conversionPct,
}: {
  redemptions: number;
  activeCampaigns: number;
  conversionPct: number;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <div className="text-center">
        <AnimatedNumber value={redemptions} />
        <p className="mt-1 text-xs text-dim">استردادات اليوم</p>
      </div>
      <div className="text-center">
        <AnimatedNumber value={activeCampaigns} />
        <p className="mt-1 text-xs text-dim">حملات نشطة</p>
      </div>
      <div className="text-center">
        <AnimatedNumber value={conversionPct} />
        <p className="mt-1 text-xs text-dim">% تحويل</p>
      </div>
    </div>
  );
}
