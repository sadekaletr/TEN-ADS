import { formatCurrency, formatNumber } from "@/lib/format";
import { getPlatformSettings } from "@/lib/platform-settings";

export const SPARK_TO_SYP_FALLBACK = 50_000;

let cachedRate: { value: number; expiresAt: number } | null = null;
const CACHE_TTL_MS = 60_000;

export function sparkToSyp(spark: number, sparkUnit = SPARK_TO_SYP_FALLBACK): number {
  return spark * sparkUnit;
}

export function formatSpark(n: number): string {
  return `${formatNumber(n)} Spark`;
}

export function formatSyp(n: number): string {
  return `≈ ${formatCurrency(n)}`;
}

export async function getSparkUnit(currency = "SYP"): Promise<number> {
  if (cachedRate && cachedRate.expiresAt > Date.now()) {
    return cachedRate.value;
  }

  try {
    const platform = await getPlatformSettings();
    if (platform.sparkUnit) {
      cachedRate = { value: platform.sparkUnit, expiresAt: Date.now() + CACHE_TTL_MS };
      return platform.sparkUnit;
    }

    const { prisma } = await import("@/lib/prisma");
    const rate = await prisma.exchangeRate.findUnique({
      where: { currency },
    });
    const value = rate?.sparkUnit ?? SPARK_TO_SYP_FALLBACK;
    cachedRate = { value, expiresAt: Date.now() + CACHE_TTL_MS };
    return value;
  } catch {
    return SPARK_TO_SYP_FALLBACK;
  }
}
