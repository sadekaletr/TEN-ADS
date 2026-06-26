import type { CampaignTier } from "@prisma/client";

export type TierId = CampaignTier;

export type TierFeature = {
  label: string;
  included: boolean;
};

export type TierDefinition = {
  id: TierId;
  name: string;
  nameAr: string;
  costPerRedemption: number;
  tagline: string;
  popular?: boolean;
  features: TierFeature[];
};

export const TIER_DEFINITIONS: TierDefinition[] = [
  {
    id: "BASIC",
    name: "Spark 1",
    nameAr: "أساسي",
    costPerRedemption: 1,
    tagline: "للتجربة السريعة",
    features: [
      { label: "كود واحد للجميع", included: true },
      { label: "تصدير CSV", included: true },
      { label: "كود فريد لكل فائز", included: false },
      { label: "تحقق بالكاميرا", included: false },
      { label: "تصدير PDF", included: false },
      { label: "حملة مشتركة (شركاء)", included: false },
    ],
  },
  {
    id: "PRO",
    name: "Spark 2",
    nameAr: "محترف",
    costPerRedemption: 2,
    tagline: "الأكثر شعبية",
    popular: true,
    features: [
      { label: "كود واحد أو فريد لكل فائز", included: true },
      { label: "تحقق فوري بالكاميرا", included: true },
      { label: "تصدير PDF احترافي", included: true },
      { label: "شارة «حملة محترفة»", included: true },
      { label: "تصدير CSV", included: true },
      { label: "حملة مشتركة (شركاء)", included: false },
    ],
  },
  {
    id: "EMPIRE",
    name: "Spark 3",
    nameAr: "إمبراطوري",
    costPerRedemption: 3,
    tagline: "أعلى قيمة وانتشار",
    features: [
      { label: "كل ميزات المحترف", included: true },
      { label: "شركاء متعددون (Co-Campaign)", included: true },
      { label: "أولوية في Marketplace", included: true },
      { label: "تعزيز Trust Score مؤقت", included: true },
      { label: "تحليلات Heatmap مجانية", included: true },
    ],
  },
];

export function getTierDefinition(tier: TierId): TierDefinition {
  return TIER_DEFINITIONS.find((t) => t.id === tier) ?? TIER_DEFINITIONS[0];
}

export function tierCostPerRedemption(tier: TierId): number {
  return getTierDefinition(tier).costPerRedemption;
}

export function allowsUniqueCodes(tier: TierId): boolean {
  return tier !== "BASIC";
}

export function allowsCollaborators(tier: TierId): boolean {
  return tier === "EMPIRE";
}

export function allowsPdfExport(tier: TierId): boolean {
  return tier !== "BASIC";
}

export function isProCampaign(tier: TierId): boolean {
  return tier === "PRO" || tier === "EMPIRE";
}

export const EMPIRE_BOOST_DAYS = 14;
