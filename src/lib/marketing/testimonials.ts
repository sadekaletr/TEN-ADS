import { prisma } from "@/lib/prisma";

export type MarketingTestimonialData = {
  id: string;
  quote: string;
  author: string;
  handle: string | null;
  avatarUrl: string | null;
};

export async function getMarketingTestimonials(): Promise<MarketingTestimonialData[]> {
  const rows = await prisma.marketingTestimonial.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    take: 6,
    select: {
      id: true,
      quote: true,
      author: true,
      handle: true,
      avatarUrl: true,
    },
  });
  return rows;
}

export async function getAllMarketingTestimonials() {
  return prisma.marketingTestimonial.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
}
