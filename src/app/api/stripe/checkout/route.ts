import { NextResponse } from "next/server";
import { z } from "zod";
import { getCreatorSession } from "@/lib/session-auth";
import { getStripe, sparkPackagePriceUsd, validateStripePackage } from "@/lib/stripe";
import { featureFlags } from "@/lib/feature-flags";

const bodySchema = z.object({
  amount: z.number().int().positive(),
});

export async function POST(req: Request) {
  if (!featureFlags.stripeCheckout) {
    return NextResponse.json({ error: "stripe_disabled" }, { status: 503 });
  }

  const session = await getCreatorSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const stripe = getStripe();
  if (!stripe) return NextResponse.json({ error: "stripe_not_configured" }, { status: 503 });

  const { amount } = bodySchema.parse(await req.json());
  if (!validateStripePackage(amount)) {
    return NextResponse.json({ error: "invalid_package" }, { status: 400 });
  }

  const priceUsd = sparkPackagePriceUsd(amount);
  if (!priceUsd) return NextResponse.json({ error: "invalid_package" }, { status: 400 });

  const base = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

  const checkout = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: priceUsd * 100,
          product_data: {
            name: `${amount} Spark`,
            description: "TENEGTA Spark wallet top-up",
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      creatorId: session.user.id,
      sparkAmount: String(amount),
    },
    success_url: `${base}/dashboard/wallet?stripe=success`,
    cancel_url: `${base}/dashboard/wallet/topup?stripe=cancel`,
  });

  return NextResponse.json({ url: checkout.url });
}
