export interface CopilotSuggestion {
  title: string;
  codeMode: "SHARED" | "UNIQUE";
  suggestedCostPerRedemption: number;
  suggestedQuantity: number;
  storyText: string;
  prizeName: string;
  city?: string;
  sector?: string;
}

const SECTOR_KEYWORDS: Record<string, string[]> = {
  food: ["مطعم", "مقهى", "برجر", "بيتزا", "وجبة", "أكل", "قهوة"],
  fashion: ["ملابس", "أزياء", "موضة", "فستان", "قميص"],
  tech: ["تقنية", "هاتف", "لابتوب", "تكنولوجيا", "جوال"],
};

export function extractSector(text: string): string | undefined {
  const lower = text.toLowerCase();
  for (const [sector, keywords] of Object.entries(SECTOR_KEYWORDS)) {
    if (keywords.some((k) => lower.includes(k))) return sector;
  }
  return undefined;
}

export function extractQuantity(text: string): number {
  const arabicDigits = "٠١٢٣٤٥٦٧٨٩";
  const normalized = text.replace(/[٠-٩]/g, (d) => String(arabicDigits.indexOf(d)));
  const match = normalized.match(/\d+/);
  return match ? Math.min(500, Math.max(1, parseInt(match[0], 10))) : 10;
}

export function extractPrizeName(text: string): string {
  const food = text.match(/(?:وجبة|برجر|قهوة|بيتزا)\s*[\w\u0600-\u06FF]*/i);
  if (food) return food[0];
  return "جائزة حصرية";
}

export function suggestCampaignFromText(
  freeTextInput: string,
  options?: { city?: string; avgCost?: number }
): CopilotSuggestion {
  const sector = extractSector(freeTextInput);
  const quantity = extractQuantity(freeTextInput);
  const prizeName = extractPrizeName(freeTextInput);
  const avgCost = options?.avgCost ?? 2;
  const codeMode: "SHARED" | "UNIQUE" = quantity <= 5 ? "UNIQUE" : "SHARED";

  const title = sector
    ? `حملة ${sector === "food" ? "مطعم" : sector === "fashion" ? "أزياء" : "تقنية"} — ${prizeName}`
    : `حملة ${prizeName}`;

  const storyText = `${prizeName} بانتظارك!\n${quantity} جائزة متاحة الآن\nامسح الكود واستلم جائزتك عبر TENEGTA Spark`;

  return {
    title,
    codeMode,
    suggestedCostPerRedemption: avgCost,
    suggestedQuantity: quantity,
    storyText,
    prizeName,
    city: options?.city,
    sector,
  };
}
