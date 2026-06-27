import { notDeleted } from "@/lib/db";
import { prisma } from "@/lib/prisma";
import {
  extractPrizeName,
  extractQuantity,
  extractSector,
  suggestCampaignFromText,
  type CopilotSuggestion,
} from "@/lib/intelligence/copilot-heuristics";

export type { CopilotSuggestion } from "@/lib/intelligence/copilot-heuristics";
export {
  extractPrizeName,
  extractQuantity,
  extractSector,
  suggestCampaignFromText,
} from "@/lib/intelligence/copilot-heuristics";

export async function suggestCampaign(
  freeTextInput: string,
  creatorId: string
): Promise<CopilotSuggestion> {
  const sector = extractSector(freeTextInput);

  const creator = await prisma.creator.findUnique({
    where: { id: creatorId },
    include: {
      campaigns: {
        where: { ...notDeleted },
        include: { sponsor: true },
        take: 20,
        orderBy: { createdAt: "desc" },
      },
    },
  });

  const city = creator?.campaigns[0]?.city ?? undefined;

  const similar =
    creator?.campaigns.filter((c) => (sector ? c.sponsor.sector === sector : true)) ?? [];

  const avgCost =
    similar.length > 0
      ? Math.round(similar.reduce((s, c) => s + c.costPerRedemption, 0) / similar.length)
      : 2;

  return suggestCampaignFromText(freeTextInput, { city, avgCost });
}
