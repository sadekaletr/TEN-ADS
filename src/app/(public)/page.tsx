import type { Metadata } from "next";

import { PublicShell } from "@/components/layout/PublicShell";
import { LandingHeroImmersive } from "@/components/landing/LandingHeroImmersive";
import { LandingActivityMarquee } from "@/components/landing/LandingActivityMarquee";
import { LandingFeaturedOffersStrip } from "@/components/landing/LandingFeaturedOffersStrip";
import { LandingLogoStrip } from "@/components/landing/LandingLogoStrip";
import { LandingBentoGrid } from "@/components/landing/LandingBentoGrid";
import { LandingPlatformPreview } from "@/components/landing/LandingPlatformPreview";
import { LandingUnifiedJourney } from "@/components/landing/LandingUnifiedJourney";
import { LandingAudienceTabs } from "@/components/landing/LandingAudienceTabs";
import { LandingLiveCaseStudy } from "@/components/landing/LandingLiveCaseStudy";
import { LandingProductFilm } from "@/components/landing/LandingProductFilm";
import { LandingTrustStats } from "@/components/landing/LandingTrustStats";
import { LandingTestimonials } from "@/components/landing/LandingTestimonials";
import { LandingTierShowcase } from "@/components/landing/LandingTierShowcase";
import { LandingFaq } from "@/components/landing/LandingFaq";
import { LandingFinalCta } from "@/components/landing/LandingFinalCta";
import { SparkNetworkStrip } from "@/components/network/SparkNetworkStrip";
import { getHomePageData } from "@/lib/landing/home-data";

export const metadata: Metadata = {
  title: "TENEGTA Spark — حوّل متابعينك إلى عملاء حقيقيين",
  description:
    "منصة حملات الكوبون لصناع المحتوى والرعاة. أنشئ حملة، شارك الكود، وشاهد الاستردادات في دقائق.",
  openGraph: {
    title: "TENEGTA Spark",
    description: "Incentivized coupon campaigns for creators and sponsors",
    type: "website",
  },
};

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { caseStudy, stats, sponsorLogos, platform, testimonials, featured } =
    await getHomePageData();

  return (
    <PublicShell>
      <LandingHeroImmersive stats={stats} />
      <LandingLogoStrip sponsors={sponsorLogos} />
      <LandingActivityMarquee />
      <LandingFeaturedOffersStrip campaigns={featured.campaigns} fromDb={featured.fromDb} />
      <LandingBentoGrid />
      <LandingPlatformPreview stats={stats} />
      <LandingUnifiedJourney />
      <LandingAudienceTabs />
      {caseStudy && (
        <LandingLiveCaseStudy
          study={caseStudy}
          testimonialQuote={platform.testimonialQuote}
          testimonialAuthor={platform.testimonialAuthor}
        />
      )}
      <LandingProductFilm videoUrl={platform.landingVideoUrl} />
      <LandingTrustStats
        activeCampaigns={stats.activeCampaigns}
        sparkVolume={stats.sparkVolume}
        weeklyRedemptions={stats.weeklyRedemptions}
        updatedAt={stats.updatedAt}
      />
      <SparkNetworkStrip />
      <LandingTestimonials testimonials={testimonials} />
      <LandingTierShowcase />
      <LandingFaq />
      <LandingFinalCta />
    </PublicShell>
  );
}
