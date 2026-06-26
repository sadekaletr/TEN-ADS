import type { TopUpSocialProofData } from "@/lib/wallet/social-proof";
import { formatRelativeTimeAr } from "@/lib/wallet/social-proof";
import { formatNumber } from "@/lib/format";
import { GlassCard } from "@/components/ui/GlassCard";

interface TopUpSocialProofProps {
  data: TopUpSocialProofData;
}

export function TopUpSocialProof({ data }: TopUpSocialProofProps) {
  const { creatorsThisWeek, lastTopUpAt, isFirstTopUp } = data;

  return (
    <GlassCard innerClassName="py-4 px-6">
      {isFirstTopUp && (
        <p className="text-sm font-medium text-gold-1">
          أول شحنة؟ مرحباً بك في TENEGTA Spark — ابدأ حملتك الأولى اليوم
        </p>
      )}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-dim">
        <span>
          {creatorsThisWeek > 0
            ? `${formatNumber(creatorsThisWeek)} صانع محتوى شحّنوا هذا الأسبوع`
            : "كن أول من يشحن ويبدأ"}
        </span>
        {lastTopUpAt && (
          <span>آخر شحنة على المنصة: منذ {formatRelativeTimeAr(lastTopUpAt)}</span>
        )}
      </div>
    </GlassCard>
  );
}
