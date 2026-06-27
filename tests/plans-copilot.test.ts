import { describe, expect, it } from "vitest";
import {
  extractQuantity,
  extractSector,
  suggestCampaignFromText,
} from "@/lib/intelligence/copilot-heuristics";
import {
  maxCoCampaignPartners,
  isVerifiedByPlan,
  canUsePitch,
} from "@/lib/plans/entitlements";

describe("copilot-heuristics", () => {
  it("detects food sector from Arabic text", () => {
    expect(extractSector("مطعم برجر في دمشق")).toBe("food");
  });

  it("suggests campaign from free text", () => {
    const s = suggestCampaignFromText("20 وجبة برجر مجانية");
    expect(s.suggestedQuantity).toBe(20);
    expect(s.title).toContain("برجر");
  });
});

describe("plan entitlements", () => {
  it("gates pitch to Growth+", () => {
    expect(canUsePitch({ planTier: "STARTER" })).toBe(false);
    expect(canUsePitch({ planTier: "GROWTH" })).toBe(true);
  });

  it("limits co-campaign partners by tier", () => {
    expect(maxCoCampaignPartners("STARTER")).toBe(0);
    expect(maxCoCampaignPartners("GROWTH")).toBe(2);
    expect(maxCoCampaignPartners("SCALE")).toBe(Infinity);
  });

  it("grants verified badge via Growth plan", () => {
    expect(isVerifiedByPlan({ planTier: "GROWTH" })).toBe(true);
  });
});
