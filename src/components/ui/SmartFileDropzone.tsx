"use client";

import { useCallback, useId, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";

export type DropzoneState = "idle" | "dragover" | "selected" | "error";

interface SmartFileDropzoneProps {
  accept?: string;
  capture?: "environment" | "user";
  label?: string;
  hint?: string;
  previewUrl?: string | null;
  fileName?: string | null;
  state?: DropzoneState;
  error?: string;
  onSelect: (file: File | null) => void;
  className?: string;
}

export function SmartFileDropzone({
  accept = "image/*",
  capture,
  label = "اسحب الصورة أو انقر للرفع",
  hint = "PNG أو JPG — حتى 5MB",
  previewUrl,
  fileName,
  state = "idle",
  error,
  onSelect,
  className,
}: SmartFileDropzoneProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const visualState: DropzoneState = error ? "error" : dragOver ? "dragover" : state;

  const handleFiles = useCallback(
    (files: FileList | null) => {
      const file = files?.[0] ?? null;
      onSelect(file);
    },
    [onSelect]
  );

  return (
    <div className={cn("space-y-2", className)}>
      <label
        htmlFor={inputId}
        className={cn(
          "focus-ring flex min-h-[120px] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-6 text-center transition-colors",
          visualState === "dragover" && "border-gold-2 bg-gold-2/10",
          visualState === "selected" && "border-strong bg-gold-2/5",
          visualState === "error" && "border-danger/50 bg-danger-muted",
          visualState === "idle" && "border-default hover:border-strong hover:bg-surface-2/50"
        )}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
      >
        <Icon name="upload" size={28} className="text-gold-2" />
        <span className="text-sm font-medium text-text-primary">{label}</span>
        <span className="text-xs text-text-tertiary">{hint}</span>
        {fileName && (
          <span className="mt-1 text-xs text-gold-2">{fileName}</span>
        )}
      </label>
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={accept}
        capture={capture}
        className="sr-only"
        onChange={(e) => handleFiles(e.target.files)}
      />
      {previewUrl && (
        <div className="overflow-hidden rounded-xl border border-strong">
          <Image
            src={previewUrl}
            alt=""
            width={320}
            height={200}
            className="max-h-48 w-full object-cover"
            unoptimized
          />
        </div>
      )}
      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  );
}
