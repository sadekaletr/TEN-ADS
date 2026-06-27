import type { Creator, CreatorPlanTier } from "@prisma/client";

export const PLAN_RANK: Record<CreatorPlanTier, number> = {
  STARTER: 0,
  GROWTH: 1,
  SCALE: 2,
};

export function planAtLeast(
  tier: CreatorPlanTier | null | undefined,
  min: CreatorPlanTier
): boolean {
  const current = tier ?? "STARTER";
  return PLAN_RANK[current] >= PLAN_RANK[min];
}

export function canUsePitch(creator: Pick<Creator, "planTier">): boolean {
  return planAtLeast(creator.planTier, "GROWTH");
}

export function maxCoCampaignPartners(tier: CreatorPlanTier | null | undefined): number {
  if (planAtLeast(tier, "SCALE")) return Infinity;
  if (planAtLeast(tier, "GROWTH")) return 2;
  return 0;
}

export function isVerifiedByPlan(creator: Pick<Creator, "planTier">): boolean {
  return planAtLeast(creator.planTier, "GROWTH");
}

export function hasMarketplacePriority(creator: Pick<Creator, "planTier">): boolean {
  return planAtLeast(creator.planTier, "SCALE");
}

export function canReceiveMonthlyReport(creator: Pick<Creator, "planTier">): boolean {
  return planAtLeast(creator.planTier, "GROWTH");
}

export function canUseCompetitorAnalytics(creator: Pick<Creator, "planTier">): boolean {
  return planAtLeast(creator.planTier, "SCALE");
}

export function canUseCampaignAbTest(creator: Pick<Creator, "planTier">): boolean {
  return planAtLeast(creator.planTier, "SCALE");
}

export function hasPrioritySupport(creator: Pick<Creator, "planTier">): boolean {
  return planAtLeast(creator.planTier, "SCALE");
}

export const FOUNDING_PARTNER_LIMIT = 100;

export function isFoundingPartner(creator: Pick<Creator, "foundingPartnerNo">): boolean {
  return creator.foundingPartnerNo != null && creator.foundingPartnerNo > 0;
}

export function displayVerified(creator: Pick<Creator, "verified" | "planTier">): boolean {
  return creator.verified || isVerifiedByPlan(creator);
}
