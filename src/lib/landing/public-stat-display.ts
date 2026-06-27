/** Never show raw "0" on public marketing surfaces — reads as a dead platform. */
export function isPublicStatEmpty(value: number): boolean {
  return !Number.isFinite(value) || value <= 0;
}

export function pickFeaturedStatIndex(values: number[]): number {
  const positive = values.map((v, i) => ({ v, i })).filter(({ v }) => v > 0);
  if (positive.length === 0) return 0;
  return positive.reduce((best, cur) => (cur.v > best.v ? cur : best)).i;
}
