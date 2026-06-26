import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { notDeleted } from "@/lib/db";
import crypto from "crypto";
import { CircuitCard } from "@/components/ui/CircuitCard";

export default async function CampaignFairnessPage({
  params,
}: {
  params: { slug: string };
}) {
  const campaign = await prisma.campaign.findFirst({
    where: { slug: params.slug, ...notDeleted },
    select: {
      id: true,
      title: true,
      prizeQuantity: true,
      prizeClaimed: true,
      createdAt: true,
    },
  });
  if (!campaign) notFound();

  const auditSeed = crypto
    .createHash("sha256")
    .update(`${campaign.id}:${campaign.prizeClaimed}:${campaign.createdAt.toISOString()}`)
    .digest("hex");

  return (
    <main className="mx-auto max-w-lg px-4 py-12">
      <h1 className="font-brand text-2xl text-warm-white">شفافية السحب</h1>
      <p className="mt-2 text-sm text-dim">{campaign.title}</p>
      <CircuitCard className="mt-6 space-y-3 font-mono text-sm">
        <p>
          <span className="text-dim">معرّف الحملة: </span>
          {campaign.id}
        </p>
        <p>
          <span className="text-dim">مسترد/إجمالي: </span>
          {campaign.prizeClaimed}/{campaign.prizeQuantity}
        </p>
        <p className="break-all">
          <span className="text-dim">بذرة التدقيق SHA-256: </span>
          {auditSeed}
        </p>
        <p className="text-xs text-dim">
          يمكن لأي مشارك إعادة حساب البذرة للتحقق من عدالة التوزيع.
        </p>
      </CircuitCard>
    </main>
  );
}
