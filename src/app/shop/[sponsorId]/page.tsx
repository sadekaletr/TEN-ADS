import { notFound } from "next/navigation";
import { notDeleted } from "@/lib/db";
import { getTrustScoreDisplay } from "@/lib/intelligence/trust-score";
import { prisma } from "@/lib/prisma";
import { CircuitCard } from "@/components/ui/CircuitCard";
import { TrustScoreRing } from "@/components/trust/TrustScoreRing";
import { SponsorStreakBadge } from "@/components/ui/SponsorStreakBadge";

export default async function SponsorProfilePage({
  params,
}: {
  params: { sponsorId: string };
}) {
  const sponsor = await prisma.sponsor.findFirst({
    where: { id: params.sponsorId, ...notDeleted },
    include: {
      campaigns: {
        where: {
          status: { in: ["ACTIVE", "ENDED"] },
          ...notDeleted,
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!sponsor) notFound();

  const trust = await getTrustScoreDisplay("SPONSOR", sponsor.id);

  const totalPrizes = sponsor.campaigns.reduce(
    (sum, c) => sum + c.prizeClaimed,
    0
  );

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-4 py-12">
      <CircuitCard className="text-center">
        <div className="mb-6 flex justify-center">
          <TrustScoreRing
            score={trust.score}
            campaignsCount={trust.campaignsCount}
            size="large"
          />
        </div>
        <h1 className="text-2xl font-bold text-gold-1">{sponsor.name}</h1>
        {sponsor.city && (
          <p className="mt-1 text-dim">{sponsor.city}</p>
        )}
        <p className="mt-4 font-mono text-gold-1">{totalPrizes} جائزة موزّعة</p>
        {sponsor.phone && (
          <p className="mt-2 text-sm text-dim">{sponsor.phone}</p>
        )}
        {sponsor.currentStreak > 0 && (
          <SponsorStreakBadge weeks={sponsor.currentStreak} />
        )}
      </CircuitCard>

      <h2 className="mb-4 mt-8 text-lg text-warm-white">الحملات</h2>
      <div className="space-y-3">
        {sponsor.campaigns.length === 0 ? (
          <p className="text-dim">لا توجد حملات بعد</p>
        ) : (
          sponsor.campaigns.map((c) => (
            <CircuitCard key={c.id}>
              <h3 className="font-medium text-warm-white">{c.title}</h3>
              <p className="text-sm text-gold-3">{c.prizeName}</p>
              <p className="mt-2 font-mono text-xs text-dim">
                {c.prizeClaimed}/{c.prizeQuantity} جائزة
              </p>
            </CircuitCard>
          ))
        )}
      </div>
    </main>
  );
}
