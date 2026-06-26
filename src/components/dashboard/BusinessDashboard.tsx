"use client";

import Link from "next/link";
import { useState } from "react";
import { LiveSparkFlow } from "@/components/dashboard/LiveSparkFlow";
import { CreatorProgressBar } from "@/components/dashboard/CreatorProgressBar";
import { InsightsCard } from "@/components/dashboard/InsightsCard";
import { SparkRecommendation } from "@/components/dashboard/SparkRecommendation";
import { RecommendedSponsorsCard } from "@/components/network/RecommendedSponsorsCard";
import { BestTemplateCard } from "@/components/network/BestTemplateCard";
import { Button } from "@/components/ui/Button";
import { CommandKPICluster } from "@/components/ui/CommandKPICluster";
import { DataTable } from "@/components/ui/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { EmptyCampaignsIllustration } from "@/components/illustrations/EmptyIllustrations";
import { GlassCard } from "@/components/ui/GlassCard";
import { Icon } from "@/components/ui/Icon";
import { LiveSignalTicker } from "@/components/ui/LiveSignalTicker";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useLocale } from "@/lib/i18n";
import { CAMPAIGN_STATUS_KEYS } from "@/lib/campaign-labels";
import { StatusBadge, type StatusBadgeVariant } from "@/components/ui/StatusBadge";
import type { CreatorInsights } from "@/lib/intelligence/graph";
import type { CampaignRecommendation } from "@/lib/intelligence/recommendations";
import type { CampaignTemplate } from "@/lib/network/recommendations";
import { formatNumber, percent, spark } from "@/lib/format";
import { trackProductEvent } from "@/lib/analytics/product-events";
import { TYPICAL_CAMPAIGN_COST_DEFAULT } from "@/lib/wallet/topup-packages";

type CampaignRow = {
  id: string;
  title: string;
  status: string;
  prizeName: string;
  prizeClaimed: number;
  prizeQuantity: number;
  sponsor: { name: string };
};

interface BusinessDashboardProps {
  creatorId: string;
  creatorHandle: string;
  walletBalance: number;
  sparkUnit: number;
  sparkScore: number;
  completedCampaigns: number;
  analytics: {
    funnel: { views: number; codeSubmits: number; redemptions: number };
    activeCampaigns: number;
  };
  insights: CreatorInsights;
  campaigns: CampaignRow[];
  sparkRecommendation?: CampaignRecommendation | null;
  recommendedSponsors?: { id: string; name: string; logoUrl: string | null; city: string | null }[];
  bestTemplate?: CampaignTemplate | null;
}

const CAMPAIGN_STATUS_BADGE: Record<string, StatusBadgeVariant> = {
  ACTIVE: "live",
  DRAFT: "pending",
  PAUSED: "pending",
  ENDED: "ended",
};

