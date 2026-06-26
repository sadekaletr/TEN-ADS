"use client";

import { cn } from "@/lib/utils";

type PillStatus = "pending" | "approved" | "rejected" | "live" | "urgent";

interface StatusPillProProps {
  status: PillStatus;
  label: string;
  urgency?: boolean;
  className?: string;
}

const styles: Record<PillStatus, string> = {
  pending: "border-warning/40 bg-warning-muted text-warning",
  approved: "border-success/40 bg-success-muted text-success",
  rejected: "border-danger/40 bg-danger-muted text-danger",
  live: "border-info/40 bg-info-muted text-info",
  urgent: "border-danger/60 bg-danger-muted text-danger animate-pulse",
};

export function StatusPillPro({
  status,
  label,
  urgency,
  className,
}: StatusPillProProps) {
  const visualStatus = urgency ? "urgent" : status;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        styles[visualStatus],
        className
      )}
    >
      {label}
    </span>
  );
}
