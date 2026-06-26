import { notDeleted } from "@/lib/db";
import { prisma } from "@/lib/prisma";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXTAUTH_URL ?? "https://tenegta.com";

  let campaigns: { slug: string | null; createdAt: Date }[] = [];
  let creators: { handle: string; createdAt: Date }[] = [];
  try {
    [campaigns, creators] = await Promise.all([
      prisma.campaign.findMany({
        where: { status: "ACTIVE", slug: { not: null }, ...notDeleted },
        select: { slug: true, createdAt: true },
        take: 200,
      }),
      prisma.creator.findMany({
        where: notDeleted,
        select: { handle: true, createdAt: true },
        take: 200,
      }),
    ]);
  } catch {
    // Build/CI may run without a live database
  }

  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/marketplace/discover`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    ...campaigns
      .filter((c) => c.slug)
      .map((c) => ({
        url: `${base}/campaign/${c.slug}`,
        lastModified: c.createdAt,
        changeFrequency: "daily" as const,
        priority: 0.7,
      })),
    ...creators.map((c) => ({
      url: `${base}/creator/${c.handle.replace(/^@/, "")}`,
      lastModified: c.createdAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
