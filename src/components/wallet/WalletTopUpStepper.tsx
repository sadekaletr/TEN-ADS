"use client";

import { useLocale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const STEP_KEYS = ["package", "transfer", "proof", "submit"] as const;

export type TopUpStepKey = (typeof STEP_KEYS)[number];

interface WalletTopUpStepperProps {
  current: TopUpStepKey;
  className?: string;
}

export function WalletTopUpStepper({ current, className }: WalletTopUpStepperProps) {
  const { t } = useLocale();
  const steps = STEP_KEYS.map((key) => ({
    key,
    label: t(`dashboard.wallet.topup.step.${key}`),
  }));
  const currentIndex = steps.findIndex((s) => s.key === current);

  return (
    <nav className={cn("w-full", className)} aria-label={t("dashboard.wallet.topup.stepperLabel")}>
      <div className="mb-2 flex justify-between text-xs text-dim">
        <span>
          {t("dashboard.wallet.topup.stepProgress")
            .replace("{current}", String(currentIndex + 1))
            .replace("{total}", String(steps.length))}
        </span>
        <span>{steps[currentIndex]?.label}</span>
      </div>
      <div
        className="h-1.5 overflow-hidden rounded-full bg-surface-2"
        role="progressbar"
        aria-valuenow={currentIndex + 1}
        aria-valuemin={1}
        aria-valuemax={steps.length}
      >
        <div
          className="h-full rounded-full bg-gold-2 transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / steps.length) * 100}%` }}
        />
      </div>
      <ol className="mt-3 flex gap-1 overflow-x-auto pb-1" role="list">
        {steps.map((step, i) => {
          const done = i < currentIndex;
          const active = i === currentIndex;
          return (
            <li
              key={step.key}
              role="listitem"
              aria-current={active ? "step" : undefined}
              className={cn(
                "shrink-0 rounded-full px-2 py-0.5 text-[10px] sm:text-xs",
                done && "bg-gold-2/20 text-gold-1",
                active && "bg-gold-2/30 text-gold-1 ring-1 ring-gold-2/50",
                !done && !active && "text-dim"
              )}
            >
              {step.label}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
