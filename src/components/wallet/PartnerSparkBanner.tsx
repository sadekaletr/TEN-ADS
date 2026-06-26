"use client";

import { CopyableField } from "@/components/ui/CopyableField";
import { Icon } from "@/components/ui/Icon";
import { formatUsd } from "@/lib/spark-pricing";

type PartnerSparkBannerProps = {
  creatorName: string;
  discountCode: string;
  listUsd: number;
  partnerUsd: number;
  compact?: boolean;
};

export function PartnerSparkBanner({
  creatorName,
  discountCode,
  listUsd,
  partnerUsd,
  compact = false,
}: PartnerSparkBannerProps) {
  const savings = listUsd - partnerUsd;
  const savingsPct = Math.round((savings / listUsd) * 100);

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-gold-2/35 bg-gradient-to-br from-gold-2/20 via-void to-gold-1/10 shadow-[0_0_40px_rgba(212,175,55,0.08)]"
      role="status"
      aria-label="عرض شريك Tenegta"
    >
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gold-2/10 blur-2xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-gold-1/10 blur-xl"
        aria-hidden
      />

      <div className={compact ? "space-y-3 p-4" : "space-y-4 p-5 md:p-6"}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <p className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-gold-2">
              <Icon name="star" size={14} weight="fill" />
              شريك Tenegta
            </p>
            <h2 className="text-lg font-semibold text-warm-white md:text-xl">
              {creatorName} — سعرك الخاص على Spark
            </h2>
          </div>
          <span className="rounded-full border border-gold-2/40 bg-gold-2/15 px-3 py-1 text-xs font-medium text-gold-1">
            وفّر {savingsPct}%
          </span>
        </div>

        <p className="text-sm leading-relaxed text-dim md:text-base">
          أنت من صناع المحتوى المتعاقدين معنا — اشحن Spark بـ{" "}
          <span className="font-mono font-semibold text-gold-1">{formatUsd(partnerUsd)}</span>{" "}
          للوحدة بدل{" "}
          <span className="font-mono text-dim line-through">{formatUsd(listUsd)}</span>.
          كل Spark توفّر فيه{" "}
          <span className="font-mono text-gold-1">{formatUsd(savings)}</span> — استثمر
          الفرق في حملات أقوى!
        </p>

        <CopyableField label="كود الحسم الحصري" value={discountCode} />

        <p className="text-xs text-dim">
          أدخل الكود في ملاحظة التحويل أو رقم العملية — فريقنا يطبّق سعر الشريك{" "}
          {formatUsd(partnerUsd)} فور الموافقة.
        </p>
      </div>
    </div>
  );
}

export function SparkListPriceStrip({
  listUsd,
  partnerUsd,
  isPartner,
}: {
  listUsd: number;
  partnerUsd: number;
  isPartner: boolean;
}) {
  if (isPartner) {
    return (
      <p className="text-center text-sm text-dim">
        سعرك كشريك:{" "}
        <span className="font-mono text-dim line-through">{formatUsd(listUsd)}</span>{" "}
        <span className="font-mono font-semibold text-gold-1">{formatUsd(partnerUsd)}</span>{" "}
        لكل Spark
      </p>
    );
  }

  return (
    <p className="text-center text-sm text-dim">
      سعر Spark:{" "}
      <span className="font-mono font-semibold text-warm-white">{formatUsd(listUsd)}</span>{" "}
      للوحدة
    </p>
  );
}
