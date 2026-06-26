import { notDeleted } from "@/lib/db";
import { prisma } from "@/lib/prisma";

export type LandingFeaturedCampaign = {
  id: string;
  title: string;
  slug: string | null;
  prizeName: string;
  prizeClaimed: number;
  prizeQuantity: number;
  city: string | null;
  sponsor: { name: string; logoUrl: string | null };
  creator: { name: string; handle: string };
};

const FALLBACK: LandingFeaturedCampaign[] = [
  {
    id: "demo-1",
    title: "عرض نهاية الأسبوع",
    slug: null,
    prizeName: "خصم 30% على الطلب",
    prizeClaimed: 42,
    prizeQuantity: 100,
    city: "دمشق",
    sponsor: { name: "مطعم الشام", logoUrl: null },
    creator: { name: "سارة", handle: "sara_food" },
  },
  {
    id: "demo-2",
    title: "كوبون الجمال",
    slug: null,
    prizeName: "جلسة عناية مجانية",
    prizeClaimed: 18,
    prizeQuantity: 50,
    city: "حلب",
    sponsor: { name: "Glow Salon", logoUrl: null },
    creator: { name: "ليلى", handle: "layla_beauty" },
  },
  {
    id: "demo-3",
    title: "تخفيضات الملابس",
    slug: null,
    prizeName: "هدية مع كل شراء",
    prizeClaimed: 67,
    prizeQuantity: 120,
    city: "حمص",
    sponsor: { name: "Style Hub", logoUrl: null },
    creator: { name: "أحمد", handle: "ahmad_style" },
  },
  {
    id: "demo-4",
    title: "عرض القهوة",
    slug: null,
    prizeName: "مشروب مجاني",
    prizeClaimed: 91,
    prizeQuantity: 150,
    city: "دمشق",
    sponsor: { name: "Bean Lab", logoUrl: null },
    creator: { name: "نور", handle: "noor_daily" },
  },
];

export async function getFeaturedCampaignsForLanding(): Promise<{
  campaigns: LandingFeaturedCampaign[];
  fromDb: boolean;
}> {
  try {
    const campaigns = await prisma.campaign.findMany({
      where: { status: "ACTIVE", ...notDeleted },
      orderBy: { prizeClaimed: "desc" },
      take: 8,
      select: {
        id: true,
        title: true,
        slug: true,
        prizeName: true,
        prizeClaimed: true,
        prizeQuantity: true,
        city: true,
        sponsor: { select: { name: true, logoUrl: true } },
        creator: { select: { name: true, handle: true } },
      },
    });
    if (campaigns.length > 0) return { campaigns, fromDb: true };
    return { campaigns: FALLBACK, fromDb: false };
  } catch {
    return { campaigns: FALLBACK, fromDb: false };
  }
}
