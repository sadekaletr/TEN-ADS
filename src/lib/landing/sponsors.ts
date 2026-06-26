import { notDeleted } from "@/lib/db";
import { prisma } from "@/lib/prisma";

export type LandingSponsorLogo = {
  id: string;
  name: string;
  logoUrl: string | null;
  verified: boolean;
};

/** Verified sponsors with active campaigns — for landing marquee. */
export async function getLandingSponsorLogos(limit = 12): Promise<LandingSponsorLogo[]> {
  const sponsors = await prisma.sponsor.findMany({
    where: {
      ...notDeleted,
      verified: true,
      campaigns: { some: { status: "ACTIVE", ...notDeleted } },
    },
    select: { id: true, name: true, logoUrl: true, verified: true },
    orderBy: { trustScore: "desc" },
    take: limit,
  });

  if (sponsors.length >= 4) return sponsors;

  const fallback = await prisma.sponsor.findMany({
    where: notDeleted,
    select: { id: true, name: true, logoUrl: true, verified: true },
    orderBy: { name: "asc" },
    take: limit,
  });

  const seen = new Set(sponsors.map((s) => s.id));
  return [...sponsors, ...fallback.filter((s) => !seen.has(s.id))].slice(0, limit);
}
