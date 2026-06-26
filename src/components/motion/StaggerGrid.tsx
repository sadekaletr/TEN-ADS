"use client";

import { motion } from "framer-motion";
import { staggerContainer, staggerItem, fadeUpTransition } from "@/lib/motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StaggerGridProps {
  children: ReactNode;
  className?: string;
}

export function StaggerGrid({ children, className }: StaggerGridProps) {
  return (
    <motion.div
      className={cn(className)}
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      {children}
    </motion.div>
  );
}

export function StaggerGridItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={staggerItem}
      transition={fadeUpTransition}
    >
      {children}
    </motion.div>
  );
}
