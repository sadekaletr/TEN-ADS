import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { CampaignPerformanceBadge } from "@/components/sponsor/CampaignPerformanceBadge";

type CampaignRow = {
  id: string;
  title: string;
  status: string;
  prizeName: string;
  prizeClaimed: number;
  prizeQuantity: number;
  creator: { name: string; handle: string };
  _count: { redemptions: number };
};

export function SponsorCampaignsList({ campaigns }: { campaigns: CampaignRow[] }) {
  if (campaigns.length === 0) {
    return <p className="text-sm text-dim">لا توجد حملات مرتبطة بحسابك بعد.</p>;
  }

  return (
    <div className="space-y-3">
      {campaigns.map((c) => (
        <GlassCard key={c.id} className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-medium text-warm-white">{c.title}</p>
            <p className="text-sm text-dim">
              {c.creator.name} (@{c.creator.handle}) — {c.prizeName}
            </p>
            <p className="text-xs text-dim">
              {c.prizeClaimed}/{c.prizeQuantity} جائزة · {c._count.redemptions} استرداد
            </p>
          </div>
          <div className="text-end">
            <CampaignPerformanceBadge claimed={c.prizeClaimed} quantity={c.prizeQuantity} />
            <span className="mt-1 block rounded-full bg-gold-2/10 px-2 py-0.5 text-xs text-gold-1">
              {c.status}
            </span>
            {c.status === "ACTIVE" && (
              <Link
                href={`/marketplace`}
                className="mt-2 block text-xs text-gold-2 hover:underline"
              >
                Marketplace
              </Link>
            )}
          </div>
        </GlassCard>
      ))}
    </div>
  );
}
