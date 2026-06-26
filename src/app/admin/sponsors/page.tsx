import { redirect } from "next/navigation";
import { AdminSponsorsClient } from "@/components/admin/AdminSponsorsClient";
import { notDeleted } from "@/lib/db";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/session-auth";

export default async function AdminSponsorsPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const sponsors = await prisma.sponsor.findMany({
    where: notDeleted,
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      city: true,
      sector: true,
      email: true,
      phone: true,
      logoUrl: true,
      verified: true,
      _count: { select: { campaigns: { where: notDeleted } } },
    },
  });

  return (
    <AdminSponsorsClient
      sponsors={sponsors.map((s) => ({
        id: s.id,
        name: s.name,
        city: s.city,
        sector: s.sector,
        email: s.email,
        phone: s.phone,
        logoUrl: s.logoUrl,
        verified: s.verified,
        campaignsCount: s._count.campaigns,
      }))}
    />
  );
}
