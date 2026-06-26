import { redirect, notFound } from "next/navigation";
import { AdminCreatorEditorClient } from "@/components/admin/AdminCreatorEditorClient";
import { getCreatorAnalytics } from "@/lib/analytics";
import { notDeleted } from "@/lib/db";
import { getLatestSparkScore } from "@/lib/intelligence/spark-score";
import { getTrustScoreDisplay } from "@/lib/intelligence/trust-score";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/session-auth";

export default async function AdminCreatorEditPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const creator = await prisma.creator.findFirst({
    where: { id: params.id, ...notDeleted },
    include: {
      listing: true,
      transactions: { orderBy: { createdAt: "desc" }, take: 10 },
    },
  });
  if (!creator) notFound();

  const [sparkSnap, trust, analytics] = await Promise.all([
    getLatestSparkScore(creator.id),
    getTrustScoreDisplay("CREATOR", creator.id),
    getCreatorAnalytics(creator.id),
  ]);

  const views = analytics.funnel.views;
  const redemptions = analytics.funnel.redemptions;

  let spotlightConflict: string | null = null;
  if (creator.listing?.spotlightRank) {
    const conflict = await prisma.creatorListing.findFirst({
      where: {
        spotlightRank: creator.listing.spotlightRank,
        creatorId: { not: creator.id },
        isPublic: true,
      },
      include: { creator: { select: { name: true } } },
    });
    if (conflict) {
      spotlightConflict = `تحذير: الرتبة ${creator.listing.spotlightRank} مستخدمة أيضاً لـ ${conflict.creator.name}`;
    }
  }

  return (
    <AdminCreatorEditorClient
      creator={{
        id: creator.id,
        name: creator.name,
        handle: creator.handle,
        phone: creator.phone,
        email: creator.email,
        avatarUrl: creator.avatarUrl,
        verified: creator.verified,
        isPartner: creator.isPartner,
        partnerDiscountCode: creator.partnerDiscountCode,
        walletBalance: creator.walletBalance,
        marketplaceBoostUntil: creator.marketplaceBoostUntil?.toISOString() ?? null,
        listing: creator.listing
          ? {
              bio: creator.listing.bio,
              categories: creator.listing.categories,
              isPublic: creator.listing.isPublic,
              coverImageUrl: creator.listing.coverImageUrl,
              showcaseTagline: creator.listing.showcaseTagline,
              spotlightRank: creator.listing.spotlightRank,
            }
          : null,
        performance: {
          sparkScore: sparkSnap?.score ?? null,
          trustScore: trust.score,
          activeCampaigns: analytics.activeCampaigns,
          totalRedemptions: analytics.totalPrizesClaimed,
          conversionRate: views > 0 ? redemptions / views : undefined,
          campaignsCount: trust.campaignsCount,
        },
        transactions: creator.transactions.map((t) => ({
          id: t.id,
          type: t.type,
          amount: t.amount,
          note: t.note,
          createdAt: t.createdAt.toISOString(),
        })),
        spotlightConflict,
      }}
    />
  );
}
