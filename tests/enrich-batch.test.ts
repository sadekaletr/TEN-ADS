import { describe, expect, it } from "vitest";
import { isValidTopUpAmount, TOP_UP_PACKAGE_AMOUNTS } from "@/lib/wallet/topup-packages";

describe("wallet packages", () => {
  it("defines canonical package amounts", () => {
    expect(TOP_UP_PACKAGE_AMOUNTS).toEqual([5, 10, 50]);
  });

  it("validates top-up amounts", () => {
    expect(isValidTopUpAmount(10)).toBe(true);
    expect(isValidTopUpAmount(15)).toBe(false);
    expect(isValidTopUpAmount(7)).toBe(false);
  });
});
