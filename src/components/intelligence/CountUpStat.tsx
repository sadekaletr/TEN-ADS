"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { formatNumber } from "@/lib/format";
import { duration, easeGold } from "@/lib/motion/tokens";

interface CountUpStatProps {
  value: number;
  label: string;
  className?: string;
}

export function CountUpStat({ value, label, className }: CountUpStatProps) {
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (v) => Math.round(v));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration: duration.normal,
      ease: easeGold,
    });
    const unsub = rounded.on("change", (v) => setDisplay(v));
    return () => {
      controls.stop();
      unsub();
    };
  }, [motionValue, rounded, value]);

  return (
    <div className={className}>
      <p className="text-xs text-dim">{label}</p>
      <motion.p className="font-brand text-3xl text-gold-1">{formatNumber(display)}</motion.p>
    </div>
  );
}
