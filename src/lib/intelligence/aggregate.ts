import { prisma } from "@/lib/prisma";

function truncateHour(date: Date) {
  const d = new Date(date);
  d.setMinutes(0, 0, 0);
  return d;
}

export async function aggregateCampaignMetrics(
  campaignId?: string,
  sinceHours = 168
) {
  const since = new Date(Date.now() - sinceHours * 60 * 60 * 1000);

  const events = await prisma.campaignEvent.findMany({
    where: {
      ...(campaignId ? { campaignId } : {}),
      createdAt: { gte: since },
    },
    select: { campaignId: true, type: true, createdAt: true },
  });

  const buckets = new Map<
    string,
    { pageViews: number; codeSubmits: number; redemptions: number; failed: number }
  >();

  for (const e of events) {
    const hour = truncateHour(e.createdAt).toISOString();
    const key = `${e.campaignId}|${hour}`;
    const bucket = buckets.get(key) ?? {
      pageViews: 0,
      codeSubmits: 0,
      redemptions: 0,
      failed: 0,
    };

    switch (e.type) {
      case "PAGE_VIEW":
        bucket.pageViews += 1;
        break;
      case "CODE_SUBMIT":
        bucket.codeSubmits += 1;
        break;
      case "REDEMPTION_COMPLETED":
        bucket.redemptions += 1;
        break;
      case "REDEMPTION_FAILED":
        bucket.failed += 1;
        break;
    }
    buckets.set(key, bucket);
  }

  for (const [key, counts] of Array.from(buckets.entries())) {
    const sep = key.indexOf("|");
    const cid = key.slice(0, sep);
    const hour = new Date(key.slice(sep + 1));
    await prisma.campaignMetricHourly.upsert({
      where: {
        campaignId_hour: { campaignId: cid, hour },
      },
      create: {
        campaignId: cid,
        hour,
        ...counts,
      },
      update: counts,
    });
  }

  return buckets.size;
}

export async function getCampaignStoryData(campaignId: string) {
  const hourly = await prisma.campaignMetricHourly.findMany({
    where: { campaignId },
    orderBy: { hour: "asc" },
  });

  if (hourly.length > 0) {
    const dayMap = new Map<
      string,
      { scans: number; submits: number; redemptions: number }
    >();
    for (const h of hourly) {
      const day = h.hour.toISOString().slice(0, 10);
      const entry = dayMap.get(day) ?? { scans: 0, submits: 0, redemptions: 0 };
      entry.scans += h.pageViews;
      entry.submits += h.codeSubmits;
      entry.redemptions += h.redemptions;
      dayMap.set(day, entry);
    }
    return Array.from(dayMap.entries()).map(([day, stats]) => ({
      day,
      ...stats,
    }));
  }

  const events = await prisma.campaignEvent.findMany({
    where: { campaignId },
    select: { type: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });

  const dayMap = new Map<
    string,
    { scans: number; submits: number; redemptions: number }
  >();
  for (const e of events) {
    const day = e.createdAt.toISOString().slice(0, 10);
    const entry = dayMap.get(day) ?? { scans: 0, submits: 0, redemptions: 0 };
    if (e.type === "PAGE_VIEW") entry.scans += 1;
    if (e.type === "CODE_SUBMIT") entry.submits += 1;
    if (e.type === "REDEMPTION_COMPLETED") entry.redemptions += 1;
    dayMap.set(day, entry);
  }

  return Array.from(dayMap.entries()).map(([day, stats]) => ({
    day,
    ...stats,
  }));
}
