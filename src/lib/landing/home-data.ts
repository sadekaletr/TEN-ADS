import { getFeaturedCaseStudy } from "@/lib/landing/case-study";
import { getFeaturedCampaignsForLanding } from "@/lib/landing/featured-campaigns";
import { getLandingStats } from "@/lib/landing/stats";
import { getLandingSponsorLogos } from "@/lib/landing/sponsors";
import { getMarketingTestimonials } from "@/lib/marketing/testimonials";
import { getPlatformSettings, type PlatformConfig } from "@/lib/platform-settings";

const PLATFORM_FALLBACK: PlatformConfig = {
  transferMethod: "ShamCash",
  transferAccount: "",
  transferInstructions: null,
  sparkUnit: null,
  sparkUsdListPrice: null,
  sparkUsdPartnerPrice: null,
  sparkTreasuryBalance: 0,
  featuredCampaignId: null,
  featuredCreatorId: null,
  heroCampaignId: null,
  maxPrizeQuantity: null,
  testimonialQuote: null,
  testimonialAuthor: null,
  landingVideoUrl: null,
};

export async function getHomePageData() {
  const [stats, featured] = await Promise.all([
    getLandingStats(),
    getFeaturedCampaignsForLanding(),
  ]);

  let caseStudy: Awaited<ReturnType<typeof getFeaturedCaseStudy>> = null;
  let sponsorLogos: Awaited<ReturnType<typeof getLandingSponsorLogos>> = [];
  let platform: PlatformConfig = PLATFORM_FALLBACK;
  let testimonials: Awaited<ReturnType<typeof getMarketingTestimonials>> = [];

  try {
    [caseStudy, sponsorLogos, platform, testimonials] = await Promise.all([
      getFeaturedCaseStudy(),
      getLandingSponsorLogos(),
      getPlatformSettings(),
      getMarketingTestimonials(),
    ]);
  } catch {
    // Postgres offline — page still renders with fallbacks
  }

  return { caseStudy, stats, sponsorLogos, platform, testimonials, featured };
}
