import { formatNumber } from "@/lib/format";
import { sparkToSyp } from "@/lib/spark";
import { sparkPackageUsd } from "@/lib/spark-pricing";
import { tierCostPerRedemption } from "@/lib/campaign-tiers";

export const TOP_UP_PACKAGE_AMOUNTS = [5, 10, 50] as const;

export type TopUpPackAmount = (typeof TOP_UP_PACKAGE_AMOUNTS)[number];

export function isValidTopUpAmount(amount: number): amount is TopUpPackAmount {
  return (TOP_UP_PACKAGE_AMOUNTS as readonly number[]).includes(amount);
}

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

  return TOP_UP_PACKAGE_AMOUNTS.map((amount, index) => {
    const featured = amount === 10;
    const basic = basicCampaigns(amount);
    const pro = proCampaigns(amount);
    const resultTexts = [
      `كافٍ لحوالي ${formatNumber(basic)} حملات أساسية`,
      `كافٍ لحوالي ${formatNumber(pro)} حملات محترفة أو ${formatNumber(basic)} أساسية`,
      `كافٍ لحوالي ${formatNumber(basic)}+ حملة أو ${formatNumber(pro)} إمبراطورية`,
    ];
    return {
      amount,
      priceSYP: sparkToSyp(amount, sparkUnit),
      ...usdFields(amount),
      resultText: resultTexts[index]!,
      featured,
    };
  });
}
