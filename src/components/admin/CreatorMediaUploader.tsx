"use client";

import Image from "next/image";
import { useState } from "react";
import { SmartFileDropzone } from "@/components/ui/SmartFileDropzone";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";

interface CreatorMediaUploaderProps {
  creatorId: string;
  label: string;
  kind: "cover" | "avatar";
  value: string;
  onChange: (url: string) => void;
  previewAspect?: "cover" | "square";
}

export function CreatorMediaUploader({
  creatorId,
  label,
  kind,
  value,
  onChange,
  previewAspect = kind === "avatar" ? "square" : "cover",
}: CreatorMediaUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file: File) {
    setUploading(true);
    setError("");
    const fd = new FormData();
    fd.append("file", file);
    fd.append("creatorId", creatorId);
    fd.append("kind", kind);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "فشل الرفع");
        return;
      }
      onChange(data.url);
    } catch {
      setError("فشل الرفع");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-3">
      <Label>{label}</Label>
      {value && (
        <div
          className={
            previewAspect === "square"
              ? "relative mx-auto h-24 w-24 overflow-hidden rounded-full border border-gold-4/30"
              : "relative aspect-[16/10] w-full max-w-xs overflow-hidden rounded-xl border border-gold-4/30"
          }
        >
          <Image src={value} alt="" fill className="object-cover" sizes="200px" />
        </div>
      )}
      <SmartFileDropzone
        label={uploading ? "جاري الرفع..." : "اسحب صورة أو انقر للرفع"}
        accept="image/jpeg,image/png,image/webp"
        onSelect={(file) => {
          if (file) void handleFile(file);
        }}
      />
      <div>
        <Label className="text-xs text-dim">أو الصق رابط URL</Label>
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="/uploads/creators/..."
          dir="ltr"
          className="font-mono text-xs"
        />
      </div>
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}
