import { getCreatorSession } from "@/lib/session-auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { RequestsPageClient } from "@/components/dashboard/RequestsPageClient";

export default async function RequestsPage() {
  const session = await getCreatorSession();
  if (!session) redirect("/login");

  const requests = await prisma.collabRequest.findMany({
    where: { creatorId: session.user.id, status: "PENDING" },
    include: { sponsor: { select: { name: true, city: true } } },
    orderBy: { createdAt: "desc" },
  });

  return <RequestsPageClient requests={requests} />;
}
