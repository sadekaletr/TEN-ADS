export type CreatorLevelId = "new" | "active" | "verified" | "partner";

export type CreatorLevel = {
  id: CreatorLevelId;
  label: string;
  minCampaigns: number;
};

export const CREATOR_LEVELS: CreatorLevel[] = [
  { id: "new", label: "صانع جديد", minCampaigns: 0 },
  { id: "active", label: "صانع نشط", minCampaigns: 1 },
  { id: "verified", label: "صانع موثّق", minCampaigns: 3 },
  { id: "partner", label: "شريك مؤسس", minCampaigns: 8 },
];

export function getCreatorLevel(completedCampaigns: number): {
  current: CreatorLevel;
  next: CreatorLevel | null;
  progress: number;
} {
  let current = CREATOR_LEVELS[0];
  for (const level of CREATOR_LEVELS) {
    if (completedCampaigns >= level.minCampaigns) current = level;
  }
  const idx = CREATOR_LEVELS.findIndex((l) => l.id === current.id);
  const next = CREATOR_LEVELS[idx + 1] ?? null;
  if (!next) {
    return { current, next: null, progress: 100 };
  }
  const span = next.minCampaigns - current.minCampaigns;
  const done = completedCampaigns - current.minCampaigns;
  const progress = Math.min(100, Math.round((done / span) * 100));
  return { current, next, progress };
}
