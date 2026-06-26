import { GlassCard } from "@/components/ui/GlassCard";
import { formatNumber } from "@/lib/format";

interface SponsorOverviewProps {
  activeCampaigns: number;
  prizesDistributed: number;
  totalParticipants: number;
  campaignCount: number;
}

export function SponsorOverview({
  activeCampaigns,
  prizesDistributed,
  totalParticipants,
  campaignCount,
}: SponsorOverviewProps) {
  const stats = [
    { label: "حملات نشطة", value: activeCampaigns },
    { label: "جوائز موزعة", value: prizesDistributed },
    { label: "مشاركون", value: totalParticipants },
    { label: "إجمالي الحملات", value: campaignCount },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((s) => (
        <GlassCard key={s.label} className="text-center">
          <p className="text-3xl font-mono text-gold-1">{formatNumber(s.value)}</p>
          <p className="mt-1 text-sm text-dim">{s.label}</p>
        </GlassCard>
      ))}
    </div>
  );
}
