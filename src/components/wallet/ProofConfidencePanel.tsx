"use client";

import { ReactNode } from "react";
import { CopyableField } from "@/components/ui/CopyableField";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import type { TransferSettings } from "@/lib/platform-settings";

export interface ProofConfidencePanelProps {
  settings: TransferSettings;
  amountLabel?: ReactNode;
  className?: string;
}

const CHECKLIST = [
  "تحقق من رقم الحساب قبل التحويل",
  "احفظ رقم العملية للمرجع",
  "ارفع صورة واضحة للإثبات",
] as const;

export function ProofConfidencePanel({
  settings,
  amountLabel,
  className,
}: ProofConfidencePanelProps) {
  return (
    <div
      className={cn(
        "space-y-5 rounded-2xl border border-strong bg-gradient-to-b from-bg-elevated/90 to-bg-surface p-5 shadow-surface",
        className
      )}
    >
      <div className="flex items-start gap-3 rounded-xl border border-strong/60 bg-bg-base/50 px-4 py-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold-2/30 bg-gold-rich/10">
          <Icon name="lock" size={20} className="text-gold-accent" />
        </span>
        <div>
          <h3 className="text-lg font-semibold text-text-primary">تحويل آمن</h3>
          <p className="mt-1 text-sm leading-relaxed text-text-secondary">
            مراجعة الطلب خلال 4 ساعات عمل — إشعار داخل التطبيق عند الموافقة
          </p>
        </div>
      </div>

      {amountLabel}

      {settings.transferInstructions && (
        <p className="rounded-lg border border-subtle bg-bg-elevated/50 px-3 py-2 text-sm text-text-secondary">
          {settings.transferInstructions}
        </p>
      )}

      <CopyableField label="طريقة التحويل" value={settings.transferMethod} mono={false} />
      <CopyableField label="رقم الحساب" value={settings.transferAccount} />

      <ul className="space-y-2.5 border-t border-strong pt-4 text-sm text-text-secondary">
        {CHECKLIST.map((item) => (
          <li key={item} className="flex items-center gap-2.5">
            <span
              className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/15 text-success"
              aria-hidden
            >
              <Icon name="check" size={12} />
            </span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
