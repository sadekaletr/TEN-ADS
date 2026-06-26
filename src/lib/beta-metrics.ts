import { prisma } from "@/lib/prisma";
import { median, percentile, hoursBetween } from "@/lib/stats-utils";

export type BetaMetricRow = {
  label: string;
  value: string;
  detail?: string;
};

export type BetaMetricsSnapshot = {
  generatedAt: Date;
  summary: BetaMetricRow[];
  timeToFirstCampaignHours: { median: number | null; p90: number | null; sample: number };
  timeToFirstRedemptionHours: { median: number | null; p90: number | null; sample: number };
  timeToTopUpApprovedHours: { median: number | null; p90: number | null; sample: number };
  creatorRetention30d: { retained: number; total: number; rate: number };
  sponsorRoiVisibilityHours: { median: number | null; p90: number | null; sample: number };
  activeCreators: number;
  activeSponsors: number;
  totalRedemptions30d: number;
};

export async function getBetaMetrics(): Promise<BetaMetricsSnapshot> {
  const since30d = new Date();
  since30d.setDate(since30d.getDate() - 30);

  const creators = await prisma.creator.findMany({
    where: { deletedAt: null },
    select: {
      id: true,
      createdAt: true,
      campaigns: {
        where: { status: "ACTIVE", deletedAt: null },
        orderBy: { createdAt: "asc" },
        take: 1,
        select: { createdAt: true },
      },
    },
  });

  const ttfCampaignHours = creators
    .filter((c) => c.campaigns[0])
    .map((c) => hoursBetween(c.createdAt, c.campaigns[0].createdAt));

  const campaignsWithRedemptions = await prisma.campaign.findMany({
    where: { deletedAt: null },
    select: {
      createdAt: true,
      redemptions: {
        orderBy: { createdAt: "asc" },
        take: 1,
        select: { createdAt: true },
      },
    },
  });

  const ttfRedemptionHours = campaignsWithRedemptions
    .filter((c) => c.redemptions[0])
    .map((c) => hoursBetween(c.createdAt, c.redemptions[0].createdAt));

  const approvedTopUps = await prisma.topUpRequest.findMany({
    where: { status: "APPROVED", reviewedAt: { not: null } },
    select: { createdAt: true, reviewedAt: true },
  });

  const ttTopUpHours = approvedTopUps.map((t) =>
    hoursBetween(t.createdAt, t.reviewedAt!)
  );

  const campaignsLast30d = await prisma.campaign.groupBy({
    by: ["creatorId"],
    where: { createdAt: { gte: since30d }, deletedAt: null },
    _count: { id: true },
  });

  const retainedCreators = campaignsLast30d.filter((g) => g._count.id >= 2).length;
  const totalCreatorsWithCampaign30d = campaignsLast30d.length;

  const activeCreators = await prisma.creator.count({
    where: {
      deletedAt: null,
      campaigns: { some: { status: "ACTIVE", deletedAt: null } },
    },
  });

  const activeSponsors = await prisma.sponsor.count({
    where: {
      deletedAt: null,
      campaigns: { some: { status: "ACTIVE", deletedAt: null } },
    },
  });

  const totalRedemptions30d = await prisma.redemption.count({
    where: { createdAt: { gte: since30d } },
  });

  const retentionRate =
    totalCreatorsWithCampaign30d > 0
      ? Math.round((retainedCreators / totalCreatorsWithCampaign30d) * 100)
      : 0;

  const roiViews = await prisma.auditLog.groupBy({
    by: ["entityId"],
    where: { action: "sponsor.roi_viewed", entityType: "Sponsor", entityId: { not: null } },
    _min: { createdAt: true },
  });

  const sponsorRoiHours: number[] = [];
  for (const view of roiViews) {
    if (!view.entityId || !view._min.createdAt) continue;
    const firstCampaign = await prisma.campaign.findFirst({
      where: { sponsorId: view.entityId, deletedAt: null },
      orderBy: { createdAt: "asc" },
      select: { createdAt: true },
    });
    if (firstCampaign) {
      sponsorRoiHours.push(hoursBetween(firstCampaign.createdAt, view._min.createdAt));
    }
  }

  const formatHours = (h: number | null) =>
    h == null ? "—" : h < 24 ? `${Math.round(h)} ساعة` : `${(h / 24).toFixed(1)} يوم`;

  return {
    generatedAt: new Date(),
    summary: [
      {
        label: "Time to First Campaign (median)",
        value: formatHours(median(ttfCampaignHours)),
        detail: `${ttfCampaignHours.length} صانع لديهم حملة ACTIVE`,
      },
      {
        label: "Time to First Redemption (median)",
        value: formatHours(median(ttfRedemptionHours)),
        detail: `${ttfRedemptionHours.length} حملة لديها استرداد`,
      },
      {
        label: "Time to Top-up Approved (median)",
        value: formatHours(median(ttTopUpHours)),
        detail: `${ttTopUpHours.length} طلب موافق`,
      },
      {
        label: "Creator Retention (≥2 campaigns / 30d)",
        value: `${retentionRate}%`,
        detail: `${retainedCreators} / ${totalCreatorsWithCampaign30d}`,
      },
      {
        label: "Sponsor ROI Visibility (median)",
        value: formatHours(median(sponsorRoiHours)),
        detail: `${sponsorRoiHours.length} راعٍ زار /sponsor/roi`,
      },
      {
        label: "Active creators / sponsors",
        value: `${activeCreators} / ${activeSponsors}`,
      },
      {
        label: "Redemptions (30d)",
        value: String(totalRedemptions30d),
      },
    ],
    timeToFirstCampaignHours: {
      median: median(ttfCampaignHours),
      p90: percentile(ttfCampaignHours, 90),
      sample: ttfCampaignHours.length,
    },
    timeToFirstRedemptionHours: {
      median: median(ttfRedemptionHours),
      p90: percentile(ttfRedemptionHours, 90),
      sample: ttfRedemptionHours.length,
    },
    timeToTopUpApprovedHours: {
      median: median(ttTopUpHours),
      p90: percentile(ttTopUpHours, 90),
      sample: ttTopUpHours.length,
    },
    creatorRetention30d: {
      retained: retainedCreators,
      total: totalCreatorsWithCampaign30d,
      rate: retentionRate,
    },
    sponsorRoiVisibilityHours: {
      median: median(sponsorRoiHours),
      p90: percentile(sponsorRoiHours, 90),
      sample: sponsorRoiHours.length,
    },
    activeCreators,
    activeSponsors,
    totalRedemptions30d,
  };
}
