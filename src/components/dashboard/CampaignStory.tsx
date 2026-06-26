"use client";

import { motion } from "framer-motion";
import { stagger, staggerContainer, staggerItem, transition } from "@/lib/motion";

interface DayStory {
  day: string;
  scans: number;
  submits: number;
  redemptions: number;
}

export function CampaignStory({ days }: { days: DayStory[] }) {
  if (days.length === 0) {
    return <p className="text-sm text-dim">لا توجد بيانات كافية لعرض القصة بعد</p>;
  }

  const maxVal = Math.max(
    ...days.flatMap((d) => [d.scans, d.submits, d.redemptions]),
    1
  );

  const peakRedemption = Math.max(...days.map((d) => d.redemptions));

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate">
      <div className="flex items-end gap-3 overflow-x-auto pb-2">
        {days.map((d, i) => {
          const isPeak = d.redemptions === peakRedemption && peakRedemption > 0;
          return (
            <motion.div
              key={d.day}
              variants={staggerItem}
              transition={{ ...transition.normal, delay: i * stagger.tight }}
              className="flex min-w-[72px] flex-col items-center gap-1"
            >
              <div className="flex h-32 w-full items-end justify-center gap-1">
                <div
                  className="w-3 rounded-t bg-gold-4/40"
                  style={{ height: `${(d.scans / maxVal) * 100}%` }}
                  title={`${d.scans} مسح`}
                />
                <div
                  className="w-3 rounded-t bg-gold-2/60"
                  style={{ height: `${(d.submits / maxVal) * 100}%` }}
                  title={`${d.submits} إرسال`}
                />
                <motion.div
                  className={`w-3 rounded-t bg-gold-1 ${isPeak ? "shadow-[0_0_8px_rgba(240,201,122,0.8)]" : ""}`}
                  style={{ height: `${(d.redemptions / maxVal) * 100}%` }}
                  animate={isPeak ? { opacity: [0.85, 1, 0.85] } : undefined}
                  transition={
                    isPeak
                      ? { repeat: Infinity, duration: 2, ease: transition.normal.ease }
                      : transition.normal
                  }
                  title={`${d.redemptions} استرداد`}
                />
              </div>
              <p className="font-mono text-[10px] text-dim">{d.day.slice(5)}</p>
            </motion.div>
          );
        })}
      </div>
      <div className="mt-3 flex gap-4 text-xs text-dim">
        <span className="flex items-center gap-1">
          <span className="inline-block h-2 w-2 rounded bg-gold-4/40" /> مسح
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-2 w-2 rounded bg-gold-2/60" /> إرسال
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-2 w-2 rounded bg-gold-1" /> استرداد
        </span>
      </div>
    </motion.div>
  );
}
