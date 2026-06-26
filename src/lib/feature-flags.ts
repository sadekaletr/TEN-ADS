/** Simple env-based feature flags for gradual rollout. */
export const featureFlags = {
  stripeCheckout: process.env.FEATURE_STRIPE_CHECKOUT === "1",
  googleOAuth: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
  embedWidget: process.env.FEATURE_EMBED_WIDGET !== "0",
  publicApi: process.env.FEATURE_PUBLIC_API === "1",
  webhooks: process.env.FEATURE_WEBHOOKS === "1",
  intelligenceCheckout: process.env.FEATURE_INTELLIGENCE_CHECKOUT === "1",
} as const;
