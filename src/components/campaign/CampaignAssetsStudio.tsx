"use client";

import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";

interface CampaignAssetsStudioProps {
  campaignId: string;
  primaryCode: string;
  title: string;
}

export function CampaignAssetsStudio({
  campaignId,
  primaryCode,
  title,
}: CampaignAssetsStudioProps) {
  const code = encodeURIComponent(primaryCode);
  const base = `/api/campaigns/${campaignId}/assets`;

  const assets = [
    { key: "story", label: "ستوري 9:16", href: `${base}?format=story&code=${code}`, preview: `${base}?format=story&code=${code}&preview=1` },
    { key: "post", label: "منشور 1:1", href: `${base}?format=post&code=${code}`, preview: `${base}?format=post&code=${code}&preview=1` },
    { key: "poster", label: "ملصق A4 + QR", href: `/api/qr/${code}?format=poster&campaignId=${campaignId}`, preview: `/api/qr/${code}?format=png` },
    { key: "whatsapp", label: "بطاقة واتساب", href: `${base}?format=whatsapp&code=${code}`, preview: `${base}?format=whatsapp&code=${code}&preview=1` },
  ];

  return (
    <GlassCard className="space-y-4">
      <p className="text-sm text-dim">
        أصول جاهزة لحملة «{title}». معاينة قبل التحميل.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {assets.map((a) => (
          <div key={a.key} className="overflow-hidden rounded-lg border border-gold-4/25">
            <div className="relative aspect-video bg-surface-2/60">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={a.preview}
                alt={`معاينة ${a.label}`}
                className="h-full w-full object-contain p-2"
                loading="lazy"
              />
            </div>
            <a
              href={a.href}
              download
              className="block px-4 py-3 text-center text-sm text-gold-1 transition-colors hover:bg-gold-2/10 min-h-11"
            >
              {a.label} — تحميل
            </a>
          </div>
        ))}
      </div>
      <Button href={`${base}?format=zip&code=${code}`} variant="secondary" className="min-h-11">
        تحميل ZIP — كل الأصول
      </Button>
    </GlassCard>
  );
}
