"use client";

import { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { fadeUp } from "@/lib/motion/variants";
import { transition } from "@/lib/motion/tokens";
import { cn } from "@/lib/utils";

export type ActivityFeedItem = {
  id: string;
  message: string;
  time: string;
  kind?: "redemption" | "visit" | "share" | "default";
};

interface ActivityFeedProps {
  items: ActivityFeedItem[];
  title?: string;
  className?: string;
  compact?: boolean;
}

const kindDot: Record<NonNullable<ActivityFeedItem["kind"]>, string> = {
  redemption: "bg-emerald-400",
  visit: "bg-sky-400",
  share: "bg-gold-2",
  default: "bg-gold-3/60",
};

const FeedRow = memo(function FeedRow({
  item,
  compact,
}: {
  item: ActivityFeedItem;
  compact?: boolean;
}) {
  const reducedMotion = useReducedMotion();
  const dot = kindDot[item.kind ?? "default"];

  return (
    <motion.li
      className={cn(
        "flex items-start gap-3 border-b border-gold-4/10 pb-3 last:border-0",
        compact && "pb-2"
      )}
      initial={reducedMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={transition.fast}
    >
      <span className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", dot)} aria-hidden />
      <div className="min-w-0 flex-1">
        <p className={cn("text-sm text-text-primary", compact && "text-xs")}>{item.message}</p>
        <p className="mt-0.5 text-xs text-text-tertiary">{item.time}</p>
      </div>
    </motion.li>
  );
});

export const ActivityFeed = memo(function ActivityFeed({
  items,
  title = "آخر النشاطات",
  className,
  compact,
}: ActivityFeedProps) {
  return (
    <GlassCard className={className} elevation={2} innerClassName="p-5">
      <h2 className="mb-4 font-medium text-gold-1">{title}</h2>
      {items.length === 0 ? (
        <p className="text-sm text-text-tertiary">لا توجد نشاطات بعد — ستظهر هنا فور بدء الحملة</p>
      ) : (
        <ul className="max-h-[420px] space-y-0 overflow-y-auto">
          {items.map((item) => (
            <FeedRow key={item.id} item={item} compact={compact} />
          ))}
        </ul>
      )}
    </GlassCard>
  );
});
