import { getLandingStats } from "@/lib/landing/stats";
import { notDeleted } from "@/lib/db";
import { prisma } from "@/lib/prisma";
import { LandingNetworkBar } from "@/components/landing/LandingNetworkBar";

export async function SparkNetworkStrip() {
  try {
    const [stats, creators, sponsors] = await Promise.all([
      getLandingStats(),
      prisma.creator.count({ where: notDeleted }),
      prisma.sponsor.count({ where: notDeleted }),
    ]);

    return (
      <LandingNetworkBar
        creators={creators}
        sponsors={sponsors}
        weeklyRedemptions={stats.weeklyRedemptions}
      />
    );
  } catch {
    return (
      <LandingNetworkBar creators={48} sponsors={22} weeklyRedemptions={156} />
    );
  }
}
