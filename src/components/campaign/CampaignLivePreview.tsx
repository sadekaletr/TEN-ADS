"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { Icon } from "@/components/ui/Icon";
import { isProCampaign } from "@/lib/campaign-tiers";
import type { CampaignTier } from "@prisma/client";

interface CampaignLivePreviewProps {
  title: string;
  prizeName: string;
  tier: CampaignTier;
  sponsorName: string;
}

export function CampaignLivePreview({
  title,
  prizeName,
  tier,
  sponsorName,
}: CampaignLivePreviewProps) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-dim">معاينة حية — ما يراه المتابع</p>
      <div className="mx-auto max-w-sm rounded-3xl border border-gold-4/20 bg-[#050406] p-4 shadow-2xl">
        <div className="rounded-2xl bg-surface p-6 text-center">
          <GlassCard innerClassName="p-4">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-gold-4/30 bg-surface-2">
              <Icon name="storefront" size={28} className="text-gold-2" />
            </div>
            <p className="text-sm text-dim">{sponsorName || "اسم الراعي"}</p>
            {isProCampaign(tier) && (
              <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-gold-2/20 px-3 py-0.5 text-xs font-medium text-gold-1">
                <Icon name="sealCheck" size={14} />
                حملة محترفة
              </span>
            )}
            <h2 className="mt-2 text-lg font-semibold text-warm-white">
              {title || "عنوان الحملة"}
            </h2>
            <p className="mt-4 text-sm text-dim">أنت على وشك فتح جائزتك</p>
            <p className="mt-1 text-lg text-gold-1">{prizeName || "اسم الجائزة"}</p>
            <div className="mt-6 w-full rounded-xl border border-gold-4/30 py-2 text-sm text-gold-1">
              متابعة
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
