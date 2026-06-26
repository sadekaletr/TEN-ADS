"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";
import type { TransferSettings } from "@/lib/platform-settings";

interface ShamCashTransferCardProps {
  settings: TransferSettings;
  amountLabel?: React.ReactNode;
}

export function ShamCashTransferCard({ settings, amountLabel }: ShamCashTransferCardProps) {
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState(false);

  async function copyAccount() {
    try {
      await navigator.clipboard.writeText(settings.transferAccount);
      setCopied(true);
      setToast(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }

  return (
    <>
      <div className="rounded-xl border border-gold-4/30 bg-surface-2/60 p-4">
        {settings.transferInstructions && (
          <p className="mb-3 text-sm text-dim">{settings.transferInstructions}</p>
        )}
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs text-dim">طريقة التحويل</p>
            <p className="text-warm-white">{settings.transferMethod}</p>
            <p className="mt-2 text-xs text-dim">رقم الحساب</p>
            <p className="font-mono text-xl text-gold-1">{settings.transferAccount}</p>
          </div>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={copyAccount}
            className="min-h-11 shrink-0"
          >
            {copied ? "تم النسخ" : "نسخ الرقم"}
          </Button>
        </div>
        {amountLabel && <div className="mt-4 border-t border-gold-4/20 pt-3">{amountLabel}</div>}
      </div>
      <Toast
        message="تم نسخ رقم الحساب"
        visible={toast}
        onDismiss={() => setToast(false)}
        duration={2000}
      />
    </>
  );
}
