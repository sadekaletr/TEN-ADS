import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export interface KpiItem {
  label: string;
  value: ReactNode;
  hint?: string;
  href?: string;
}

interface KpiStripProps {
  items: KpiItem[];
  className?: string;
}

export function KpiStrip({ items, className }: KpiStripProps) {
  return (
    <div
      className={cn(
        "grid gap-px overflow-hidden rounded-xl border border-gold-4/15 bg-gold-4/10 sm:grid-cols-3",
        className
      )}
    >
      {items.map((item) => {
        const inner = (
          <>
            <p className="text-xs font-medium uppercase tracking-wide text-dim">
              {item.label}
            </p>
            <p className="mt-1 font-mono text-2xl text-gold-1">{item.value}</p>
            {item.hint && (
              <p className="mt-0.5 text-xs text-dimmer">{item.hint}</p>
            )}
          </>
        );

        return (
          <div
            key={item.label}
            className="surface-elevated backdrop-blur-sm"
          >
            {item.href ? (
              <Link
                href={item.href}
                className="block px-5 py-4 transition-colors hover:bg-gold-2/5"
              >
                {inner}
              </Link>
            ) : (
              <div className="px-5 py-4">{inner}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
