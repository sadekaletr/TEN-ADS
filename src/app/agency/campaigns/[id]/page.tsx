import { redirect, notFound } from "next/navigation";
import { getAgencySession } from "@/lib/session-auth";
import { prisma } from "@/lib/prisma";
import { notDeleted } from "@/lib/db";
import { CircuitCard } from "@/components/ui/CircuitCard";
import Link from "next/link";

export default async function AgencyCampaignDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getAgencySession();
  if (!session) redirect("/agency/login");

  const memberIds = await prisma.agencyMember.findMany({
    where: { agencyId: session.user.id, isActive: true },
    select: { creatorId: true },
  });
  const creatorIds = memberIds.map((m) => m.creatorId);

  const campaign = await prisma.campaign.findFirst({
    where: { id: params.id, creatorId: { in: creatorIds }, ...notDeleted },
    include: {
      creator: { select: { name: true, handle: true } },
      sponsor: { select: { name: true } },
    },
  });
  if (!campaign) notFound();

  return (
    <main className="space-y-6">
      <div>
        <Link href="/agency/campaigns" className="text-sm text-gold-2 underline">
          ← الحملات
        </Link>
        <h1 className="mt-2 font-brand text-2xl text-warm-white">{campaign.title}</h1>
        <p className="text-sm text-dim">
          {campaign.creator.name} · {campaign.sponsor.name}
        </p>
      </div>
      <CircuitCard className="grid gap-4 sm:grid-cols-3">
        <div>
          <p className="text-xs text-dim">الحالة</p>
          <p className="font-mono text-gold-1">{campaign.status}</p>
        </div>
        <div>
          <p className="text-xs text-dim">مسترد</p>
          <p className="font-mono text-warm-white">
            {campaign.prizeClaimed}/{campaign.prizeQuantity}
          </p>
        </div>
        <div>
          <p className="text-xs text-dim">الجائزة</p>
          <p>{campaign.prizeName}</p>
        </div>
      </CircuitCard>
    </main>
  );
}
