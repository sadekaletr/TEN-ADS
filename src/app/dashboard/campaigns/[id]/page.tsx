import { notFound, redirect } from "next/navigation";
import { getCreatorSession } from "@/lib/session-auth";
import { prisma } from "@/lib/prisma";
import { notDeleted } from "@/lib/db";
import { getCampaignAnalytics } from "@/lib/analytics";
import { getCampaignStoryData } from "@/lib/intelligence/aggregate";
import { getCampaignInsights } from "@/lib/intelligence/graph";
import { AnimatedCircuitCard } from "@/components/motion/AnimatedCircuitCard";
import { CampaignDetailShell } from "@/components/dashboard/CampaignDetailShell";
import { CodeDisplay } from "@/components/ui/CodeDisplay";
import { FunnelChart } from "@/components/dashboard/FunnelChart";
import { CityBreakdown } from "@/components/dashboard/CityBreakdown";
import { PeakHours } from "@/components/dashboard/PeakHours";
import { DeviceBreakdown } from "@/components/dashboard/DeviceBreakdown";
import { FailureBreakdown } from "@/components/dashboard/FailureBreakdown";
import { CampaignStory } from "@/components/dashboard/CampaignStory";
import { ExportButtons } from "@/components/dashboard/ExportButtons";
import { QrDownloads } from "@/components/dashboard/QrDownloads";
import { CollaboratorComparison } from "@/components/dashboard/CollaboratorComparison";

export default async function CampaignDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getCreatorSession();
  if (!session) redirect("/login");

  const campaign = await prisma.campaign.findFirst({
    where: { id: params.id, creatorId: session.user.id, ...notDeleted },
    include: {
      sponsor: true,
      codes: true,
      redemptions: { orderBy: { createdAt: "desc" } },
      collaborators: {
        include: { creator: { select: { name: true, handle: true } } },
      },
      creator: { select: { name: true } },
    },
  });

  if (!campaign) notFound();

  const [analytics, story, insights] = await Promise.all([
    getCampaignAnalytics(campaign.id),
    getCampaignStoryData(campaign.id),
    getCampaignInsights(campaign.id),
  ]);

  return (
    <CampaignDetailShell title={null}>
      <AnimatedCircuitCard>
        <p className="text-dim">
          {campaign.sponsor.name} — {campaign.prizeName}
        </p>
      </AnimatedCircuitCard>
      <AnimatedCircuitCard>
        <p className="mb-2 text-sm text-dim">أكواد الحملة</p>
        <div className="flex flex-wrap gap-4">
          {campaign.codes.map((c) => (
            <CodeDisplay key={c.id} code={c.code} className="text-sm" />
          ))}
        </div>
        <p className="mt-3 font-mono text-sm text-dim">
          {campaign.prizeClaimed}/{campaign.prizeQuantity} جائزة
        </p>
        <div className="mt-4 border-t border-gold-4/20 pt-4">
          <QrDownloads
            campaignId={campaign.id}
            codes={campaign.codes}
            campaignTitle={campaign.title}
          />
        </div>
      </AnimatedCircuitCard>

      {campaign.collaborators.length > 0 && (
        <AnimatedCircuitCard>
          <h2 className="mb-4 text-gold-1">مقارنة الشركاء</h2>
          <CollaboratorComparison
            collaborators={campaign.collaborators}
            ownerName={campaign.creator.name}
            ownerShare={Math.max(
              0,
              100 -
                campaign.collaborators.reduce(
                  (s, c) => s + c.sharePercentage,
                  0
                )
            )}
          />
        </AnimatedCircuitCard>
      )}

      <AnimatedCircuitCard>
        <h2 className="mb-4 text-gold-1">قصة الحملة</h2>
        <CampaignStory days={story} />
      </AnimatedCircuitCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <AnimatedCircuitCard>
          <h2 className="mb-4 text-gold-1">قمع الحملة</h2>
          <FunnelChart
            views={analytics.funnel.views}
            codeSubmits={analytics.funnel.codeSubmits}
            redemptions={analytics.funnel.redemptions}
          />
          <p className="mt-2 text-xs text-dim">
            جلسات فريدة: {insights.uniqueSessions} — تكلفة/استرداد:{" "}
            {insights.costPerRedemption} سبارك
          </p>
        </AnimatedCircuitCard>
        <AnimatedCircuitCard>
          <h2 className="mb-4 text-gold-1">التصدير</h2>
          <ExportButtons campaign={campaign} redemptions={campaign.redemptions} />
        </AnimatedCircuitCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <AnimatedCircuitCard>
          <h2 className="mb-4 text-gold-1">توزيع المدن</h2>
          <CityBreakdown cities={analytics.cities} />
        </AnimatedCircuitCard>
        <AnimatedCircuitCard>
          <h2 className="mb-4 text-gold-1">أوقات الذروة</h2>
          <PeakHours peakHours={analytics.peakHours} />
        </AnimatedCircuitCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <AnimatedCircuitCard>
          <h2 className="mb-4 text-gold-1">الأجهزة</h2>
          <DeviceBreakdown devices={insights.deviceBreakdown} />
        </AnimatedCircuitCard>
        <AnimatedCircuitCard>
          <h2 className="mb-4 text-gold-1">مصادر الزيارة</h2>
          {insights.referrerTop.length === 0 ? (
            <p className="text-sm text-dim">لا توجد بيانات</p>
          ) : (
            <ul className="space-y-1 text-sm">
              {insights.referrerTop.map((r) => (
                <li key={r.referrer} className="flex justify-between">
                  <span className="text-dim">{r.referrer}</span>
                  <span className="font-mono text-gold-2">{r.count}</span>
                </li>
              ))}
            </ul>
          )}
        </AnimatedCircuitCard>
      </div>

      {insights.failedCount > 0 && (
        <AnimatedCircuitCard>
          <h2 className="mb-4 text-gold-1">محاولات فاشلة</h2>
          <FailureBreakdown
            failures={analytics.failures}
            total={insights.failedCount}
          />
        </AnimatedCircuitCard>
      )}
    </CampaignDetailShell>
  );
}
