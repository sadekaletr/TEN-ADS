"use client";

import { CreatorHero } from "@/components/creators/CreatorHero";
import { CreatorSpotlightCard } from "@/components/creators/CreatorSpotlightCard";
import { CreatorGrid } from "@/components/creators/CreatorGrid";
import { CreatorCardSkeleton } from "@/components/creators/CreatorCardSkeleton";
import { CreatorEmptyState } from "@/components/creators/CreatorEmptyState";
import type { CreatorCardData } from "@/lib/creators/getFeaturedCreators";
import { TOKENS } from "@/styles/tokens";

const NOW = new Date().toISOString();

const DEMO_CREATOR: CreatorCardData = {
  id: "demo-rawan",
  name: "روان الشمعة",
  handle: "@rawan_shamaa",
  avatarUrl: "/creators/spotlight/rawan-shamaa-cover.png",
  coverImageUrl: "/creators/spotlight/rawan-shamaa-cover.png",
  city: "دمشق",
  categories: ["fashion", "lifestyle"],
  verified: true,
  planTier: "GROWTH",
  foundingPartnerNo: null,
  sparkScore: 742,
  trustScore: 88,
  campaignsCount: 4,
  activeCampaigns: 2,
  totalRedemptions: 56,
  conversionRate: 0.12,
  showcaseTagline: "روان الشمعة",
  spotlightRank: 1,
  bio: "صانعة محتوى أزياء ولايف ستايل — حملات حية مع رعات موثّقين",
  createdAt: NOW,
  listingCreatedAt: NOW,
};

const DEMO_NULL_SPARK: CreatorCardData = {
  ...DEMO_CREATOR,
  id: "demo-new",
  sparkScore: null,
  listingCreatedAt: NOW,
};

const DEMO_GRID: CreatorCardData[] = [
  {
    ...DEMO_CREATOR,
    id: "demo-layla",
    name: "ليلى بريميوم",
    handle: "@layla_premium",
    coverImageUrl: null,
    showcaseTagline: null,
    spotlightRank: 2,
    sparkScore: 610,
    totalRedemptions: 34,
  },
  {
    ...DEMO_CREATOR,
    id: "demo-ahmad",
    name: "أحمد تجريبي",
    handle: "@ahmad_demo",
    verified: false,
    coverImageUrl: null,
    city: "حلب",
    categories: ["food"],
    sparkScore: 420,
    activeCampaigns: 1,
    totalRedemptions: 12,
    showcaseTagline: null,
    spotlightRank: null,
  },
];

export function CreatorsPreviewPanel() {
  return (
    <section className="space-y-10">
      <div>
        <h2 className={`${TOKENS.type.cardTitle} text-gold-1`}>Creators Showcase v2</h2>
        <p className="mt-2 text-sm text-dim">Hero + spotlight tiers + null spark</p>
      </div>

      <div>
        <p className="mb-3 text-sm text-dim">Hero (featured creator)</p>
        <CreatorHero
          activeCampaigns={12}
          weeklyRedemptions={48}
          featuredCreator={DEMO_CREATOR}
        />
      </div>

      <div>
        <p className="mb-3 text-sm text-dim">Spotlight (GlassCard)</p>
        <div className="max-w-sm">
          <CreatorSpotlightCard creator={DEMO_CREATOR} preview size="spotlight" />
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm text-dim">Null Spark → «جديد»</p>
        <div className="max-w-sm">
          <CreatorSpotlightCard creator={DEMO_NULL_SPARK} preview size="default" />
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm text-dim">Grid</p>
        <CreatorGrid creators={DEMO_GRID} />
      </div>

      <div>
        <p className="mb-3 text-sm text-dim">Skeleton</p>
        <CreatorCardSkeleton />
      </div>

      <div>
        <p className="mb-3 text-sm text-dim">Empty</p>
        <CreatorEmptyState />
      </div>
    </section>
  );
}
