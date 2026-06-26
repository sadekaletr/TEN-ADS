export type LandingExperiment = "control" | "variant_a" | "variant_b";

export function getLandingExperiment(): LandingExperiment {
  const v = process.env.NEXT_PUBLIC_LANDING_EXPERIMENT;
  if (v === "variant_a" || v === "variant_b") return v;
  return "control";
}
