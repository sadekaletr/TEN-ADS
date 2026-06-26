"use client";

import { cn } from "@/lib/utils";

interface TickerItem {
  id: string;
  label: string;
}

interface LiveSignalTickerProps {
  items: TickerItem[];
  className?: string;
}

export function LiveSignalTicker({ items, className }: LiveSignalTickerProps) {
  if (items.length === 0) return null;

  const doubled = [...items, ...items];

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-subtle bg-surface-2/80 py-2",
        className
      )}
      aria-live="polite"
    >
      <div className="landing-marquee-track gap-8 px-4 text-sm text-text-secondary">
        {doubled.map((item, i) => (
          <span key={`${item.id}-${i}`} className="flex shrink-0 items-center gap-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}
