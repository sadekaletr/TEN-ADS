import { formatNumber } from "@/lib/format";
import { sparkToSyp } from "@/lib/spark";
import { sparkPackageUsd } from "@/lib/spark-pricing";
import { tierCostPerRedemption } from "@/lib/campaign-tiers";

export const TYPICAL_CAMPAIGN_COST_DEFAULT = 10;

export type TopUpPackage = {
  amount: number;
  priceSYP: number;
  priceUSD: number;
  listPriceUSD?: number;
  resultText: string;
  featured?: boolean;
};

function basicCampaigns(amount: number): number {
  return Math.max(1, Math.floor(amount / tierCostPerRedemption("BASIC")));
}

function proCampaigns(amount: number): number {
  return Math.max(1, Math.floor(amount / tierCostPerRedemption("PRO")));
}

export function buildTopUpPackages(
  sparkUnit: number,
  usdPerSpark: number,
  listUsdPerSpark?: number
): TopUpPackage[] {
  const listUsd =
    listUsdPerSpark && listUsdPerSpark !== usdPerSpark ? listUsdPerSpark : undefined;

  function usdFields(amount: number) {
    return {
      priceUSD: sparkPackageUsd(amount, usdPerSpark),
      listPriceUSD: listUsd ? sparkPackageUsd(amount, listUsd) : undefined,
    };
  }

  return [
    {
      amount: 5,
      priceSYP: sparkToSyp(5, sparkUnit),
      ...usdFields(5),
      resultText: `كافٍ لحوالي ${formatNumber(basicCampaigns(5))} حملات أساسية`,
    },
    {
      amount: 15,
      priceSYP: sparkToSyp(15, sparkUnit),
      ...usdFields(15),
      resultText: `كافٍ لحوالي ${formatNumber(proCampaigns(15))} حملات محترفة أو ${formatNumber(basicCampaigns(15))} أساسية`,
      featured: true,
    },
    {
      amount: 30,
      priceSYP: sparkToSyp(30, sparkUnit),
      ...usdFields(30),
      resultText: `كافٍ لحوالي ${formatNumber(basicCampaigns(30))}+ حملة أو ${formatNumber(proCampaigns(30))} إمبراطورية`,
    },
  ];
}
