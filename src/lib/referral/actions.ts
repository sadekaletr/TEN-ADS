"use server";

import { createReferralToken } from "@/lib/referral/token";

export async function getReferralShareUrl(
  phone: string,
  campaignId: string,
  code: string
): Promise<string> {
  const token = createReferralToken(phone, campaignId);
  const base = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  return `${base}/c/${encodeURIComponent(code)}?ref=${encodeURIComponent(token)}`;
}
