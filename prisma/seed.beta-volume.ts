/**
 * Volume seed for beta performance testing — NOT for production.
 * Run: npm run db:seed:volume
 */
import bcrypt from "bcryptjs";
import { PrismaClient, CampaignStatus } from "@prisma/client";
import { generateSparkCode } from "../src/lib/codes";

const prisma = new PrismaClient();

const CITIES = ["دمشق", "حلب", "حمص", "اللاذقية", "طرطوس", "حماة"];
const SECTORS = ["مطاعم", "تجزئة", "خدمات", "تعليم", "صحة", "ترفيه"];
const STATUSES: CampaignStatus[] = ["ACTIVE", "ACTIVE", "ACTIVE", "PAUSED", "ENDED", "DRAFT"];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

export async function seedBetaVolume() {
  if (process.env.NODE_ENV === "production" && process.env.BETA_SEED !== "1") {
    throw new Error(
      "Refusing volume seed on production. Set BETA_SEED=1 only on isolated staging."
    );
  }

  console.log("Clearing existing demo data…");
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

  await prisma.exchangeRate.upsert({
    where: { currency: "SYP" },
    create: { currency: "SYP", sparkUnit: 50_000 },
    update: {},
  });

  const password = await bcrypt.hash("beta1234", 10);

  console.log("Creating 50 sponsors…");
  const sponsors = await Promise.all(
    Array.from({ length: 50 }, (_, i) =>
      prisma.sponsor.create({
        data: {
          name: `راعٍ ${i + 1}`,
          email: `sponsor-beta-${i + 1}@tenegta.local`,
          password,
          city: pick(CITIES),
          sector: pick(SECTORS),
          verified: i < 15,
          trustScore: randomInt(40, 95),
        },
      })
    )
  );

  console.log("Creating 100 creators…");
  const creators = await Promise.all(
    Array.from({ length: 100 }, (_, i) =>
      prisma.creator.create({
        data: {
          name: `صانع ${i + 1}`,
          handle: `@creator_beta_${i + 1}`,
          phone: `+9639100${String(i + 1).padStart(5, "0")}`,
          password,
          walletBalance: randomInt(20, 300),
          verified: i < 25,
          trustScore: randomInt(30, 90),
          createdAt: daysAgo(randomInt(1, 90)),
        },
      })
    )
  );

  console.log("Creating 100 campaigns…");
  const campaigns = [];
  for (let i = 0; i < 100; i++) {
    const creator = pick(creators);
    const sponsor = pick(sponsors);
    const status = pick(STATUSES);
    const prizeQuantity = randomInt(20, 200);
    const prizeClaimed =
      status === "DRAFT" ? 0 : randomInt(0, Math.min(prizeQuantity, 80));
    const createdAt = daysAgo(randomInt(1, 60));

    const campaign = await prisma.campaign.create({
      data: {
        creatorId: creator.id,
        sponsorId: sponsor.id,
        title: `حملة ${i + 1} — ${sponsor.name}`,
        description: `حملة تجريبية للأداء #${i + 1}`,
        prizeName: `جائزة ${pick(["قهوة", "وجبة", "خصم", "هدية"])}`,
        prizeQuantity,
        prizeClaimed,
        codeMode: "SHARED",
        costPerRedemption: randomInt(1, 3),
        tier: pick(["BASIC", "PRO", "EMPIRE"] as const),
        status,
        city: pick(CITIES),
        slug: `beta-campaign-${i + 1}`,
        createdAt,
        startsAt: createdAt,
        codes: { create: { code: generateSparkCode() } },
      },
    });
    campaigns.push(campaign);
  }

  const activeCampaigns = campaigns.filter((c) => c.status === "ACTIVE");
  const redemptionTarget = 1050;
  console.log(`Creating ${redemptionTarget} redemptions…`);

  const redemptionBatch: {
    campaignId: string;
    codeUsed: string;
    fullName: string;
    phone: string;
    city: string | null;
    createdAt: Date;
  }[] = [];

  for (let i = 0; i < redemptionTarget; i++) {
    const campaign = pick(activeCampaigns.length > 0 ? activeCampaigns : campaigns);
    const code = await prisma.campaignCode.findFirst({
      where: { campaignId: campaign.id },
    });
    redemptionBatch.push({
      campaignId: campaign.id,
      codeUsed: code?.code ?? "SPARK-BETA-0000",
      fullName: `مشارك ${i + 1}`,
      phone: `+9639${String(1000000 + i).slice(-7)}`,
      city: campaign.city,
      createdAt: daysAgo(randomInt(0, 45)),
    });
  }

  const CHUNK = 100;
  for (let i = 0; i < redemptionBatch.length; i += CHUNK) {
    await prisma.redemption.createMany({ data: redemptionBatch.slice(i, i + CHUNK) });
  }

  // Top-up requests for beta metrics (mix of statuses)
  console.log("Creating top-up requests…");
  for (let i = 0; i < 30; i++) {
    const creator = creators[i];
    const createdAt = daysAgo(randomInt(5, 40));
    const reviewedAt = daysAgo(randomInt(0, 4));
    await prisma.topUpRequest.create({
      data: {
        creatorId: creator.id,
        amount: randomInt(50, 200),
        bankReference: `REF-BETA-${i + 1}`,
        status: i % 3 === 0 ? "PENDING" : i % 3 === 1 ? "APPROVED" : "REJECTED",
        createdAt,
        reviewedAt: i % 3 === 0 ? null : reviewedAt,
      },
    });
  }

  // Second campaigns for retention metric (~15 creators with 2+ campaigns in 30d)
  for (let i = 0; i < 15; i++) {
    const creator = creators[i];
    await prisma.campaign.create({
      data: {
        creatorId: creator.id,
        sponsorId: pick(sponsors).id,
        title: `حملة ثانية — ${creator.name}`,
        prizeName: "جائزة إضافية",
        prizeQuantity: 50,
        prizeClaimed: randomInt(5, 30),
        costPerRedemption: 1,
        status: "ACTIVE",
        city: pick(CITIES),
        slug: `beta-retention-${i + 1}`,
        createdAt: daysAgo(randomInt(1, 25)),
        codes: { create: { code: generateSparkCode() } },
      },
    });
  }

  console.log(
    `Beta volume seed complete: ${sponsors.length} sponsors, ${creators.length} creators, ${campaigns.length + 15} campaigns, ${redemptionTarget} redemptions`
  );
}

if (require.main === module) {
  seedBetaVolume()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(() => prisma.$disconnect());
}
