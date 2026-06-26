"use client";

import { useState } from "react";
import { MarketplaceFilters } from "@/components/marketplace/MarketplaceFilters";
import { MarketplaceListingCard } from "@/components/marketplace/MarketplaceListingCard";
import { MarketplaceDiscoverCampaigns } from "@/components/marketplace/MarketplaceDiscoverCampaigns";
import { EmptyState } from "@/components/ui/EmptyState";
import { EmptySearchIllustration } from "@/components/illustrations/EmptyIllustrations";
import { Tabs } from "@/components/ui/Tabs";
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

  return (
    <>
      <Tabs
        className="mb-6"
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
          {creators.length === 0 ? (
            <EmptyState
              title={t("marketplace.noResults")}
              description={t("marketplace.subtitle")}
              illustration={<EmptySearchIllustration className="h-full w-full" />}
            />
          ) : (
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {creators.map((creator) => (
                <MarketplaceListingCard key={creator.id} creator={creator} />
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
}
