"use client";

import { SmartFileDropzone } from "@/components/ui/SmartFileDropzone";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

interface TrustProofUploaderProps {
  label?: string;
  hint?: string;
  trustCopy?: string;
  previewUrl?: string | null;
  fileName?: string | null;
  error?: string;
  capture?: "environment" | "user";
  onSelect: (file: File | null) => void;
  className?: string;
}

export function TrustProofUploader({
  label,
  hint,
  trustCopy = "بياناتك مشفّرة ولا تُشارك مع أطراف ثالثة",
  previewUrl,
  fileName,
  error,
  capture,
  onSelect,
  className,
}: TrustProofUploaderProps) {
  return (
    <div
      className={cn(
        "space-y-4 rounded-xl border border-strong bg-gradient-to-b from-bg-elevated/80 to-bg-surface p-4 shadow-surface",
        error && "border-danger/40",
        className
      )}
    >
      <div className="flex items-start gap-3 rounded-lg border border-strong/60 bg-bg-base/50 px-3 py-2.5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold-2/30 bg-gold-rich/10">
          <Icon name="lock" size={18} className="text-gold-accent" />
        </span>
        <p className="text-sm leading-relaxed text-text-secondary">{trustCopy}</p>
      </div>
      <SmartFileDropzone
        label={label}
        hint={hint}
        previewUrl={previewUrl}
        fileName={fileName}
        error={error}
        capture={capture}
        state={fileName ? "selected" : "idle"}
        onSelect={onSelect}
      />
    </div>
  );
}
