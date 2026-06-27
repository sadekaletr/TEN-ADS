import { notFound } from "next/navigation";
import { PitchDeckLive } from "@/components/pitch/PitchDeckLive";
import { PitchUpgradeGate } from "@/components/pitch/PitchUpgradeGate";
import { canUsePitch } from "@/lib/plans/entitlements";
import {
  getCreatorPitchData,
  RESERVED_HANDLES,
} from "@/lib/pitch/get-creator-pitch-data";
import { prisma } from "@/lib/prisma";
import { notDeleted } from "@/lib/db";

export default async function CreatorPitchPage({
  params,
}: {
  params: { handle: string };
}) {
  const handle = decodeURIComponent(params.handle).replace(/^@/, "").toLowerCase();
  if (RESERVED_HANDLES.has(handle)) notFound();

  const creator = await prisma.creator.findFirst({
    where: {
      OR: [{ handle: `@${handle}` }, { handle }],
      ...notDeleted,
    },
    select: { planTier: true },
  });
  if (!creator) notFound();
  if (!canUsePitch(creator)) {
    return <PitchUpgradeGate planHint="growth" />;
  }

  const data = await getCreatorPitchData(handle);
  if (!data) notFound();

  return <PitchDeckLive data={data} />;
}
