export type PricingPlanId = "starter" | "growth" | "scale";

export type PricingPlan = {
  id: PricingPlanId;
  spark: number;
  featured: boolean;
  enterprise?: boolean;
  featureKeys: readonly string[];
};

export const PRICING_PLANS: readonly PricingPlan[] = [
  {
    id: "starter",
    spark: 5,
    featured: false,
    featureKeys: [
      "landing.pricing.plans.starter.features.campaigns",
      "landing.pricing.plans.starter.features.redeem",
      "landing.pricing.plans.starter.features.dashboard",
      "landing.pricing.plans.starter.features.support",
    ],
  },
  {
    id: "growth",
    spark: 10,
    featured: true,
    featureKeys: [
      "landing.pricing.plans.growth.features.campaigns",
      "landing.pricing.plans.growth.features.tiers",
      "landing.pricing.plans.growth.features.analytics",
      "landing.pricing.plans.growth.features.priority",
    ],
  },
  {
    id: "scale",
    spark: 50,
    featured: false,
    enterprise: true,
    featureKeys: [
      "landing.pricing.plans.scale.features.volume",
      "landing.pricing.plans.scale.features.multi",
      "landing.pricing.plans.scale.features.agency",
      "landing.pricing.plans.scale.features.dedicated",
    ],
  },
] as const;

export const PRICING_PLAN_AMOUNTS = PRICING_PLANS.map((p) => p.spark);

export function getPricingPlanBySpark(spark: number): PricingPlan | undefined {
  return PRICING_PLANS.find((p) => p.spark === spark);
}

export function getPricingPlanById(id: PricingPlanId): PricingPlan {
  const plan = PRICING_PLANS.find((p) => p.id === id);
  if (!plan) throw new Error(`Unknown pricing plan: ${id}`);
  return plan;
}
