"use client";

import { useRef, useState, type ReactNode, type MouseEvent } from "react";
import { motion } from "framer-motion";
import { useMotion } from "@/components/motion/MotionProvider";
import { transition } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface MagneticCoreProps {
  children: ReactNode;
  className?: string;
  strength?: number;
}

export function MagneticCore({
  children,
  className,
  strength = 12,
}: MagneticCoreProps) {
  const { reducedMotion } = useMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  function handleMove(e: MouseEvent) {
    if (reducedMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = ((e.clientX - cx) / rect.width) * strength;
    const dy = ((e.clientY - cy) / rect.height) * strength;
    setOffset({ x: dx, y: dy });
  }

  function handleLeave() {
    setOffset({ x: 0, y: 0 });
  }

  return (
    <motion.div
      ref={ref}
      className={cn("inline-block", className)}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      animate={offset}
      transition={transition.magnetic}
    >
      {children}
    </motion.div>
  );
}
