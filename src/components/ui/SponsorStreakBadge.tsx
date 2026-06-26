"use client";

import { Icon } from "@/components/ui/Icon";
import { formatNumber } from "@/lib/format";

export function SponsorStreakBadge({ weeks }: { weeks: number }) {
  return (
    <p className="mt-3 inline-flex items-center gap-1 rounded bg-gold-2/10 px-3 py-1 text-sm text-gold-1">
      <Icon name="spark" size={16} className="text-gold-2" />
      Streak: {formatNumber(weeks)} أسابيع
    </p>
  );
}
