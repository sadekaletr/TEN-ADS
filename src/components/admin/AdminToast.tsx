"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";

export type AdminToastVariant = "success" | "error" | "info";

interface AdminToastProps {
  message: string;
  variant?: AdminToastVariant;
  onDismiss?: () => void;
  durationMs?: number;
}

const variantStyles: Record<AdminToastVariant, string> = {
  success: "border-success/40 bg-success-muted text-success",
  error: "border-danger/40 bg-danger-muted text-danger",
  info: "border-gold-4/30 bg-gold-2/10 text-gold-1",
};

export function AdminToast({
  message,
  variant = "info",
  onDismiss,
  durationMs = 4000,
}: AdminToastProps) {
  useEffect(() => {
    if (!onDismiss || durationMs <= 0) return;
    const t = setTimeout(onDismiss, durationMs);
    return () => clearTimeout(t);
  }, [onDismiss, durationMs, message]);

  if (!message) return null;

  return (
    <div
      role="status"
      className={cn(
        "fixed bottom-6 left-1/2 z-[100] -translate-x-1/2 rounded-xl border px-4 py-3 text-sm shadow-lg backdrop-blur-md",
        variantStyles[variant]
      )}
    >
      {message}
    </div>
  );
}
