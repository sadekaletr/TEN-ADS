import { GlassCard } from "@/components/ui/GlassCard";
import { formatNumber } from "@/lib/format";

interface SponsorSlaCardProps {
  avgResponseHours: number | null;
  respondedCount: number;
}

export function SponsorSlaCard({ avgResponseHours, respondedCount }: SponsorSlaCardProps) {
  return (
    <GlassCard className="text-center">
      <p className="text-3xl font-mono text-gold-1">
        {avgResponseHours != null ? `${formatNumber(Math.round(avgResponseHours))}س` : "—"}
      </p>
      <p className="mt-1 text-sm text-dim">متوسط الرد على طلبات التعاون</p>
      {respondedCount > 0 && (
        <p className="mt-1 text-xs text-dim">من {respondedCount} طلب مُجاب</p>
      )}
    </GlassCard>
  );
}
