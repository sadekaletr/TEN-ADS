import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export type AuditRoute = {
  id: number;
  path: string;
  name: string;
  auth?: "creator" | "sponsor" | "admin" | "agency";
  screenshot: string;
};

export async function getAuditRoutes(): Promise<AuditRoute[]> {
  const creator = await prisma.creator.findFirst({
    where: { phone: "+963900000001" },
    select: { id: true, handle: true },
  });
  const sponsor = await prisma.sponsor.findFirst({
    where: { email: "diwan@tenegta.com" },
    select: { id: true },
  });
  const campaign = await prisma.campaign.findFirst({
    where: { status: "ACTIVE", slug: { not: null } },
    select: { id: true, slug: true },
    orderBy: { createdAt: "asc" },
  });
  const campaignAny = await prisma.campaign.findFirst({
    where: { status: "ACTIVE" },
    select: { id: true, slug: true },
    orderBy: { createdAt: "asc" },
  });
  const campaignId = campaign?.id ?? campaignAny?.id ?? "demo";
  const campaignSlug =
    campaign?.slug ?? campaignAny?.slug ?? "demo-campaign";
  const handle = (creator?.handle ?? "@ahmad_demo").replace(/^@/, "");

  const routes: AuditRoute[] = [
    { id: 1, path: "/", name: "Landing", screenshot: "01-landing.png" },
    {
      id: 49,
      path: "/creators",
      name: "Creators directory",
      screenshot: "49-creators.png",
    },
    { id: 2, path: "/privacy", name: "Privacy", screenshot: "02-privacy.png" },
    { id: 3, path: "/terms", name: "Terms", screenshot: "03-terms.png" },
    { id: 4, path: "/redeem", name: "Redeem entry", screenshot: "04-redeem.png" },
    {
      id: 5,
      path: "/c/SPARK-HERO-H1",
      name: "Redeem flow",
      screenshot: "05-c-code.png",
    },
    {
      id: 6,
      path: `/campaign/${campaignSlug}`,
      name: "Campaign public",
      screenshot: "06-campaign-slug.png",
    },
    {
      id: 7,
      path: `/creator/${handle}`,
      name: "Creator public",
      screenshot: "07-creator-handle.png",
    },
    {
      id: 8,
      path: `/shop/${sponsor?.id ?? "sponsor"}`,
      name: "Sponsor shop",
      screenshot: "08-shop-sponsor.png",
    },
    {
      id: 9,
      path: "/leaderboard/sponsors/damascus",
      name: "Leaderboard",
      screenshot: "09-leaderboard.png",
    },
    {
      id: 10,
      path: "/design-preview",
      name: "Design preview",
      screenshot: "10-design-preview.png",
    },
    { id: 11, path: "/login", name: "Creator login", screenshot: "11-login.png" },
    {
      id: 12,
      path: "/sponsor/login",
      name: "Sponsor login",
      screenshot: "12-sponsor-login.png",
    },
    {
      id: 13,
      path: "/admin/login",
      name: "Admin login",
      screenshot: "13-admin-login.png",
    },
    {
      id: 14,
      path: "/agency/login",
      name: "Agency login",
      screenshot: "14-agency-login.png",
    },
    {
      id: 15,
      path: "/dashboard",
      name: "Dashboard",
      auth: "creator",
      screenshot: "15-dashboard.png",
    },
    {
      id: 16,
      path: "/dashboard/campaigns",
      name: "Campaigns list",
      auth: "creator",
      screenshot: "16-campaigns.png",
    },
    {
      id: 17,
      path: "/dashboard/campaigns/new",
      name: "New campaign",
      auth: "creator",
      screenshot: "17-campaigns-new.png",
    },
    {
      id: 18,
      path: `/dashboard/campaigns/${campaignId}`,
      name: "Campaign detail",
      auth: "creator",
      screenshot: "18-campaign-id.png",
    },
    {
      id: 19,
      path: `/dashboard/campaigns/${campaignId}/analytics`,
      name: "Campaign analytics",
      auth: "creator",
      screenshot: "19-campaign-analytics.png",
    },
    {
      id: 20,
      path: `/dashboard/campaigns/${campaignId}/assets`,
      name: "Campaign assets",
      auth: "creator",
      screenshot: "20-campaign-assets.png",
    },
    {
      id: 21,
      path: `/dashboard/campaigns/${campaignId}/fraud`,
      name: "Campaign fraud",
      auth: "creator",
      screenshot: "21-campaign-fraud.png",
    },
    {
      id: 22,
      path: `/dashboard/campaigns/${campaignId}/live`,
      name: "Campaign live",
      auth: "creator",
      screenshot: "22-campaign-live.png",
    },
    {
      id: 23,
      path: `/dashboard/campaigns/${campaignId}/participants`,
      name: "Campaign participants",
      auth: "creator",
      screenshot: "23-campaign-participants.png",
    },
    {
      id: 24,
      path: `/dashboard/campaigns/${campaignId}/settings`,
      name: "Campaign settings",
      auth: "creator",
      screenshot: "24-campaign-settings.png",
    },
    {
      id: 25,
      path: "/dashboard/command",
      name: "Command center",
      auth: "creator",
      screenshot: "25-command.png",
    },
    {
      id: 26,
      path: "/dashboard/wallet",
      name: "Wallet",
      auth: "creator",
      screenshot: "26-wallet.png",
    },
    {
      id: 27,
      path: "/dashboard/wallet/topup",
      name: "Wallet topup",
      auth: "creator",
      screenshot: "27-wallet-topup.png",
    },
    {
      id: 28,
      path: "/dashboard/notifications",
      name: "Notifications",
      auth: "creator",
      screenshot: "28-notifications.png",
    },
    {
      id: 29,
      path: "/dashboard/requests",
      name: "Requests",
      auth: "creator",
      screenshot: "29-requests.png",
    },
    {
      id: 30,
      path: "/dashboard/listing",
      name: "Listing",
      auth: "creator",
      screenshot: "30-listing.png",
    },
    {
      id: 31,
      path: "/wallet/topup",
      name: "Wallet topup alias",
      auth: "creator",
      screenshot: "31-wallet-topup-alias.png",
    },
    {
      id: 32,
      path: "/sponsor",
      name: "Sponsor overview",
      auth: "sponsor",
      screenshot: "32-sponsor.png",
    },
    {
      id: 33,
      path: "/sponsor/campaigns",
      name: "Sponsor campaigns",
      auth: "sponsor",
      screenshot: "33-sponsor-campaigns.png",
    },
    {
      id: 34,
      path: "/sponsor/leads",
      name: "Sponsor leads",
      auth: "sponsor",
      screenshot: "34-sponsor-leads.png",
    },
    {
      id: 35,
      path: "/sponsor/roi",
      name: "Sponsor ROI",
      auth: "sponsor",
      screenshot: "35-sponsor-roi.png",
    },
    {
      id: 36,
      path: "/sponsor/notifications",
      name: "Sponsor notifications",
      auth: "sponsor",
      screenshot: "36-sponsor-notifications.png",
    },
    {
      id: 37,
      path: "/marketplace",
      name: "Marketplace",
      auth: "sponsor",
      screenshot: "37-marketplace.png",
    },
    {
      id: 38,
      path: "/marketplace/discover",
      name: "Marketplace discover",
      auth: "sponsor",
      screenshot: "38-marketplace-discover.png",
    },
    { id: 39, path: "/partner", name: "Partner redirect", screenshot: "39-partner.png" },
    {
      id: 40,
      path: "/admin",
      name: "Admin overview",
      auth: "admin",
      screenshot: "40-admin.png",
    },
    {
      id: 41,
      path: "/admin/wallet",
      name: "Admin wallet",
      auth: "admin",
      screenshot: "41-admin-wallet.png",
    },
    {
      id: 42,
      path: "/admin/settings",
      name: "Admin settings",
      auth: "admin",
      screenshot: "42-admin-settings.png",
    },
    {
      id: 43,
      path: "/admin/settings/transfer",
      name: "Admin transfer",
      auth: "admin",
      screenshot: "43-admin-transfer.png",
    },
    {
      id: 44,
      path: "/admin/homepage",
      name: "Admin homepage",
      auth: "admin",
      screenshot: "44-admin-homepage.png",
    },
    {
      id: 45,
      path: "/admin/trust",
      name: "Admin trust",
      auth: "admin",
      screenshot: "45-admin-trust.png",
    },
    {
      id: 46,
      path: "/admin/beta",
      name: "Admin beta",
      auth: "admin",
      screenshot: "46-admin-beta.png",
    },
    {
      id: 47,
      path: "/agency/dashboard",
      name: "Agency dashboard",
      auth: "agency",
      screenshot: "47-agency-dashboard.png",
    },
    {
      id: 48,
      path: "/intelligence/heatmap",
      name: "Heatmap",
      auth: "creator",
      screenshot: "48-heatmap.png",
    },
  ];

  return routes;
}

if (require.main === module) {
  getAuditRoutes()
    .then((r) => {
      console.log(JSON.stringify(r, null, 2));
    })
    .finally(() => prisma.$disconnect());
}
