import { redirect } from "next/navigation";
import { getSponsorSession } from "@/lib/session-auth";
import { prisma } from "@/lib/prisma";
import { notDeleted } from "@/lib/db";
import { SponsorPitchBuilderClient } from "@/components/sponsor/SponsorPitchBuilderClient";

export default async function SponsorPitchBuilderPage() {
  const session = await getSponsorSession();
  if (!session) redirect("/sponsor/login");

  const campaigns = await prisma.campaign.findMany({
    where: { sponsorId: session.user.id, ...notDeleted, status: { in: ["ACTIVE", "ENDED"] } },
    include: { sponsor: { select: { name: true } } },
    orderBy: { prizeClaimed: "desc" },
    take: 20,
  });

  return <SponsorPitchBuilderClient campaigns={campaigns} />;
}
