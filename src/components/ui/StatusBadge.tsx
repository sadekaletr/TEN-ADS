import { cn } from "@/lib/utils";

export type StatusBadgeVariant =
  | "pending"
  | "approved"
  | "rejected"
  | "live"
  | "ended";

const styles: Record<StatusBadgeVariant, string> = {
  pending: "bg-warning-muted text-warning border-warning/30",
  approved: "bg-success-muted text-success border-success/30",
  rejected: "bg-danger-muted text-danger border-danger/30",
  live: "bg-success-muted text-success border-success/30",
  ended: "bg-surface-2 text-dim border-gold-4/20",
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
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        styles[status],
        className
      )}
    >
      {label ?? labels[status]}
    </span>
  );
}
