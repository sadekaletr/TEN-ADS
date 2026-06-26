import Stripe from "stripe";
import { TOP_UP_PACKAGES } from "@/lib/wallet/top-up-packages";

let stripeClient: Stripe | null = null;

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  if (!stripeClient) stripeClient = new Stripe(key);
  return stripeClient;
}

export function sparkPackagePriceUsd(sparkAmount: number): number | null {
  const prices: Record<number, number> = {
    5: 35,
    15: 99,
    30: 189,
  };
  return prices[sparkAmount] ?? null;
}

export function isStripeEnabled() {
  return Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_WEBHOOK_SECRET);
}

export function validateStripePackage(amount: number) {
  return (TOP_UP_PACKAGES as readonly number[]).includes(amount);
}
