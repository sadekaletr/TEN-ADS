import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { saveCampaignQrFiles } from "../src/lib/qr";

const prisma = new PrismaClient();

const DEMO_CODE = "SPARK-DEMO-CODE";
const HERO_H1 = "SPARK-HERO-H1";
const HERO_H2 = "SPARK-HERO-H2";
const HERO_H3 = "SPARK-HERO-H3";

async function seedHeroCampaign(
  creatorId: string,
  sponsorId: string,
  data: {
    heroTemplate: string;
    title: string;
    description: string;
    prizeName: string;
    prizeQuantity: number;
    prizeClaimed: number;
    codeMode: "SHARED" | "UNIQUE";
    costPerRedemption: number;
    tier?: "BASIC" | "PRO" | "EMPIRE";
    code: string;
    city?: string;
    requireAddress?: boolean;
    antiAbuse?: boolean;
    endsAt?: Date;
  }
) {
  const campaign = await prisma.campaign.create({
    data: {
      creatorId,
      sponsorId,
      title: data.title,
      description: data.description,
      prizeName: data.prizeName,
      prizeQuantity: data.prizeQuantity,
      prizeClaimed: data.prizeClaimed,
      codeMode: data.codeMode,
      costPerRedemption: data.costPerRedemption,
      tier:
        data.tier ??
        (data.costPerRedemption >= 3
          ? "EMPIRE"
          : data.costPerRedemption >= 2
            ? "PRO"
            : "BASIC"),
      status: "ACTIVE",
      city: data.city,
      requirePhone: true,
      requireAddress: data.requireAddress ?? false,
      antiAbuse: data.antiAbuse ?? true,
      heroTemplate: data.heroTemplate,
      startsAt: new Date(),
      endsAt: data.endsAt,
      codes: { create: { code: data.code } },
    },
  });

  const qrUrl = await saveCampaignQrFiles(campaign.id, data.code);
  await prisma.campaignCode.updateMany({
    where: { campaignId: campaign.id },
    data: { qrUrl },
  });

  return campaign;
}

