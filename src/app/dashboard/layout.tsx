import { redirect } from "next/navigation";
import { getCreatorSession } from "@/lib/session-auth";
import { notDeleted } from "@/lib/db";
import { prisma } from "@/lib/prisma";
import { getUnreadCount } from "@/lib/notifications";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { DashboardPageShell } from "@/components/dashboard/DashboardPageShell";
import { DashboardMotionShell } from "@/components/motion/DashboardMotionShell";
import { PartnerSparkBanner } from "@/components/wallet/PartnerSparkBanner";
import { getSparkPricing } from "@/lib/spark-pricing";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCreatorSession();
  if (!session) redirect("/login");

  const creator = await prisma.creator.findFirst({
    where: { id: session.user.id, ...notDeleted },
  });
  if (!creator) redirect("/login");

  const unread = await getUnreadCount(session.user.id, "CREATOR");
  const pricing = await getSparkPricing();
  const showPartnerBanner =
    creator.isPartner && Boolean(creator.partnerDiscountCode);

  return (
    <DashboardMotionShell>
      <div className="min-h-screen">
        <DashboardNav
          creatorName={creator.name}
          walletBalance={creator.walletBalance}
          unreadNotifications={unread}
        />
        {showPartnerBanner && creator.partnerDiscountCode && (
          <div className="mx-auto max-w-6xl px-4 pt-6">
            <PartnerSparkBanner
              creatorName={creator.name}
              discountCode={creator.partnerDiscountCode}
              listUsd={pricing.listUsd}
              partnerUsd={pricing.partnerUsd}
            />
          </div>
        )}
        <div className="mx-auto max-w-6xl px-4 py-8 pb-safe">
          <DashboardPageShell>{children}</DashboardPageShell>
        </div>
      </div>
    </DashboardMotionShell>
  );
}
