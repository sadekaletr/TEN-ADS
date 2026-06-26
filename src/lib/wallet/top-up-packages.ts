/** Allowed creator top-up pack sizes (Spark units). */
export const TOP_UP_PACKAGES = [5, 15, 30] as const;

export type TopUpPackage = (typeof TOP_UP_PACKAGES)[number];

export function isValidTopUpAmount(amount: number): amount is TopUpPackage {
  return (TOP_UP_PACKAGES as readonly number[]).includes(amount);
}