async function main() {
  if (process.env.SEED_MODE === "minimal") {
    const { seedMinimal } = await import("./seed.minimal");
    await seedMinimal();
    return;
  }
  await prisma.fraudSignal.deleteMany();
  await prisma.campaignMetricHourly.deleteMany();
  await prisma.trustScoreSnapshot.deleteMany();
  await prisma.participantRating.deleteMany();
  await prisma.collabRequest.deleteMany();
  await prisma.creatorListing.deleteMany();
  await prisma.campaignCollaborator.deleteMany();
  await prisma.agencyMember.deleteMany();
  await prisma.agency.deleteMany();
  await prisma.intelligenceSubscription.deleteMany();
  await prisma.physicalCard.deleteMany();
  await prisma.sparkScoreSnapshot.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.campaignEvent.deleteMany();
  await prisma.campaignVisit.deleteMany();
  await prisma.redemption.deleteMany();
  await prisma.participant.deleteMany();
  await prisma.campaignCode.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.walletTransaction.deleteMany();
  await prisma.topUpRequest.deleteMany();
  await prisma.creator.deleteMany();
  await prisma.sponsor.deleteMany();
  await prisma.admin.deleteMany();
  await prisma.exchangeRate.deleteMany();

  await prisma.exchangeRate.create({
    data: { currency: "SYP", sparkUnit: 50000 },
  });

  const creatorPassword = await bcrypt.hash("demo1234", 10);
  const premiumPassword = await bcrypt.hash("premium1234", 10);
  const adminPassword = await bcrypt.hash("admin1234", 10);

  const creator = await prisma.creator.create({
    data: {
      name: "أحمد تجريبي",
      handle: "@ahmad_demo",
      email: "creator@tenegta.com",
      phone: "+963900000001",
      password: creatorPassword,
      walletBalance: 0,
    },
  });

  const premiumCreator = await prisma.creator.create({
    data: {
      name: "ليلى بريميوم",
      handle: "@layla_premium",
      email: "layla@tenegta.com",
      phone: "+963900000002",
      password: premiumPassword,
      walletBalance: 0,
      verified: true,
      avatarUrl: "/brand/tenegta-icon.png",
      isPartner: true,
      partnerDiscountCode: "SPARK-LAYLA_PREMIUM",
    },
  });

  const rawanPassword = await bcrypt.hash("rawan1234", 10);
  const rawanCreator = await prisma.creator.create({
    data: {
      name: "روان الشمعة",
      handle: "@rawan_shamaa",
      email: "rawan@tenegta.com",
      phone: "+963900000003",
      password: rawanPassword,
      walletBalance: 0,
      verified: true,
      avatarUrl: "/creators/spotlight/rawan-shamaa-cover.png",
      isPartner: true,
      partnerDiscountCode: "SPARK-RAWAN_SHAMAA",
    },
  });

  await prisma.admin.create({
    data: {
      email: "admin@tenegta.com",
      password: adminPassword,
      name: "TENEGTA Admin",
    },
  });

  const sponsorPassword = await bcrypt.hash("sponsor1234", 10);
  const agencyPassword = await bcrypt.hash("agency1234", 10);

  const sponsorDamascus = await prisma.sponsor.create({
    data: {
      name: "مطعم الديوان",
      city: "دمشق",
      address: "شارع النصر، دمشق",
      phone: "+963911000000",
      email: "diwan@tenegta.com",
      password: sponsorPassword,
      sector: "food",
      currentStreak: 4,
    },
  });

  const sponsorAleppo = await prisma.sponsor.create({
    data: {
      name: "كافيه الأصالة",
      city: "حلب",
      address: "شارع الجامعة، حلب",
      phone: "+963922000000",
      email: "asala@tenegta.com",
      password: sponsorPassword,
      sector: "food",
      currentStreak: 2,
    },
  });

  const sponsorLuxury = await prisma.sponsor.create({
    data: {
      name: "بوتيك ليلى",
      city: "دمشق",
      address: "أبو رمانة، دمشق",
      phone: "+963933000000",
      email: "boutique@tenegta.com",
      password: sponsorPassword,
      sector: "fashion",
    },
  });

  const demoCampaign = await prisma.campaign.create({
    data: {
      creatorId: creator.id,
      sponsorId: sponsorDamascus.id,
      title: "قسائم مطعم الديوان — حملة الافتتاح",
      description: "حملة افتتاحية لتوزيع قسائم غداء مجانية على المتابعين",
      prizeName: "قسيمة غداء مجانية",
      prizeQuantity: 5,
      prizeClaimed: 2,
      codeMode: "SHARED",
      tier: "BASIC",
      costPerRedemption: 2,
      status: "ACTIVE",
      requirePhone: true,
      requireAddress: false,
      antiAbuse: true,
      slug: "demo-campaign",
      codes: { create: { code: DEMO_CODE } },
    },
  });

  const demoQr = await saveCampaignQrFiles(demoCampaign.id, DEMO_CODE);
  await prisma.campaignCode.updateMany({
    where: { campaignId: demoCampaign.id },
    data: { qrUrl: demoQr },
  });

  const h1 = await seedHeroCampaign(creator.id, sponsorDamascus.id, {
    heroTemplate: "H1",
    title: "انفجار سبارك — جوائز فورية",
    description: "حملة Viral Burst لاختبار Live feed وStory timeline",
    prizeName: "قسيمة خصم 50%",
    prizeQuantity: 50,
    prizeClaimed: 8,
    codeMode: "SHARED",
    costPerRedemption: 1,
    code: HERO_H1,
    endsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  const h2 = await seedHeroCampaign(creator.id, sponsorAleppo.id, {
    heroTemplate: "H2",
    title: "حملة دمشق المحلية",
    description: "حملة Steady Local — مدينة واحدة وanti-abuse قوي",
    prizeName: "وجبة مجانية",
    prizeQuantity: 20,
    prizeClaimed: 5,
    codeMode: "SHARED",
    costPerRedemption: 2,
    code: HERO_H2,
    city: "دمشق",
    requireAddress: true,
    antiAbuse: true,
    endsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
  });

  const h3 = await seedHeroCampaign(premiumCreator.id, sponsorLuxury.id, {
    heroTemplate: "H3",
    title: "تجربة بريميوم — حصرية للمتابعين",
    description: "حملة Premium Creator — جائزة محدودة وتجربة QR cinematic",
    prizeName: "باقة VIP حصرية",
    prizeQuantity: 10,
    prizeClaimed: 3,
    codeMode: "SHARED",
    costPerRedemption: 5,
    code: HERO_H3,
    endsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  await prisma.redemption.createMany({
    data: [
      {
        campaignId: demoCampaign.id,
        codeUsed: DEMO_CODE,
        fullName: "سارة محمد",
        phone: "+963933111111",
        city: "دمشق",
      },
      {
        campaignId: demoCampaign.id,
        codeUsed: DEMO_CODE,
        fullName: "خالد العلي",
        phone: "+963944222222",
        city: "دمشق",
      },
      {
        campaignId: h1.id,
        codeUsed: HERO_H1,
        fullName: "نور حسن",
        phone: "+963955111111",
        city: "دمشق",
      },
      {
        campaignId: h2.id,
        codeUsed: HERO_H2,
        fullName: "عمر يوسف",
        phone: "+963966222222",
        city: "دمشق",
        address: "المزة",
      },
      {
        campaignId: h3.id,
        codeUsed: HERO_H3,
        fullName: "ريم أحمد",
        phone: "+963977333333",
        city: "دمشق",
      },
    ],
  });

  const now = Date.now();
  const sessions = ["sess_a", "sess_b", "sess_c", "sess_d", "sess_e"];

  for (let i = 0; i < 30; i++) {
    const campaignId = i % 3 === 0 ? h1.id : i % 3 === 1 ? h2.id : h3.id;
    const sessionId = sessions[i % sessions.length];
    const createdAt = new Date(now - (30 - i) * 3 * 60 * 60 * 1000);

    await prisma.campaignVisit.create({
      data: {
        campaignId,
        sessionId,
        device: i % 2 === 0 ? "mobile" : "desktop",
        referrer: i % 4 === 0 ? "https://instagram.com" : "direct",
        createdAt,
      },
    });

    await prisma.campaignEvent.create({
      data: {
        campaignId,
        sessionId,
        type: "PAGE_VIEW",
        createdAt,
      },
    });

    if (i % 2 === 0) {
      await prisma.campaignEvent.create({
        data: {
          campaignId,
          sessionId,
          type: "CODE_SUBMIT",
          createdAt: new Date(createdAt.getTime() + 60000),
        },
      });
    }
  }

  await prisma.creatorListing.createMany({
    data: [
      {
        creatorId: creator.id,
        bio: "صانع محتوى طعام ومراجعات مطاعم",
        categories: ["food"],
        estimatedReach: 120,
        isPublic: true,
      },
      {
        creatorId: premiumCreator.id,
        bio: "أزياء ولايف ستايل — موثّقة",
        categories: ["fashion"],
        estimatedReach: 340,
        isPublic: true,
        spotlightRank: 2,
      },
      {
        creatorId: rawanCreator.id,
        bio: "صانعة محتوى أزياء ولايف ستايل — حملات حية مع رعات موثّقين",
        categories: ["fashion", "lifestyle"],
        estimatedReach: 520,
        isPublic: true,
        coverImageUrl: "/creators/spotlight/rawan-shamaa-cover.png",
        showcaseTagline: "روان الشمعة",
        spotlightRank: 1,
      },
    ],
  });

  await prisma.platformSettings.upsert({
    where: { id: "default" },
    create: {
      id: "default",
      featuredCreatorId: rawanCreator.id,
      transferMethod: "ShamCash",
      transferAccount: "09xxxxxxxx",
      sparkUsdListPrice: 7,
      sparkUsdPartnerPrice: 3,
      sparkTreasuryBalance: 5000,
    },
    update: {
      featuredCreatorId: rawanCreator.id,
      sparkUsdListPrice: 7,
      sparkUsdPartnerPrice: 3,
      sparkTreasuryBalance: 5000,
    },
  });

  await prisma.agency.create({
    data: {
      name: "وكالة نور للتسويق",
      email: "agency@tenegta.com",
      password: agencyPassword,
      walletBalance: 500,
      members: {
        create: { creatorId: creator.id, spendingLimit: 100 },
      },
    },
  });

  await prisma.intelligenceSubscription.create({
    data: {
      creatorId: premiumCreator.id,
      tier: "agency",
      activeUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    },
  });

  const { computeSparkScore } = await import("../src/lib/intelligence/spark-score");
  for (const c of [creator, premiumCreator, rawanCreator]) {
    await computeSparkScore(c.id);
  }

  await prisma.auditLog.createMany({
    data: [
      {
        actorId: creator.id,
        actorType: "creator",
        action: "campaign.created",
        entityType: "Campaign",
        entityId: h1.id,
        metadata: { title: h1.title, hero: "H1" },
      },
      {
        actorType: "system",
        action: "redemption.completed",
        entityType: "Redemption",
        metadata: { campaignId: h1.id, fullName: "نور حسن" },
      },
    ],
  });

  console.log("Seed complete:");
  console.log(`  Creator: ${creator.handle} / demo1234`);
  console.log(`  Premium: ${premiumCreator.handle} / premium1234`);
  console.log(`  Rawan: ${rawanCreator.handle} / rawan1234`);
  console.log(`  Admin: admin@tenegta.com / admin1234`);
  console.log(`  Sponsor: diwan@tenegta.com / sponsor1234`);
  console.log(`  Agency: agency@tenegta.com / agency1234`);
  console.log(`  Creator public: /creator/layla_premium`);
  console.log(`  Creators showcase: /creators`);
  console.log(`  Rawan spotlight: /creator/rawan_shamaa`);
  console.log(`  Demo code: ${DEMO_CODE}`);
  console.log(`  Hero H1 (Viral): ${HERO_H1}`);
  console.log(`  Hero H2 (Local): ${HERO_H2}`);
  console.log(`  Hero H3 (Premium): ${HERO_H3}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
