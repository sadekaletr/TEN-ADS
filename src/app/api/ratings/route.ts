import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { triggerTrustRecalcForCampaign } from "@/lib/intelligence/trust-score";

const ratingSchema = z.object({
  redemptionId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(500).optional(),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = ratingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "validation_failed" }, { status: 400 });
  }

  const redemption = await prisma.redemption.findUnique({
    where: { id: parsed.data.redemptionId },
    include: { rating: true },
  });
  if (!redemption) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  if (redemption.rating) {
    return NextResponse.json({ error: "already_rated" }, { status: 409 });
  }

  await prisma.participantRating.create({
    data: {
      redemptionId: parsed.data.redemptionId,
      rating: parsed.data.rating,
      comment: parsed.data.comment,
    },
  });

  await triggerTrustRecalcForCampaign(redemption.campaignId);

  return NextResponse.json({ ok: true });
}
