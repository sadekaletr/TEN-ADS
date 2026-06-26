"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { cn } from "@/lib/utils";

export interface CopyableFieldProps {
  label: string;
  value: string;
  mono?: boolean;
  className?: string;
}

export function CopyableField({ label, value, mono = true, className }: CopyableFieldProps) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }

  return (
    <div className={cn("space-y-1", className)}>
      <Label>{label}</Label>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p
          className={cn(
            "break-all text-warm-white",
            mono && "font-mono text-lg text-gold-1"
          )}
          dir="ltr"
        >
          {value}
        </p>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={copy}
          className="min-h-11 shrink-0"
        >
          {copied ? "تم النسخ" : "نسخ"}
        </Button>
      </div>
    </div>
  );
}
