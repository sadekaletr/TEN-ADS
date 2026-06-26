import { cn } from "@/lib/utils";

export type StatusBadgeVariant =
  | "pending"
  | "approved"
  | "rejected"
  | "live"
  | "ended";

const styles: Record<StatusBadgeVariant, string> = {
  pending: "bg-warning-muted text-warning border-warning/40",
  approved: "bg-success-muted text-success border-success/40",
  rejected: "bg-danger-muted text-danger border-danger/40",
  live: "bg-success-muted text-success border-success/40",
  ended: "bg-bg-elevated text-text-secondary border-strong",
};

const dotStyles: Record<StatusBadgeVariant, string> = {
  pending: "bg-warning",
  approved: "bg-success",
  rejected: "bg-danger",
  live: "bg-success",
  ended: "bg-text-tertiary",
};

const labels: Record<StatusBadgeVariant, string> = {
  pending: "قيد المراجعة",
  approved: "موافق عليه",
  rejected: "مرفوض",
  live: "نشط",
  ended: "منتهية",
};

export interface StatusBadgeProps {
  status: StatusBadgeVariant;
  label?: string;
  className?: string;
  showDot?: boolean;
}

export function StatusBadge({
  status,
  label,
  className,
  showDot = true,
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        styles[status],
        className
      )}
    >
      {showDot && (
        <span
          className={cn("h-1.5 w-1.5 shrink-0 rounded-full", dotStyles[status])}
          aria-hidden
        />
      )}
      {label ?? labels[status]}
    </span>
  );
}
