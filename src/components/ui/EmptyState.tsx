import { cn } from "@/lib/utils";

import type { ReactNode } from "react";

import { Icon, type IconName } from "@/components/ui/Icon";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  icon?: IconName;
  illustration?: ReactNode;
  variant?: "default" | "premium" | "compact";
}

export function EmptyState({
  title,
  description,
  action,
  className,
  icon = "spark",
  illustration,
  variant = "default",
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        variant === "premium" &&
          "rounded-2xl border border-strong bg-gradient-to-b from-bg-elevated/80 to-bg-surface px-6 py-14 shadow-surface",
        variant === "default" &&
          "rounded-xl border border-dashed border-gold-4/20 px-6 py-12",
        variant === "compact" && "rounded-lg border border-subtle bg-bg-elevated/50 px-4 py-8",
        className
      )}
    >
      {illustration ? (
        <div className="mb-4 h-20 w-20 opacity-90">{illustration}</div>
      ) : (
        <span
          className={cn(
            "mb-4 flex items-center justify-center rounded-full border border-strong bg-bg-elevated",
            variant === "premium" ? "h-14 w-14" : "h-12 w-12"
          )}
        >
          <Icon name={icon} size={variant === "premium" ? 32 : 28} className="text-gold-accent" />
        </span>
      )}
      <p className="text-base font-semibold text-text-primary">{title}</p>
      {description && (
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-text-secondary">
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
