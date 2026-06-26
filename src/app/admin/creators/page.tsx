import { redirect } from "next/navigation";
import { AdminCreatorsClient } from "@/components/admin/AdminCreatorsClient";
import { notDeleted } from "@/lib/db";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/session-auth";

export default async function AdminCreatorsPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const creators = await prisma.creator.findMany({
    where: notDeleted,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      handle: true,
      email: true,
      verified: true,
      walletBalance: true,
      listing: {
        select: {
          id: true,
          bio: true,
          categories: true,
          isPublic: true,
          coverImageUrl: true,
          showcaseTagline: true,
          spotlightRank: true,
        },
      },
    },
  });

  return <AdminCreatorsClient creators={creators} />;
}
