"use client";

import { cn } from "@/lib/utils";

export interface SegmentedOption {
  value: string;
  label: string;
}

interface SegmentedControlProps {
  options: SegmentedOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  size?: "sm" | "md";
}

export function SegmentedControl({
  options,
  value,
  onChange,
  className,
  size = "md",
}: SegmentedControlProps) {
  return (
    <div
      className={cn(
        "inline-flex rounded-lg border border-gold-4/30 bg-surface-2 p-0.5",
        className
      )}
      role="tablist"
    >
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.value)}
            className={cn(
              "rounded-md transition-colors",
              size === "sm" ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-sm",
              active
                ? "border border-gold-2/50 bg-gold-2/15 text-gold-1"
                : "border border-transparent text-dim hover:text-warm-white"
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
