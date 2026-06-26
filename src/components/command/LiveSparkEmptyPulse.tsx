"use client";

import { motion } from "framer-motion";

export function LiveSparkEmptyPulse() {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <motion.span
        className="h-4 w-4 rounded-full bg-gold-2 shadow-[0_0_24px_rgba(240,201,122,0.6)]"
        animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
      />
      <p className="mt-4 text-sm text-dim">بانتظار أول استرداد مباشر...</p>
    </div>
  );
}
