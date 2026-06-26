import type { PlatformSettings } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type TransferSettings = {
  transferMethod: string;
  transferAccount: string;
  transferInstructions: string | null;
};

export type PlatformConfig = TransferSettings & {
  sparkUnit: number | null;
  sparkUsdListPrice: number | null;
  sparkUsdPartnerPrice: number | null;
  sparkTreasuryBalance: number;
  featuredCampaignId: string | null;
  featuredCreatorId: string | null;
  heroCampaignId: string | null;
  maxPrizeQuantity: number | null;
  testimonialQuote: string | null;
  testimonialAuthor: string | null;
  landingVideoUrl: string | null;
};

const DEFAULTS: TransferSettings = {
  transferMethod: process.env.TOPUP_TRANSFER_METHOD ?? "ShamCash",
  transferAccount: process.env.TOPUP_TRANSFER_ACCOUNT ?? "09xxxxxxxx",
  transferInstructions:
    process.env.TOPUP_TRANSFER_INSTRUCTIONS ??
    "حوّل المبلغ إلى الحساب أدناه ثم ارفع صورة الإثبات وأدخل رقم العملية.",
};

function mapRow(row: PlatformSettings | null): PlatformConfig {
  if (!row) {
    return { ...DEFAULTS, sparkUnit: null, sparkUsdListPrice: null, sparkUsdPartnerPrice: null, sparkTreasuryBalance: 0, featuredCampaignId: null, featuredCreatorId: null, heroCampaignId: null, maxPrizeQuantity: null, testimonialQuote: null, testimonialAuthor: null, landingVideoUrl: null };
  }
  return {
    transferMethod: row.transferMethod,
    transferAccount: row.transferAccount,
    transferInstructions: row.transferInstructions,
    sparkUnit: row.sparkUnit,
    sparkUsdListPrice: row.sparkUsdListPrice,
    sparkUsdPartnerPrice: row.sparkUsdPartnerPrice,
    sparkTreasuryBalance: row.sparkTreasuryBalance,
    featuredCampaignId: row.featuredCampaignId,
    featuredCreatorId: row.featuredCreatorId,
    heroCampaignId: row.heroCampaignId,
    maxPrizeQuantity: row.maxPrizeQuantity,
    testimonialQuote: row.testimonialQuote,
    testimonialAuthor: row.testimonialAuthor,
    landingVideoUrl: row.landingVideoUrl,
  };
}

export async function getPlatformSettings(): Promise<PlatformConfig> {
  const row = await prisma.platformSettings.findUnique({ where: { id: "default" } });
  return mapRow(row);
}

export async function unfeatureCampaignIfFeatured(campaignId: string) {
  const settings = await prisma.platformSettings.findUnique({ where: { id: "default" } });
  if (!settings) return;
  const data: { featuredCampaignId?: null; heroCampaignId?: null } = {};
  if (settings.featuredCampaignId === campaignId) data.featuredCampaignId = null;
  if (settings.heroCampaignId === campaignId) data.heroCampaignId = null;
  if (Object.keys(data).length === 0) return;
  await prisma.platformSettings.update({ where: { id: "default" }, data });
}

export async function getTransferSettings(): Promise<TransferSettings> {
  const s = await getPlatformSettings();
  return {
    transferMethod: s.transferMethod,
    transferAccount: s.transferAccount,
    transferInstructions: s.transferInstructions,
  };
}
