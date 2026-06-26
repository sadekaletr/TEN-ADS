"use client";

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
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "group h-full w-full text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-void rounded-2xl",
        selected && "ring-2 ring-gold-2 ring-offset-2 ring-offset-void"
      )}
      aria-pressed={selected}
    >
      <GlassCard
        featured={pkg.featured}
        className={cn(
          "h-full transition-[transform,box-shadow,border-color] duration-200",
          selected && "border-gold-2/50 shadow-[0_0_24px_rgba(212,168,85,0.12)]",
          !selected && "group-hover:-translate-y-0.5 group-hover:border-strong"
        )}
      >
        {pkg.featured && (
          <span className="absolute start-4 top-4 z-20 inline-flex items-center gap-1 rounded-full bg-gold-2 px-2.5 py-0.5 text-xs font-semibold text-void">
            <Icon name="star" size={12} weight="fill" />
            الأكثر طلباً
          </span>
        )}
        <div className="flex flex-col items-center text-center">
          <span className="inline-flex items-center gap-1 rounded-full border border-strong bg-bg-elevated px-2.5 py-1 text-[10px] text-text-secondary">
            <Icon name="lock" size={12} className="text-gold-accent" />
            تحويل آمن
          </span>
          <div className="mt-4">
            <SparkIcon size={36} />
          </div>
          <p className="mt-3 font-brand text-4xl tabular-nums text-gold-accent md:text-5xl">
            <AnimatedNumber value={pkg.amount} />
          </p>
          <p className="text-sm text-text-secondary">Spark</p>
          <p className="mt-3 text-base font-medium text-text-primary">{pkg.resultText}</p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
            {pkg.listPriceUSD != null && pkg.listPriceUSD !== pkg.priceUSD && (
              <span className="font-mono text-sm tabular-nums text-text-tertiary line-through">
                {formatUsd(pkg.listPriceUSD)}
              </span>
            )}
            <span className="font-mono text-xl font-semibold tabular-nums text-gold-accent">
              {formatUsd(pkg.priceUSD)}
            </span>
          </div>
          <p className="mt-1 font-mono text-xs tabular-nums text-text-tertiary">
            {formatCurrency(pkg.priceSYP)} تقريباً
          </p>
          <span
            className={cn(
              "mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-xl px-4 text-sm font-semibold transition-colors",
              selected
                ? "bg-gold-rich/25 text-gold-accent"
                : "bg-bg-elevated text-text-primary group-hover:bg-gold-rich/10"
            )}
          >
            {selected ? "محدّدة" : "اختر هذه الباقة"}
          </span>
        </div>
      </GlassCard>
    </button>
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
    <GlassCard className="border-gold-2/30 bg-gold-rich/5">
      <p className="text-sm text-text-primary">
        حملة «{title}» جاهزة — تحتاج فقط{" "}
        <AnimatedNumber value={sparkNeeded} className="font-mono font-semibold tabular-nums text-gold-accent" />{" "}
        سبارك
      </p>
      <Button
        href={`/dashboard/wallet/topup?need=${sparkNeeded}`}
        variant="secondary"
        size="sm"
        className="mt-3 min-h-10"
        icon={<Icon name="wallet" size={14} />}
      >
        اشحن الآن وأطلق فوراً
      </Button>
    </GlassCard>
  );
}
