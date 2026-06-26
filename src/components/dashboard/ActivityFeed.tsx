import type { AuditLog } from "@prisma/client";
import { CircuitCard } from "@/components/ui/CircuitCard";
import {
  formatActivityMessage,
  formatActivityTime,
} from "@/lib/activity";

interface ActivityFeedProps {
  items: AuditLog[];
  title?: string;
}

export function ActivityFeed({
  items,
  title = "آخر النشاطات",
}: ActivityFeedProps) {
  return (
    <CircuitCard>
      <h2 className="mb-4 font-medium text-gold-1">{title}</h2>
      {items.length === 0 ? (
        <p className="text-sm text-dimmer">لا توجد نشاطات بعد</p>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-start justify-between gap-4 border-b border-gold-4/10 pb-3 last:border-0"
            >
              <span className="text-sm text-warm-white">
                {formatActivityMessage(item)}
              </span>
              <span className="shrink-0 text-xs text-dim">
                {formatActivityTime(item.createdAt)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </CircuitCard>
  );
}
