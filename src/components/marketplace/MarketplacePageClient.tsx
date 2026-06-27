"use client";

import { useState } from "react";
import { MarketplaceFilters } from "@/components/marketplace/MarketplaceFilters";
import { MarketplaceListingCard } from "@/components/marketplace/MarketplaceListingCard";
import { MarketplaceDiscoverCampaigns } from "@/components/marketplace/MarketplaceDiscoverCampaigns";
import { MarketplaceRecommended } from "@/components/marketplace/MarketplaceRecommended";
import { PageHero } from "@/components/experience/PageHero";
import { EmptyState } from "@/components/ui/EmptyState";
import { EmptySearchIllustration } from "@/components/illustrations/EmptyIllustrations";
import { Tabs } from "@/components/ui/Tabs";
import { Button } from "@/components/ui/Button";
import { useLocale } from "@/lib/i18n";
import type { CreatorCardData } from "@/lib/creators/getFeaturedCreators";

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

interface MarketplacePageClientProps {
  creators: CreatorCardData[];
  discoverCampaigns: DiscoverCampaign[];
  searchParams: { city?: string; category?: string; minTrust?: string; tab?: string };
}

export function MarketplacePageClient({
  creators,
  discoverCampaigns,
  searchParams,
}: MarketplacePageClientProps) {
  const { t } = useLocale();
  const [tab, setTab] = useState<"creators" | "campaigns">(
    searchParams.tab === "campaigns" ? "campaigns" : "creators"
  );

  const hasFilters = Boolean(
    searchParams.city || searchParams.category || searchParams.minTrust
  );

  return (
    <>
      <PageHero
        className="mb-8"
        eyebrow="Marketplace 2.0"
        title={t("marketplace.title")}
        subtitle={t("marketplace.subtitle")}
      />

      <Tabs
        className="mb-8"
        tabs={[
          { id: "campaigns" as const, label: "اكتشف الحملات" },
          { id: "creators" as const, label: "ابحث عن صناع" },
        ]}
        active={tab}
        onChange={setTab}
      />

      {tab === "campaigns" ? (
        <MarketplaceDiscoverCampaigns campaigns={discoverCampaigns} />
      ) : (
        <>
          <MarketplaceFilters
            initialCity={searchParams.city}
            initialCategory={searchParams.category}
            initialMinTrust={searchParams.minTrust}
          />
          <MarketplaceRecommended creators={creators} />
          {creators.length === 0 ? (
            <EmptyState
              variant="premium"
              title={hasFilters ? "لا نتائج للفلتر" : t("marketplace.noResults")}
              description={
                hasFilters
                  ? "جرّب توسيع البحث أو إزالة بعض الفلاتر"
                  : t("marketplace.subtitle")
              }
              illustration={<EmptySearchIllustration className="h-full w-full" />}
              action={
                hasFilters ? (
                  <Button href="/marketplace" variant="secondary" className="min-h-12">
                    إعادة تعيين الفلاتر
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <>
              <p className="mb-4 text-sm text-text-secondary">
                {creators.length} صانع — مرتّبون حسب الثقة والنشاط
              </p>
              <h2 className="sr-only">نتائج البحث عن صناع المحتوى</h2>
              <div className="grid gap-8 lg:grid-cols-2">
                {creators.map((creator, i) => (
                  <MarketplaceListingCard
                    key={creator.id}
                    creator={creator}
                    variant={i < 2 ? "hero" : "default"}
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}
    </>
  );
}
