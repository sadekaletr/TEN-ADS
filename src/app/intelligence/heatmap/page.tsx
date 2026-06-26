import { Suspense } from "react";
import { SkeletonHeatmap } from "@/components/ui/SkeletonCard";
import { getHeatmapData, hasActiveIntelligenceSubscription } from "@/lib/intelligence/heatmap";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { HeatmapClient } from "@/components/intelligence/HeatmapClient";
import { CircuitPageBackground } from "@/components/ui/CircuitPageBackground";
import { SurfaceCard } from "@/components/ui/SurfaceCard";

export default async function HeatmapPage({
  searchParams,
}: {
  searchParams: { days?: string; sector?: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user.role) redirect("/login");

  const allowed = await hasActiveIntelligenceSubscription(
    session.user.id,
    session.user.role
  );
  if (!allowed) {
    return (
      <CircuitPageBackground>
        <main className="mx-auto max-w-lg px-4 py-16 text-center">
          <SurfaceCard>
            <h1 className="font-brand text-xl text-gold-accent">Spark Intelligence</h1>
            <p className="mt-4 text-text-secondary">
              هذه الصفحة تتطلب اشتراك Spark Intelligence فعّالاً
            </p>
          </SurfaceCard>
        </main>
      </CircuitPageBackground>
    );
  }

  const days = searchParams.days === "30" ? 30 : 7;
  const data = await getHeatmapData(days, searchParams.sector);

  return (
    <CircuitPageBackground>
      <main className="mx-auto min-h-screen max-w-3xl px-4 py-10">
        <h1 className="font-brand text-2xl font-semibold text-warm-white">
          Spark Heatmap
        </h1>
        <p className="text-sm text-dim">كثافة الاستردادات عبر سوريا</p>
        <Suspense fallback={<SkeletonHeatmap />}>
          <HeatmapClient data={data} days={days} sector={searchParams.sector} />
        </Suspense>
      </main>
    </CircuitPageBackground>
  );
}
