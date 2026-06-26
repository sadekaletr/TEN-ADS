import { CreatorSpotlightCard } from "@/components/creators/CreatorSpotlightCard";
import type { CreatorCardData } from "@/lib/creators/getFeaturedCreators";

interface MarketplaceListingCardProps {
  creator: CreatorCardData;
}

export function MarketplaceListingCard({ creator }: MarketplaceListingCardProps) {
  return <CreatorSpotlightCard creator={creator} size="default" animate={false} />;
}
