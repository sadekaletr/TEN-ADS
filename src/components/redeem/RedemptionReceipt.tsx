"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { Icon } from "@/components/ui/Icon";

interface RedemptionReceiptProps {
  reference: string;
  prizeName: string;
  sponsorName: string;
  creatorName: string;
  code: string;
}

export function RedemptionReceipt({
  reference,
  prizeName,
  sponsorName,
  creatorName,
  code,
}: RedemptionReceiptProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [saving, setSaving] = useState(false);
  const qrUrl = `/api/qr/${encodeURIComponent(code)}?format=png`;

  async function handleSavePng() {
    setSaving(true);
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 400;
      canvas.height = 520;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("canvas");

      ctx.fillStyle = "#0a0a0f";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#d4a855";
      ctx.font = "bold 20px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("إيصال الاسترداد", 200, 48);
      ctx.fillStyle = "#f5f0e8";
      ctx.font = "24px monospace";
      ctx.fillText(reference, 200, 90);
      ctx.font="16px sans-serif";
      ctx.fillText(prizeName, 200, 130);
      ctx.fillStyle = "#9a958c";
      ctx.font = "12px sans-serif";
      ctx.fillText(`من ${creatorName} × ${sponsorName}`, 200, 158);

      const img = new window.Image();
      img.crossOrigin = "anonymous";
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject();
        img.src = qrUrl;
      });
      ctx.drawImage(img, 140, 180, 120, 120);
      ctx.fillStyle = "#9a958c";
      ctx.font = "11px monospace";
      ctx.fillText(code, 200, 330);

      const link = document.createElement("a");
      link.download = `tenegta-receipt-${reference}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch {
      window.print();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="w-full" ref={cardRef}>
      <GlassCard className="space-y-4 text-center print:border-0 print:bg-white print:text-black">
        <Icon name="gift" size={40} className="mx-auto text-gold-2" />
        <p className="text-sm text-dim">إيصال الاسترداد</p>
        <p className="font-mono text-2xl text-gold-1">{reference}</p>
        <p className="text-warm-white">{prizeName}</p>
        <p className="text-xs text-dim">
          من {creatorName} × {sponsorName}
        </p>
        <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-lg border border-gold-4/20 bg-white p-2">
          <Image src={qrUrl} alt="QR" width={120} height={120} unoptimized />
        </div>
        <p className="font-mono text-xs text-dim">{code}</p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button fullWidth onClick={handleSavePng} loading={saving} variant="secondary" className="min-h-11">
            حفظ PNG
          </Button>
          <Button fullWidth onClick={() => window.print()} variant="ghost" className="min-h-11">
            طباعة
          </Button>
        </div>
      </GlassCard>
    </div>
  );
}
