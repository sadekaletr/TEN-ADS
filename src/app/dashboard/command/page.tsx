import { getCreatorSession } from "@/lib/session-auth";
import { getCreatorAnalytics } from "@/lib/analytics";
import { notDeleted } from "@/lib/db";
import { prisma } from "@/lib/prisma";
import { CommandCenterPageClient } from "@/components/command/CommandCenterPageClient";
import { redirect } from "next/navigation";

export default async function CommandCenterPage() {
  const session = await getCreatorSession();
  if (!session) redirect("/login");

  const [analytics, campaigns, todayRedemptions] = await Promise.all([
    getCreatorAnalytics(session.user.id),
    prisma.campaign.findMany({
      where: { creatorId: session.user.id, status: "ACTIVE", ...notDeleted },
      select: {
        id: true,
        title: true,
        prizeClaimed: true,
        prizeQuantity: true,
        costPerRedemption: true,
      },
    }),
    prisma.redemption.count({
      where: {
        campaign: { creatorId: session.user.id },
        createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      },
    }),
  ]);

  const pulseData = campaigns.map((c) => ({
    id: c.id,
    title: c.title,
    redemptions: c.prizeClaimed,
    roi: c.prizeQuantity > 0 ? c.prizeClaimed / c.prizeQuantity : 0,
  }));

  const conversionPct =
    analytics.funnel.views > 0
      ? Math.round(
          (analytics.funnel.redemptions / analytics.funnel.views) * 100
        )
      : 0;

  return (
    <CommandCenterPageClient
      todayRedemptions={todayRedemptions}
      activeCampaigns={analytics.activeCampaigns}
      conversionPct={conversionPct}
      pulseData={pulseData}
      mapCities={analytics.cities.map((c) => c.city)}
    />
  );
}
