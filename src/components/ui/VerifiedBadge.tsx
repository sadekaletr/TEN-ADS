"use client";

import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

interface VerifiedBadgeProps {
  className?: string;
}

export function VerifiedBadge({ className }: VerifiedBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded bg-gold-2/10 px-2 py-0.5 text-xs text-gold-1",
        className
      )}
    >
      <Icon name="sealCheck" size={14} />
      موثّق
    </span>
  );
}
