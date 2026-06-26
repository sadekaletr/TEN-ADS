"use client";

import { motion } from "framer-motion";
import { MagneticCore } from "@/components/motion/MagneticCore";
import { pulseGlow } from "@/lib/motion";

interface CampaignPulseItem {
  id: string;
  title: string;
  redemptions: number;
  roi: number;
}

export function CampaignPulse({ campaigns }: { campaigns: CampaignPulseItem[] }) {
  if (campaigns.length === 0) {
    return <p className="text-sm text-dim">لا توجد حملات نشطة</p>;
  }

  const maxR = Math.max(...campaigns.map((c) => c.redemptions), 1);

  return (
    <div className="flex flex-wrap items-center justify-center gap-6 py-4">
      {campaigns.map((c) => {
        const size = 48 + (c.redemptions / maxR) * 64;
        const hue =
          c.roi >= 0.2
            ? "border-gold-1 bg-gold-1/10"
            : c.roi >= 0.1
              ? "border-gold-2 bg-gold-2/10"
              : "border-gold-4 bg-gold-4/10";

        return (
          <MagneticCore key={c.id} className="flex flex-col items-center gap-2" strength={10}>
            <motion.div animate={pulseGlow.animate} title={c.title}>
              <div
                className={`flex items-center justify-center rounded-full border-2 ${hue}`}
                style={{ width: size, height: size }}
              >
                <span className="font-mono text-sm text-gold-1">{c.redemptions}</span>
              </div>
            </motion.div>
            <p className="max-w-[80px] truncate text-center text-[10px] text-dim">
              {c.title}
            </p>
          </MagneticCore>
        );
      })}
    </div>
  );
}
