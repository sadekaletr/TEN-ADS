import { redirect } from "next/navigation";
import { getCreatorSession } from "@/lib/session-auth";
import { prisma } from "@/lib/prisma";
import { CircuitCard } from "@/components/ui/CircuitCard";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { CompetitorAnalyticsCard } from "@/components/dashboard/CompetitorAnalyticsCard";
import { canUseCompetitorAnalytics } from "@/lib/plans/entitlements";

export default async function IntelligenceCheckoutPage() {
  const session = await getCreatorSession();
  if (!session) redirect("/login");

  const [sub, creator] = await Promise.all([
    prisma.intelligenceSubscription.findUnique({
      where: { creatorId: session.user.id },
    }),
    prisma.creator.findUnique({
      where: { id: session.user.id },
      select: { planTier: true },
    }),
  ]);

  return (
    <main className="mx-auto max-w-lg px-4 py-10">
      <h1 className="font-brand text-2xl text-warm-white">TENEGTA Intelligence</h1>
      <p className="mt-2 text-sm text-dim">تحليلات متقدمة، خريطة حرارية، وتوصيات ذكية</p>
      <CircuitCard className="mt-6 space-y-4">
        {sub && sub.activeUntil > new Date() ? (
          <>
            <p className="text-gold-2">اشتراكك نشط حتى {sub.activeUntil.toLocaleDateString("ar-SY")}</p>
            <Button href="/intelligence/heatmap" className="w-full">
              فتح لوحة Intelligence
            </Button>
          </>
        ) : (
          <>
            <p className="text-sm text-dim">
              اطلب تفعيل Intelligence عبر ShamCash أو تواصل مع الإدارة.
            </p>
            <Button href="/dashboard/wallet/topup" variant="secondary" className="w-full">
              شحن المحفظة
            </Button>
            <Link href="/dashboard" className="block text-center text-sm text-gold-2 underline">
              العودة للوحة التحكم
            </Link>
          </>
        )}
      </CircuitCard>
      {creator && canUseCompetitorAnalytics(creator) && (
        <CompetitorAnalyticsCard creatorId={session.user.id} />
      )}
    </main>
  );
}
