import { describe, expect, it } from "vitest";
import { formatWalletTransaction } from "@/lib/wallet/format-transaction";
import type { WalletTransaction } from "@prisma/client";

function tx(partial: Partial<WalletTransaction>): WalletTransaction {
  return {
    id: "tx1",
    creatorId: "c1",
    type: "TOPUP",
    amount: 5000,
    note: "ShamCash · REF-1",
    createdAt: new Date("2026-06-01T12:00:00Z"),
    campaignId: null,
    ...partial,
  } as WalletTransaction;
}

describe("formatWalletTransaction", () => {
  it("formats TOPUP with Latin digits", () => {
    const formatted = formatWalletTransaction(tx({ amount: 1234 }));
    expect(formatted.title).toBe("شحن 1,234 Spark");
    expect(formatted.positive).toBe(true);
    expect(formatted.title).not.toMatch(/[٠-٩]/);
  });

  it("formats CAMPAIGN_SPEND as negative subtitle", () => {
    const formatted = formatWalletTransaction(
      tx({
        type: "CAMPAIGN_SPEND",
        amount: 2500,
        note: "إطلاق حملة: قهوة مجانية",
      })
    );
    expect(formatted.title).toContain("قهوة مجانية");
    expect(formatted.subtitle).toBe("−2,500 Spark");
    expect(formatted.positive).toBe(false);
  });
});
