"use client";

import { memo } from "react";
import { CreatorSpotlightCard } from "@/components/creators/CreatorSpotlightCard";
import type { CreatorCardData } from "@/lib/creators/getFeaturedCreators";

interface MarketplaceListingCardProps {
  creator: CreatorCardData;
  variant?: "default" | "hero";
}

export const MarketplaceListingCard = memo(function MarketplaceListingCard({
  creator,
  variant = "default",
}: MarketplaceListingCardProps) {
  return (
    <div className="h-full">
      <CreatorSpotlightCard
        creator={creator}
        size={variant === "hero" ? "hero" : "default"}
        animate={false}
      />
    </div>
  );
});
