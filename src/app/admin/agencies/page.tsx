import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/session-auth";
import { prisma } from "@/lib/prisma";
import { getSparkTreasurySnapshot } from "@/lib/spark-treasury";
import { AdminAgenciesClient } from "@/components/admin/AdminAgenciesClient";

export default async function AdminAgenciesPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const [agencies, pendingTopUps, treasury] = await Promise.all([
    prisma.agency.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { members: { where: { isActive: true } } } },
      },
    }),
    prisma.agencyTopUpRequest.findMany({
      where: { status: "PENDING" },
      include: { agency: { select: { name: true, email: true } } },
      orderBy: { createdAt: "desc" },
    }),
    getSparkTreasurySnapshot(),
  ]);

  const rows = agencies.map((a) => ({
    id: a.id,
    name: a.name,
    email: a.email,
    walletBalance: a.walletBalance,
    memberCount: a._count.members,
    createdAt: a.createdAt,
  }));

  return (
    <AdminAgenciesClient
      agencies={rows}
      pendingTopUps={pendingTopUps}
      treasuryBalance={treasury.treasuryBalance}
    />
  );
}
