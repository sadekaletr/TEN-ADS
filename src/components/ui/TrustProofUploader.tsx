"use client";

import { SmartFileDropzone } from "@/components/ui/SmartFileDropzone";
import { Icon } from "@/components/ui/Icon";

interface TrustProofUploaderProps {
  label?: string;
  hint?: string;
  trustCopy?: string;
  previewUrl?: string | null;
  fileName?: string | null;
  error?: string;
  capture?: "environment" | "user";
  onSelect: (file: File | null) => void;
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
}: TrustProofUploaderProps) {
  return (
    <div className="space-y-3 rounded-xl border border-strong bg-surface-stack p-4">
      <div className="flex items-start gap-2 text-sm text-text-secondary">
        <Icon name="lock" size={18} className="mt-0.5 shrink-0 text-gold-2" />
        <p>{trustCopy}</p>
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
