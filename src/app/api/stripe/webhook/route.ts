import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { allocateSparkFromTreasury } from "@/lib/spark-treasury";

export async function POST(req: Request) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const body = await req.text();
  const sig = headers().get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "no_sig" }, { status: 400 });

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch {
    return NextResponse.json({ error: "invalid_sig" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const creatorId = session.metadata?.creatorId;
    const sparkAmount = Number(session.metadata?.sparkAmount ?? 0);
    if (creatorId && sparkAmount > 0) {
      await prisma.$transaction(async (tx) => {
        await allocateSparkFromTreasury(tx, sparkAmount, "stripe.checkout", {
          actorId: creatorId,
          actorType: "creator",
          metadata: { sessionId: session.id },
        });
        await tx.creator.update({
          where: { id: creatorId },
          data: { walletBalance: { increment: sparkAmount } },
        });
        await tx.walletTransaction.create({
          data: {
            creatorId,
            type: "TOPUP",
            amount: sparkAmount,
            note: `Stripe checkout ${session.id}`,
          },
        });
      });
    }
  }

  return NextResponse.json({ received: true });
}
