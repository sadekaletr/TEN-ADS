import type { AchievementData } from "@/components/experience/AchievementCard";

export type DailyMission = {
  id: string;
  title: string;
  reward: number;
  progress: number;
  target: number;
  href: string;
  completed: boolean;
};

export type CreatorRankInfo = {
  rank: number | null;
  totalInScope: number;
  topPercent: number | null;
  city: string | null;
};

export type GamificationContext = {
  monthlySparkValue: number;
  rank: CreatorRankInfo;
  achievements: AchievementData[];
  dailyMissions: DailyMission[];
};

const ACHIEVEMENT_THRESHOLDS = [
  { id: "first_campaign", title: "أول حملة", description: "أطلق حملتك الأولى", target: 1, metric: "campaigns" as const },
  { id: "ten_campaigns", title: "10 حملات", description: "أكمل 10 حملات", target: 10, metric: "campaigns" as const },
  { id: "hundred_redemptions", title: "100 استرداد", description: "حقق 100 استرداد", target: 100, metric: "redemptions" as const },
  { id: "thousand_redemptions", title: "1000 استرداد", description: "حقق 1000 استرداد", target: 1000, metric: "redemptions" as const },
  { id: "elite_creator", title: "Elite Creator", description: "Spark Score فوق 700", target: 700, metric: "sparkScore" as const },
];

export function deriveAchievements(input: {
  completedCampaigns: number;
  totalRedemptions: number;
  sparkScore: number;
}): AchievementData[] {
  const values = {
    campaigns: input.completedCampaigns,
    redemptions: input.totalRedemptions,
    sparkScore: input.sparkScore,
  };

  return ACHIEVEMENT_THRESHOLDS.map((a) => {
    const current = values[a.metric];
    const unlocked = current >= a.target;
    const inProgress = !unlocked && a.metric !== "sparkScore" && current > 0;
    return {
      id: a.id,
      title: a.title,
      description: a.description,
      state: unlocked ? "unlocked" : inProgress ? "in_progress" : "locked",
      progress: a.metric === "sparkScore" ? current : Math.min(current, a.target),
      target: a.target,
    } as AchievementData;
  });
}

export function deriveDailyMissions(input: {
  campaignsCreatedToday: number;
  redemptionsToday: number;
  sponsorsAddedToday: number;
}): DailyMission[] {
  return [
    {
      id: "new_campaign",
      title: "أنشئ حملة جديدة",
      reward: 50,
      progress: Math.min(1, input.campaignsCreatedToday),
      target: 1,
      href: "/dashboard/campaigns/new",
      completed: input.campaignsCreatedToday >= 1,
    },
    {
      id: "new_sponsor",
      title: "أضف راعياً جديداً",
      reward: 100,
      progress: Math.min(1, input.sponsorsAddedToday),
      target: 1,
      href: "/dashboard/campaigns/new",
      completed: input.sponsorsAddedToday >= 1,
    },
    {
      id: "twenty_redemptions",
      title: "حقق 20 استرداداً",
      reward: 200,
      progress: Math.min(20, input.redemptionsToday),
      target: 20,
      href: "/dashboard/campaigns",
      completed: input.redemptionsToday >= 20,
    },
  ];
}

export function deriveRank(input: {
  sparkScore: number;
  peers: { id: string; score: number }[];
  city: string | null;
}): CreatorRankInfo {
  if (input.peers.length === 0) {
    return { rank: null, totalInScope: 0, topPercent: null, city: input.city };
  }
  const sorted = [...input.peers].sort((a, b) => b.score - a.score);
  const idx = sorted.findIndex((p) => p.score <= input.sparkScore);
  const rank = idx === -1 ? sorted.length : idx + 1;
  const topPercent = Math.max(1, Math.round((rank / sorted.length) * 100));
  return {
    rank,
    totalInScope: sorted.length,
    topPercent: Math.min(99, 100 - topPercent + 1),
    city: input.city,
  };
}

export function buildGamificationContext(input: {
  completedCampaigns: number;
  totalRedemptions: number;
  sparkScore: number;
  monthlySparkValue: number;
  campaignsCreatedToday: number;
  redemptionsToday: number;
  sponsorsAddedToday: number;
  rank: CreatorRankInfo;
}): GamificationContext {
  return {
    monthlySparkValue: input.monthlySparkValue,
    rank: input.rank,
    achievements: deriveAchievements({
      completedCampaigns: input.completedCampaigns,
      totalRedemptions: input.totalRedemptions,
      sparkScore: input.sparkScore,
    }),
    dailyMissions: deriveDailyMissions({
      campaignsCreatedToday: input.campaignsCreatedToday,
      redemptionsToday: input.redemptionsToday,
      sponsorsAddedToday: input.sponsorsAddedToday,
    }),
  };
}
