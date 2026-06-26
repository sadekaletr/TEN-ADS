import { notFound, redirect } from "next/navigation";
import { getCreatorSession } from "@/lib/session-auth";
import { prisma } from "@/lib/prisma";
import { notDeleted } from "@/lib/db";
import { getCampaignAnalytics } from "@/lib/analytics";
import { getCampaignInsights } from "@/lib/intelligence/graph";
import { AnimatedCircuitCard } from "@/components/motion/AnimatedCircuitCard";
import { FunnelChart } from "@/components/dashboard/FunnelChart";
import { CityBreakdown } from "@/components/dashboard/CityBreakdown";
import { PeakHours } from "@/components/dashboard/PeakHours";
import { DeviceBreakdown } from "@/components/dashboard/DeviceBreakdown";
import { FailureBreakdown } from "@/components/dashboard/FailureBreakdown";
import { getCampaignFraudSignals } from "@/lib/intelligence/fraud";
import { FraudSignalsPanel } from "@/components/admin/FraudSignalsPanel";
import { FunnelKpiStrip } from "@/components/ui/FunnelKpiStrip";

export default async function CampaignAnalyticsPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getCreatorSession();
  if (!session) redirect("/login");

  const campaign = await prisma.campaign.findFirst({
    where: { id: params.id, creatorId: session.user.id, ...notDeleted },
  });
  if (!campaign) notFound();

  const [analytics, insights, fraudSignals] = await Promise.all([
    getCampaignAnalytics(campaign.id),
    getCampaignInsights(campaign.id),
    getCampaignFraudSignals(campaign.id),
  ]);

  return (
    <div className="space-y-6">
      <FunnelKpiStrip
        views={analytics.funnel.views}
        clicks={analytics.funnel.codeSubmits}
        redemptions={analytics.funnel.redemptions}
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <AnimatedCircuitCard>
          <h2 className="mb-4 text-gold-1">قمع الحملة</h2>
          <FunnelChart
            views={analytics.funnel.views}
            codeSubmits={analytics.funnel.codeSubmits}
            redemptions={analytics.funnel.redemptions}
          />
        </AnimatedCircuitCard>
        <AnimatedCircuitCard>
          <h2 className="mb-4 text-gold-1">توزيع المدن</h2>
          <CityBreakdown cities={analytics.cities} />
        </AnimatedCircuitCard>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <AnimatedCircuitCard>
          <h2 className="mb-4 text-gold-1">أوقات الذروة</h2>
          <PeakHours peakHours={analytics.peakHours} />
        </AnimatedCircuitCard>
        <AnimatedCircuitCard>
          <h2 className="mb-4 text-gold-1">الأجهزة</h2>
          <DeviceBreakdown devices={insights.deviceBreakdown} />
        </AnimatedCircuitCard>
      </div>
      {insights.failedCount > 0 && (
        <AnimatedCircuitCard>
          <h2 className="mb-4 text-gold-1">محاولات فاشلة</h2>
          <FailureBreakdown failures={analytics.failures} total={insights.failedCount} />
        </AnimatedCircuitCard>
      )}
      {fraudSignals.length > 0 && (
        <AnimatedCircuitCard>
          <h2 className="mb-4 text-gold-1">إشارات الاحتيال</h2>
          <FraudSignalsPanel signals={fraudSignals} />
        </AnimatedCircuitCard>
      )}
    </div>
  );
}
