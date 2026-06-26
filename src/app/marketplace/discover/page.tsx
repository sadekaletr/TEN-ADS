import { notDeleted } from "@/lib/db";
import { prisma } from "@/lib/prisma";
import { PublicShell } from "@/components/layout/PublicShell";
import { MarketplaceDiscoverCampaigns } from "@/components/marketplace/MarketplaceDiscoverCampaigns";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { EmptySearchIllustration } from "@/components/illustrations/EmptyIllustrations";

type DiscoverCampaign = {
  id: string;
  title: string;
  prizeName: string;
  prizeClaimed: number;
  prizeQuantity: number;
  city: string | null;
  slug: string | null;
  creator: { name: string; handle: string };
  sponsor: { name: string; verified: boolean };
};

export default async function MarketplaceDiscoverPage() {
  let campaigns: DiscoverCampaign[] = [];
  try {
    campaigns = await prisma.campaign.findMany({
      where: { status: "ACTIVE", ...notDeleted, slug: { not: null } },
      orderBy: { createdAt: "desc" },
      take: 12,
      select: {
        id: true,
        title: true,
        prizeName: true,
        prizeClaimed: true,
        prizeQuantity: true,
        city: true,
        slug: true,
        creator: { select: { name: true, handle: true } },
        sponsor: { select: { name: true, verified: true } },
      },
    });
  } catch {
    // DB offline
  }

  return (
    <PublicShell analytics={false}>
      <div className="mx-auto max-w-6xl px-4 py-12 pb-safe">
        <h1 className="mb-2 text-2xl font-semibold text-text-primary">اكتشف الحملات</h1>
        <p className="mb-8 text-text-secondary">حملات نشطة على TENEGTA — سجّل كراعٍ للتعاون الكامل</p>
        {campaigns.length === 0 ? (
          <EmptyState
            title="لا توجد حملات نشطة حالياً"
            description="عد لاحقاً أو سجّل كراعٍ لإطلاق حملتك الأولى"
            illustration={<EmptySearchIllustration className="h-full w-full" />}
          />
        ) : (
          <MarketplaceDiscoverCampaigns campaigns={campaigns} />
        )}
        <div className="mt-8 text-center">
          <Button href="/sponsor/login">دخول الرعاة</Button>
        </div>
      </div>
    </PublicShell>
  );
}
