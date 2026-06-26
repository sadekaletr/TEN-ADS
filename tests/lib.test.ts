import { describe, expect, it } from "vitest";
import { n, spark, currency, percent } from "@/lib/format";
import { storageKeyFromProofUrl } from "@/lib/storage-access";
import { hoursBetween, median, percentile } from "@/lib/stats-utils";

describe("format", () => {
  it("uses Latin digits via en-US", () => {
    expect(n(1234)).toBe("1,234");
    expect(spark(5000)).toBe("5,000");
    expect(currency(100)).toBe("100 ل.س");
    expect(percent(42)).toBe("42%");
  });
});

describe("stats-utils", () => {
  it("computes median", () => {
    expect(median([1, 3, 2])).toBe(2);
    expect(median([1, 2, 3, 4])).toBe(2.5);
    expect(median([])).toBeNull();
  });

  it("computes percentile", () => {
    expect(percentile([1, 2, 3, 4, 5], 90)).toBe(5);
    expect(percentile([], 50)).toBeNull();
  });

  it("computes hours between dates", () => {
    const a = new Date("2026-01-01T00:00:00Z");
    const b = new Date("2026-01-01T12:00:00Z");
    expect(hoursBetween(a, b)).toBe(12);
  });
});

describe("storage-access", () => {
  it("parses api storage URLs", () => {
    expect(storageKeyFromProofUrl("/api/storage/topup-proofs%2Fabc%2Fproof.jpg")).toBe(
      "topup-proofs/abc/proof.jpg"
    );
    expect(storageKeyFromProofUrl("/topup-proofs/old/path.jpg")).toBeNull();
    expect(storageKeyFromProofUrl(null)).toBeNull();
  });
});
