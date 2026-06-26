import { redirect } from "next/navigation";
import { AdminCampaignsClient } from "@/components/admin/AdminCampaignsClient";
import { notDeleted } from "@/lib/db";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/session-auth";

export default async function AdminCampaignsPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const campaigns = await prisma.campaign.findMany({
    where: notDeleted,
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true,
      title: true,
      status: true,
      city: true,
      prizeClaimed: true,
      prizeQuantity: true,
      creator: { select: { name: true, handle: true } },
      sponsor: { select: { name: true } },
    },
  });

  return <AdminCampaignsClient campaigns={campaigns} />;
}
