import { getAgencySession } from "@/lib/session-auth";
import { prisma } from "@/lib/prisma";
import { getCreatorAnalytics } from "@/lib/analytics";
import { redirect } from "next/navigation";
import { AgencyMemberCard } from "@/components/agency/AgencyMemberCard";
import { KpiStrip } from "@/components/ui/KpiStrip";
import { PageHeader } from "@/components/ui/PageHeader";

export default async function AgencyDashboardPage() {
  const session = await getAgencySession();
  if (!session) redirect("/agency/login");

  const agency = await prisma.agency.findUnique({
    where: { id: session.user.id },
    include: {
      members: {
        where: { isActive: true },
        include: {
          creator: { select: { id: true, name: true, handle: true } },
        },
      },
    },
  });
  if (!agency) redirect("/agency/login");

  const memberStats = await Promise.all(
    agency.members.map(async (m) => {
      const analytics = await getCreatorAnalytics(m.creator.id);
      return { member: m, analytics };
    })
  );

  const totalMonthlySpend = memberStats.reduce((s, x) => s + x.member.spentThisMonth, 0);

  return (
    <div className="space-y-6">
      <PageHeader title={agency.name} description="لوحة الوكالة" />

      <KpiStrip
        items={[
          {
            label: "رصيد الوكالة",
            value: agency.walletBalance,
            hint: "سبارك",
          },
          { label: "الأعضاء", value: agency.members.length },
          {
            label: "الإنفاق الشهري الكلي",
            value: totalMonthlySpend,
            hint: "سبارك",
          },
        ]}
      />

      <h2 className="text-lg text-warm-white">الأعضاء</h2>
      <div className="space-y-3">
        {memberStats.length === 0 ? (
          <p className="text-sm text-dim">لا يوجد أعضاء نشطون — أضف أعضاء من صفحة الأعضاء.</p>
        ) : (
          memberStats.map(({ member, analytics }) => (
            <AgencyMemberCard
              key={member.id}
              name={member.creator.name}
              handle={member.creator.handle}
              spendingLimit={member.spendingLimit}
              spentThisMonth={member.spentThisMonth}
              redemptions={analytics.funnel.redemptions}
            />
          ))
        )}
      </div>
    </div>
  );
}
