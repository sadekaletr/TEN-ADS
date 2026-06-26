"use client";

import { ReactNode } from "react";
import { CopyableField } from "@/components/ui/CopyableField";
import { GlassCard } from "@/components/ui/GlassCard";
import { Icon } from "@/components/ui/Icon";
import type { TransferSettings } from "@/lib/platform-settings";

export interface ProofConfidencePanelProps {
  settings: TransferSettings;
  amountLabel?: ReactNode;
}

const CHECKLIST = [
  "تحقق من رقم الحساب قبل التحويل",
  "احفظ رقم العملية للمرجع",
  "ارفع صورة واضحة للإثبات",
] as const;

export function ProofConfidencePanel({
  settings,
  amountLabel,
}: ProofConfidencePanelProps) {
  return (
    <GlassCard elevation={2} className="space-y-4">
      <div className="flex items-start gap-3">
        <Icon name="lock" size={24} className="shrink-0 text-gold-2" />
        <div>
          <h3 className="text-lg font-semibold text-gold-1">تحويل آمن</h3>
          <p className="mt-1 text-sm text-dim">
            مراجعة الطلب خلال 4 ساعات عمل — ستصلك إشعار داخل التطبيق عند الموافقة
          </p>
        </div>
      </div>

      {amountLabel}

      {settings.transferInstructions && (
        <p className="text-sm text-dim">{settings.transferInstructions}</p>
      )}

      <CopyableField label="طريقة التحويل" value={settings.transferMethod} mono={false} />
      <CopyableField label="رقم الحساب" value={settings.transferAccount} />

      <ul className="space-y-2 border-t border-gold-4/15 pt-4 text-sm text-dim">
        {CHECKLIST.map((item) => (
          <li key={item} className="flex items-center gap-2">
            <span className="text-success" aria-hidden>
              ✓
            </span>
            {item}
          </li>
        ))}
      </ul>
    </GlassCard>
  );
}
