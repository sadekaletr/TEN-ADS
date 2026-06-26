"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionCinematicDividerProps {
  title?: string;
  variant?: "gold" | "circuit";
  className?: string;
}

export function SectionCinematicDivider({
  title,
  variant = "gold",
  className,
}: SectionCinematicDividerProps) {
  const reducedMotion = useReducedMotion();

  return (
    <div className={cn("relative py-8", className)}>
      <motion.div
        className={cn(
          "mx-auto h-px max-w-md",
          variant === "gold"
            ? "bg-gradient-to-r from-transparent via-gold-2/60 to-transparent"
            : "bg-gradient-to-r from-transparent via-gold-4/30 to-transparent"
        )}
        initial={reducedMotion ? false : { scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />
      {title && (
        <p className="mt-4 text-center text-sm text-text-tertiary">{title}</p>
      )}
    </div>
  );
}
