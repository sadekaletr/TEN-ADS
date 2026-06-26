"use client";

import { cn } from "@/lib/utils";

export interface ConversionStep {
  id: string;
  label: string;
}

interface ConversionRailProps {
  steps: ConversionStep[];
  current: string;
  className?: string;
}

export function ConversionRail({ steps, current, className }: ConversionRailProps) {
  const currentIndex = steps.findIndex((s) => s.id === current);

  return (
    <nav
      className={cn("w-full", className)}
      aria-label="تقدم الاسترداد"
    >
      <ol className="flex items-center justify-between gap-1">
        {steps.map((step, i) => {
          const done = i < currentIndex;
          const active = step.id === current;
          return (
            <li key={step.id} className="flex flex-1 flex-col items-center gap-1">
              <div className="flex w-full items-center">
                {i > 0 && (
                  <div
                    className={cn(
                      "h-0.5 flex-1",
                      done || active ? "bg-gold-2" : "bg-surface-2"
                    )}
                  />
                )}
                <span
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                    active && "bg-gold-2 text-accent-foreground shadow-cta-glow",
                    done && !active && "bg-gold-2/30 text-gold-1",
                    !done && !active && "border border-default bg-surface-2 text-text-tertiary"
                  )}
                  aria-current={active ? "step" : undefined}
                >
                  {done && !active ? "✓" : i + 1}
                </span>
                {i < steps.length - 1 && (
                  <div
                    className={cn(
                      "h-0.5 flex-1",
                      done ? "bg-gold-2" : "bg-surface-2"
                    )}
                  />
                )}
              </div>
              <span
                className={cn(
                  "max-w-[4.5rem] text-center text-[10px] leading-tight",
                  active ? "text-gold-1" : "text-text-tertiary"
                )}
              >
                {step.label}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
