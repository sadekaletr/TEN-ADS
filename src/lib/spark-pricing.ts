import { getPlatformSettings } from "@/lib/platform-settings";

export const DEFAULT_SPARK_USD_LIST = 7;
export const DEFAULT_SPARK_USD_PARTNER = 3;

export type SparkPricing = {
  listUsd: number;
  partnerUsd: number;
};

export function generatePartnerDiscountCode(handle: string): string {
  const clean = handle.replace(/^@/, "").toUpperCase().replace(/[^A-Z0-9_]/g, "");
  return `SPARK-${clean}`;
}

export async function getSparkPricing(): Promise<SparkPricing> {
  const settings = await getPlatformSettings();
  return {
    listUsd: settings.sparkUsdListPrice ?? DEFAULT_SPARK_USD_LIST,
    partnerUsd: settings.sparkUsdPartnerPrice ?? DEFAULT_SPARK_USD_PARTNER,
  };
}

export function sparkPackageUsd(
  sparkAmount: number,
  usdPerSpark: number
): number {
  return sparkAmount * usdPerSpark;
}

export function formatUsd(amount: number): string {
  return `$${amount}`;
}
