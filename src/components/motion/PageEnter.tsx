"use client";

import { motion, useReducedMotion } from "framer-motion";
import { fadeUp, fadeUpTransition } from "@/lib/motion";
import type { ReactNode } from "react";

interface PageEnterProps {
  title?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function PageEnter({ title, children, className }: PageEnterProps) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return (
      <div className={className}>
        {title}
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      initial="initial"
      animate="animate"
      variants={{
        initial: {},
        animate: { transition: { staggerChildren: 0.06 } },
      }}
    >
      {title && (
        <motion.div variants={fadeUp} transition={fadeUpTransition}>
          {title}
        </motion.div>
      )}
      <motion.div variants={fadeUp} transition={{ ...fadeUpTransition, delay: title ? 0.08 : 0 }}>
        {children}
      </motion.div>
    </motion.div>
  );
}