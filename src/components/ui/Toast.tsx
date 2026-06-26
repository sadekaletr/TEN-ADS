"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface ToastProps {
  message: string;
  visible: boolean;
  onDismiss: () => void;
  duration?: number;
}

export function Toast({ message, visible, onDismiss, duration = 4000 }: ToastProps) {
  const [show, setShow] = useState(visible);

  useEffect(() => {
    setShow(visible);
    if (!visible) return;
    const t = setTimeout(() => {
      setShow(false);
      onDismiss();
    }, duration);
    return () => clearTimeout(t);
  }, [visible, duration, onDismiss]);

  if (!show) return null;

  return (
    <div
      role="status"
      className={cn(
        "fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl border border-gold-4/30",
        "bg-surface-elevated px-6 py-3 text-sm text-warm-white shadow-elevated backdrop-blur"
      )}
    >
      {message}
    </div>
  );
}
