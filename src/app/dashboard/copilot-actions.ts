"use server";

import { suggestCampaign } from "@/lib/intelligence/campaign-copilot";
import { getCreatorSession } from "@/lib/session-auth";

export async function suggestCampaignAction(freeText: string) {
  const session = await getCreatorSession();
  if (!session) throw new Error("Unauthorized");
  return suggestCampaign(freeText, session.user.id);
}
