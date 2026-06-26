"use client";

import { motion } from "framer-motion";
import { CircuitCard } from "@/components/ui/CircuitCard";
import { useMotion } from "@/components/motion/MotionProvider";
import { scaleIn, scaleInTransition } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface AnimatedCircuitCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function AnimatedCircuitCard({
  children,
  className,
  delay = 0,
}: AnimatedCircuitCardProps) {
  const { reducedMotion } = useMotion();

  if (reducedMotion) {
    return <CircuitCard className={className}>{children}</CircuitCard>;
  }

  return (
    <motion.div
      initial={scaleIn.initial}
      animate={scaleIn.animate}
      transition={{ ...scaleInTransition, delay }}
      whileHover={{ boxShadow: "0 0 24px rgba(212,168,85,0.12)" }}
      className="rounded-lg"
    >
      <CircuitCard
        className={cn("transition-[border-color,box-shadow] hover:border-gold-2/40", className)}
      >
        {children}
      </CircuitCard>
    </motion.div>
  );
}
