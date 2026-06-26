"use client";

import { SparkAmount } from "@/components/ui/SparkAmount";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

interface WalletConfidenceStripProps {
  balance: number;
  method?: string;
  verified?: boolean;
  className?: string;
}

export function WalletConfidenceStrip({
  balance,
  method = "ShamCash",
  verified = true,
  className,
}: WalletConfidenceStripProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 rounded-xl border border-strong bg-surface-stack px-4 py-3 shadow-surface",
        className
      )}
    >
      <div>
        <p className="text-xs text-text-tertiary">رصيدك الحالي</p>
        <SparkAmount amount={balance} size="md" className="mt-0.5" />
      </div>
      <div className="flex items-center gap-2 text-sm text-text-secondary">
        <Icon name="wallet" size={18} className="text-gold-2" />
        <span>{method}</span>
        {verified && (
          <span className="inline-flex items-center gap-1 rounded-full bg-success-muted px-2 py-0.5 text-xs text-success">
            <Icon name="sealCheck" size={14} />
            موثّق
          </span>
        )}
      </div>
    </div>
  );
}