export function BusinessDashboard({
  creatorId,
  creatorHandle,
  walletBalance,
  sparkScore,
  completedCampaigns,
  analytics,
  insights,
  campaigns,
  sparkRecommendation,
  recommendedSponsors,
  bestTemplate,
}: BusinessDashboardProps) {
  const { t } = useLocale();
  const [intelOpen, setIntelOpen] = useState(false);
  const { views, redemptions } = analytics.funnel;
  const convPct =
    views > 0 ? percent(Math.round((redemptions / views) * 100)) : "—";

  const activeCampaigns = campaigns.filter((c) => c.status === "ACTIVE");
  const needsTopUp = walletBalance < TYPICAL_CAMPAIGN_COST_DEFAULT;

  const tickerItems = activeCampaigns.slice(0, 5).map((c) => ({
    id: c.id,
    label: `${c.title} — ${formatNumber(c.prizeClaimed)}/${formatNumber(c.prizeQuantity)}`,
  }));

  return (
    <div className="space-y-8">
      <PageHeader
        title={t("dashboard.home.title")}
        description={t("dashboard.home.description")}
        action={
          <Button
            href={`/${creatorHandle.replace(/^@/, "")}/pitch`}
            variant="secondary"
            size="sm"
          >
            عرض Pitch
          </Button>
        }
      />

      <CommandKPICluster
        primary={{
          label: t("dashboard.wallet.balance"),
          value: (
            <span className="font-mono">{spark(walletBalance)} Spark</span>
          ),
          meta: `${t("dashboard.home.sparkScore")}: ${formatNumber(sparkScore)} · ${t("dashboard.home.updatedToday")}`,
        }}
        secondary={[
          {
            label: t("dashboard.home.activeCampaigns"),
            value: formatNumber(analytics.activeCampaigns),
            trend: t("dashboard.home.updatedToday"),
          },
          {
            label: t("dashboard.home.conversionRate"),
            value: convPct,
            trend: views > 0 ? `${formatNumber(views)} مشاهدة` : undefined,
          },
        ]}
        primaryAction={{
          href: needsTopUp ? "/dashboard/wallet/topup" : "/dashboard/campaigns/new",
          label: needsTopUp ? t("nav.topUp") : t("dashboard.campaigns.newCampaign"),
          icon: <Icon name={needsTopUp ? "wallet" : "rocket"} size={16} />,
          onClick: () =>
            trackProductEvent("dashboard_primary_cta_click", {
              section: "dashboard_atf",
              ctaLabel: needsTopUp ? t("nav.topUp") : t("dashboard.campaigns.newCampaign"),
              metadata: { needsTopUp, walletBalance },
            }),
        }}
        secondaryAction={{
          href: needsTopUp ? "/dashboard/campaigns/new" : "/dashboard/wallet/topup",
          label: needsTopUp ? t("dashboard.campaigns.newCampaign") : t("nav.topUp"),
        }}
      />

      {tickerItems.length > 0 && <LiveSignalTicker items={tickerItems} />}

      <CreatorProgressBar completedCampaigns={completedCampaigns} />

      <div className="grid gap-6 lg:grid-cols-2">
        <GlassCard elevation={2} className="border-strong">
          <SectionHeader
            title={t("dashboard.home.liveRedemptions")}
            description={t("dashboard.home.liveRedemptionsDesc")}
          />
          <LiveSparkFlow maxItems={5} compact />
        </GlassCard>

        <div className="space-y-4">
          <button
            type="button"
            className="focus-ring flex w-full items-center justify-between rounded-xl border border-default bg-surface-2 px-4 py-3 text-sm text-text-secondary lg:hidden"
            onClick={() => setIntelOpen((o) => !o)}
            aria-expanded={intelOpen}
          >
            {t("dashboard.home.smartSuggestion")}
            <Icon name={intelOpen ? "chevronUp" : "chevronDown"} size={16} />
          </button>

          <div className={intelOpen ? "block space-y-4" : "hidden space-y-4 lg:block"}>
            <GlassCard elevation={3} featured className="border-strong">
              <SectionHeader
                title={t("dashboard.home.smartSuggestion")}
                description={t("dashboard.home.smartSuggestionDesc")}
              />
              <SparkRecommendation
                creatorId={creatorId}
                initialRecommendation={sparkRecommendation}
              />
            </GlassCard>
            <RecommendedSponsorsCard
              creatorId={creatorId}
              initialSponsors={recommendedSponsors}
            />
            <BestTemplateCard
              creatorId={creatorId}
              initialTemplate={bestTemplate}
            />
            <GlassCard innerClassName="py-4 px-6">
              <InsightsCard insights={insights} />
            </GlassCard>
          </div>
        </div>
      </div>

      <div>
        <SectionHeader
          title={t("dashboard.home.myCampaigns")}
          description={t("dashboard.home.viewAll")}
          action={
            <Button href="/dashboard/campaigns/new" icon={<Icon name="rocket" size={16} />}>
              {t("dashboard.campaigns.newCampaign")}
            </Button>
          }
        />
        {activeCampaigns.length === 0 ? (
          <EmptyState
            variant="premium"
            title={t("dashboard.home.noCampaigns")}
            description={t("dashboard.home.noCampaignsDesc")}
            illustration={<EmptyCampaignsIllustration className="h-full w-full" />}
            action={
              <Button
                href="/dashboard/campaigns/new"
                glow
                icon={<Icon name="rocket" size={16} />}
                className="min-h-12"
              >
                {t("dashboard.home.createCampaign")}
              </Button>
            }
          />
        ) : (
          <DataTable
            rows={activeCampaigns}
            rowKey={(c) => c.id}
            columns={[
              {
                key: "title",
                header: "الحملة",
                cell: (c) => (
                  <Link
                    href={`/dashboard/campaigns/${c.id}`}
                    className="font-medium text-text-primary hover:text-gold-1"
                  >
                    {c.title}
                  </Link>
                ),
              },
              {
                key: "sponsor",
                header: "الراعي",
                cell: (c) => <span className="text-text-secondary">{c.sponsor.name}</span>,
              },
              {
                key: "prize",
                header: "الجائزة",
                cell: (c) => <span className="text-gold-3">{c.prizeName}</span>,
              },
              {
                key: "progress",
                header: "التقدم",
                cell: (c) => (
                  <span className="font-mono text-text-secondary">
                    {formatNumber(c.prizeClaimed)}/{formatNumber(c.prizeQuantity)}
                  </span>
                ),
              },
              {
                key: "status",
                header: "الحالة",
                cell: (c) => (
                  <StatusBadge
                    status={CAMPAIGN_STATUS_BADGE[c.status] ?? "pending"}
                    label={t(CAMPAIGN_STATUS_KEYS[c.status] ?? c.status)}
                  />
                ),
              },
            ]}
          />
        )}
      </div>
    </div>
  );
}
