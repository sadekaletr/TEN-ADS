"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { Icon } from "@/components/ui/Icon";
import { isProCampaign } from "@/lib/campaign-tiers";
import { formatNumber } from "@/lib/format";
import type { CampaignTier } from "@prisma/client";

interface CampaignLivePreviewProps {
  title: string;
  description?: string;
  prizeName: string;
  prizeQuantity?: number;
  tier: CampaignTier;
  sponsorName: string;
  city?: string;
}

export function CampaignLivePreview({
  title,
  description,
  prizeName,
  prizeQuantity,
  tier,
  sponsorName,
  city,
}: CampaignLivePreviewProps) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-gold-2">معاينة حية</p>
      <div className="mx-auto max-w-sm overflow-hidden rounded-3xl border border-gold-4/20 bg-[#050406] shadow-2xl">
        <div
          className="px-4 py-3 text-center text-[10px] uppercase tracking-widest text-gold-3"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(240,201,122,0.08), transparent)",
          }}
        >
          Live Preview
        </div>
        <div className="p-4">
          <GlassCard innerClassName="p-5 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-gold-4/30 bg-surface-2">
              <Icon name="storefront" size={28} className="text-gold-2" />
            </div>
            <p className="text-sm text-text-secondary">{sponsorName || "اسم الراعي"}</p>
            {city && <p className="mt-1 text-xs text-text-tertiary">{city}</p>}
            {isProCampaign(tier) && (
              <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-gold-2/20 px-3 py-0.5 text-xs font-medium text-gold-1">
                <Icon name="sealCheck" size={14} />
                حملة محترفة
              </span>
            )}
            <h2 className="mt-3 text-lg font-semibold text-text-primary">
              {title || "عنوان الحملة"}
            </h2>
            {description && (
              <p className="mt-2 line-clamp-2 text-xs text-text-secondary">{description}</p>
            )}
            <p className="mt-4 text-sm text-text-tertiary">هديتك بانتظارك</p>
            <p className="mt-1 text-xl font-semibold text-gold-1">
              {prizeName || "اسم الجائزة"}
            </p>
            {prizeQuantity != null && prizeQuantity > 0 && (
              <p className="mt-2 text-xs text-text-tertiary">
                {formatNumber(prizeQuantity)} جائزة متاحة
              </p>
            )}
            <div className="mt-6 w-full rounded-xl border border-gold-4/30 py-2.5 text-sm font-medium text-gold-1">
              اكتشف هديتك
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
