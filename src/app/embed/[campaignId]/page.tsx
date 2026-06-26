import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { notDeleted } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default async function EmbedCampaignPage({
  params,
}: {
  params: { campaignId: string };
}) {
  const campaign = await prisma.campaign.findFirst({
    where: { id: params.campaignId, status: "ACTIVE", ...notDeleted },
    include: {
      sponsor: { select: { name: true } },
      codes: { take: 1 },
    },
  });
  if (!campaign || !campaign.codes[0]) notFound();

  const code = campaign.codes[0].code;

  return (
    <main className="flex min-h-[420px] flex-col items-center justify-center bg-void px-4 py-8 text-center">
      <p className="text-xs uppercase tracking-widest text-gold-3">TENEGTA Spark</p>
      <h1 className="mt-2 font-brand text-xl text-warm-white">{campaign.title}</h1>
      <p className="mt-1 text-sm text-dim">{campaign.prizeName} · {campaign.sponsor.name}</p>
      <Link href={`/c/${code}`} className="mt-6">
        <Button>استلم جائزتك</Button>
      </Link>
    </main>
  );
}
