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
      "landing.pricing.plans.starter.features.export",
    ],
  },
  {
    id: "growth",
    spark: 10,
    featured: true,
    featureKeys: [
      "landing.pricing.plans.growth.features.verified",
      "landing.pricing.plans.growth.features.pitch",
      "landing.pricing.plans.growth.features.collab",
      "landing.pricing.plans.growth.features.report",
    ],
  },
  {
    id: "scale",
    spark: 50,
    featured: false,
    enterprise: true,
    featureKeys: [
      "landing.pricing.plans.scale.features.priority",
      "landing.pricing.plans.scale.features.analytics",
      "landing.pricing.plans.scale.features.ab",
      "landing.pricing.plans.scale.features.founding",
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
