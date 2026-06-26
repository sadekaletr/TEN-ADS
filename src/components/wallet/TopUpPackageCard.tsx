"use client";

import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { SparkIcon } from "@/components/ui/SparkIcon";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { formatCurrency, formatNumber } from "@/lib/format";
import { formatUsd } from "@/lib/spark-pricing";
import { cn } from "@/lib/utils";
import type { TopUpPackage } from "@/lib/wallet/topup-packages";

interface TopUpPackageCardProps {
  pkg: TopUpPackage;
  selected: boolean;
  onSelect: () => void;
}

export function TopUpPackageCard({ pkg, selected, onSelect }: TopUpPackageCardProps) {
  return (
    <GlassCard
      featured={pkg.featured}
      className={cn("h-full transition-transform", selected && "ring-2 ring-gold-2 scale-[1.02]")}
    >
      {pkg.featured && (
        <span className="absolute left-4 top-4 z-20 inline-flex items-center gap-1 rounded-full bg-gold-2 px-2.5 py-0.5 text-xs font-medium text-void">
          <Icon name="star" size={12} weight="fill" />
          الأكثر طلباً
        </span>
      )}
      <div className="flex flex-col items-center text-center">
        <SparkIcon size={40} />
        <p className="mt-4 font-brand text-5xl text-gold-1">{formatNumber(pkg.amount)}</p>
        <p className="text-sm text-dim">Spark</p>
        <p className="mt-3 text-lg text-warm-white">{pkg.resultText}</p>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
          {pkg.listPriceUSD != null && pkg.listPriceUSD !== pkg.priceUSD && (
            <span className="font-mono text-sm text-dim line-through">
              {formatUsd(pkg.listPriceUSD)}
            </span>
          )}
          <span className="font-mono text-xl font-semibold text-gold-1">
            {formatUsd(pkg.priceUSD)}
          </span>
        </div>
        <p className="mt-1 text-xs text-dim">{formatCurrency(pkg.priceSYP)} تقريباً</p>
        <Button onClick={onSelect} className="mt-6 w-full">
          اختر هذه الباقة
        </Button>
      </div>
    </GlassCard>
  );
}

export function DraftCampaignBanner({
  title,
  sparkNeeded,
}: {
  title: string;
  sparkNeeded: number;
}) {
  return (
    <GlassCard>
      <p className="text-sm text-warm-white">
        حملة «{title}» جاهزة — تحتاج فقط{" "}
        <AnimatedNumber value={sparkNeeded} className="font-mono text-gold-1" /> سبارك
      </p>
      <Link
        href={`/dashboard/wallet/topup?need=${sparkNeeded}`}
        className="mt-2 inline-flex items-center gap-1 text-sm text-gold-1 hover:text-gold-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-2/50 rounded"
      >
        <Icon name="arrowLeft" size={14} />
        اشحن الآن وأطلق فوراً
      </Link>
    </GlassCard>
  );
}
