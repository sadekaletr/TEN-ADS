"use client";

import { memo, useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { cn } from "@/lib/utils";
import { MOTION } from "@/styles/motion";

interface LiveCounterProps {
  value: number;
  className?: string;
  suffix?: string;
  prefix?: string;
  glowOnChange?: boolean;
}

export const LiveCounter = memo(function LiveCounter({
  value,
  className,
  suffix = "",
  prefix = "",
  glowOnChange = true,
}: LiveCounterProps) {
  const reducedMotion = useReducedMotion();
  const prev = useRef(value);
  const changed = prev.current !== value;

  useEffect(() => {
    prev.current = value;
  }, [value]);

  return (
    <motion.span
      className={cn("inline-flex items-baseline gap-0.5 tabular-nums", className)}
      animate={
        glowOnChange && changed && !reducedMotion
          ? { filter: ["brightness(1)", "brightness(1.35)", "brightness(1)"] }
          : undefined
      }
      transition={{ duration: MOTION.normal }}
    >
      {prefix}
      <AnimatedNumber value={value} suffix={suffix} />
    </motion.span>
  );
});
