"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface FilterPillProps {
  active?: boolean;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
  type?: "button" | "submit";
}

export function FilterPill({
  active,
  onClick,
  children,
  className,
  type = "button",
}: FilterPillProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)]",
        active
          ? "border-gold-2 bg-gold-2/15 text-gold-1"
          : "border-gold-4/40 text-text-secondary hover:border-gold-4 hover:text-text-primary",
        className
      )}
    >
      {children}
    </button>
  );
}

interface FilterPillGroupProps {
  label?: string;
  children: ReactNode;
  className?: string;
}

export function FilterPillGroup({
  label,
  children,
  className,
}: FilterPillGroupProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {label && <span className="text-xs text-text-secondary">{label}</span>}
      {children}
    </div>
  );
}
