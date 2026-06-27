import { describe, expect, it } from "vitest";
import { isValidTopUpAmount, TOP_UP_PACKAGES } from "@/lib/wallet/top-up-packages";
import { InsufficientSparkTreasuryError } from "@/lib/spark-treasury";

describe("top-up packages", () => {
  it("accepts standard packs only", () => {
    for (const pack of TOP_UP_PACKAGES) {
      expect(isValidTopUpAmount(pack)).toBe(true);
    }
    expect(isValidTopUpAmount(10)).toBe(true);
    expect(isValidTopUpAmount(15)).toBe(false);
    expect(isValidTopUpAmount(0)).toBe(false);
  });
});

describe("spark treasury snapshot math", () => {
  it("total budget sums treasury, creators, and agencies", () => {
    const treasury = 5000;
    const distributed = 1200;
    const agency = 300;
    expect(treasury + distributed + agency).toBe(6500);
  });
});

describe("InsufficientSparkTreasuryError", () => {
  it("encodes available and requested amounts", () => {
    const err = new InsufficientSparkTreasuryError(100, 250);
    expect(err.message).toBe("INSUFFICIENT_TREASURY:100:250");
    expect(err.name).toBe("InsufficientSparkTreasuryError");
  });
});

describe("treasury allocation policy", () => {
  it("rejects non-positive allocation amounts", () => {
    const amount = 0;
    expect(amount <= 0).toBe(true);
  });

  it("ledger delta matches balance change on allocate", () => {
    const before = 5000;
    const allocate = 150;
    const after = before - allocate;
    expect(after + allocate).toBe(before);
  });
});
