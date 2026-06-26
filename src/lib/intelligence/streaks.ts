import { notDeleted } from "@/lib/db";
import { prisma } from "@/lib/prisma";

function getWeekStart(d = new Date()): Date {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  date.setDate(diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

export async function computeSponsorStreaks() {
  const weekStart = getWeekStart();
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);

  const sponsors = await prisma.sponsor.findMany({
    where: { deletedAt: null },
    select: { id: true, currentStreak: true, longestStreak: true },
  });

  let updated = 0;
  for (const sponsor of sponsors) {
    const activeThisWeek = await prisma.campaign.count({
      where: {
        sponsorId: sponsor.id,
        ...notDeleted,
        OR: [
          {
            status: "ACTIVE",
            createdAt: { gte: weekStart, lt: weekEnd },
          },
          {
            status: "ENDED",
            endsAt: { gte: weekStart, lt: weekEnd },
          },
        ],
      },
    });

    const newStreak = activeThisWeek > 0 ? sponsor.currentStreak + 1 : 0;
    const longest = Math.max(sponsor.longestStreak, newStreak);

    await prisma.sponsor.update({
      where: { id: sponsor.id },
      data: {
        currentStreak: newStreak,
        longestStreak: longest,
        lastActiveWeek: activeThisWeek > 0 ? weekStart : undefined,
      },
    });
    updated++;
  }
  return updated;
}

export function getStreakDiscount(streak: number): number {
  if (streak >= 8) return 0.2;
  if (streak >= 4) return 0.1;
  return 0;
}

export function applyStreakDiscount(
  costPerRedemption: number,
  streak: number
): number {
  const discount = getStreakDiscount(streak);
  return Math.max(1, Math.round(costPerRedemption * (1 - discount)));
}
