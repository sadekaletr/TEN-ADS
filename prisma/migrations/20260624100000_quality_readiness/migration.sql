-- Experience System + Quality Readiness baseline migration

-- CreateEnum
CREATE TYPE "CampaignTier" AS ENUM ('BASIC', 'PRO', 'EMPIRE');

-- CreateEnum
CREATE TYPE "CardStatus" AS ENUM ('PENDING', 'ISSUED', 'ACTIVE', 'LOST');

-- CreateEnum
CREATE TYPE "CollabStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED');

-- CreateEnum
CREATE TYPE "NotificationUserType" AS ENUM ('CREATOR', 'SPONSOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "TrustEntityType" AS ENUM ('CREATOR', 'SPONSOR');

-- AlterTable Campaign
ALTER TABLE "Campaign" ADD COLUMN IF NOT EXISTS "tier" "CampaignTier" NOT NULL DEFAULT 'BASIC';
ALTER TABLE "Campaign" ADD COLUMN IF NOT EXISTS "tierBoostUntil" TIMESTAMP(3);
ALTER TABLE "Campaign" ADD COLUMN IF NOT EXISTS "slug" TEXT;
ALTER TABLE "Campaign" ADD COLUMN IF NOT EXISTS "promoVideoUrl" TEXT;
ALTER TABLE "Campaign" ADD COLUMN IF NOT EXISTS "prizeImageUrl" TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS "Campaign_slug_key" ON "Campaign"("slug");

-- AlterTable Creator
ALTER TABLE "Creator" ADD COLUMN IF NOT EXISTS "trustScore" INTEGER;
ALTER TABLE "Creator" ADD COLUMN IF NOT EXISTS "trustScoreAt" TIMESTAMP(3);
ALTER TABLE "Creator" ADD COLUMN IF NOT EXISTS "marketplaceBoostUntil" TIMESTAMP(3);

-- AlterTable Sponsor
ALTER TABLE "Sponsor" ADD COLUMN IF NOT EXISTS "email" TEXT;
ALTER TABLE "Sponsor" ADD COLUMN IF NOT EXISTS "password" TEXT;
ALTER TABLE "Sponsor" ADD COLUMN IF NOT EXISTS "sector" TEXT;
ALTER TABLE "Sponsor" ADD COLUMN IF NOT EXISTS "verified" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Sponsor" ADD COLUMN IF NOT EXISTS "trustScore" INTEGER;
ALTER TABLE "Sponsor" ADD COLUMN IF NOT EXISTS "trustScoreAt" TIMESTAMP(3);
ALTER TABLE "Sponsor" ADD COLUMN IF NOT EXISTS "currentStreak" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Sponsor" ADD COLUMN IF NOT EXISTS "longestStreak" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Sponsor" ADD COLUMN IF NOT EXISTS "lastActiveWeek" TIMESTAMP(3);
CREATE UNIQUE INDEX IF NOT EXISTS "Sponsor_email_key" ON "Sponsor"("email");

-- AlterTable Redemption
ALTER TABLE "Redemption" ADD COLUMN IF NOT EXISTS "verificationPhotoUrl" TEXT;
ALTER TABLE "Redemption" ADD COLUMN IF NOT EXISTS "collaboratorId" TEXT;

-- AlterTable TopUpRequest
ALTER TABLE "TopUpRequest" ADD COLUMN IF NOT EXISTS "proofImageUrl" TEXT;
ALTER TABLE "TopUpRequest" ADD COLUMN IF NOT EXISTS "transferMethod" TEXT DEFAULT 'ShamCash';
ALTER TABLE "TopUpRequest" ADD COLUMN IF NOT EXISTS "rejectionReason" TEXT;
ALTER TABLE "TopUpRequest" ADD COLUMN IF NOT EXISTS "walletTransactionId" TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS "TopUpRequest_walletTransactionId_key" ON "TopUpRequest"("walletTransactionId");

DO $$ BEGIN
  ALTER TABLE "TopUpRequest" ADD CONSTRAINT "TopUpRequest_walletTransactionId_fkey" FOREIGN KEY ("walletTransactionId") REFERENCES "WalletTransaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- CreateTable Agency
CREATE TABLE IF NOT EXISTS "Agency" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "walletBalance" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Agency_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "Agency_email_key" ON "Agency"("email");

-- CreateTable AgencyMember
CREATE TABLE IF NOT EXISTS "AgencyMember" (
    "id" TEXT NOT NULL,
    "agencyId" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "spendingLimit" INTEGER,
    "spentThisMonth" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "AgencyMember_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "AgencyMember_creatorId_key" ON "AgencyMember"("creatorId");
CREATE INDEX IF NOT EXISTS "AgencyMember_agencyId_idx" ON "AgencyMember"("agencyId");

DO $$ BEGIN
  ALTER TABLE "AgencyMember" ADD CONSTRAINT "AgencyMember_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "Agency"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  ALTER TABLE "AgencyMember" ADD CONSTRAINT "AgencyMember_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "Creator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- CreateTable CampaignCollaborator
CREATE TABLE IF NOT EXISTS "CampaignCollaborator" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "sharePercentage" DOUBLE PRECISION NOT NULL,
    "trackingCode" TEXT NOT NULL,
    "redemptionsCount" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "CampaignCollaborator_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "CampaignCollaborator_campaignId_creatorId_key" ON "CampaignCollaborator"("campaignId", "creatorId");
CREATE UNIQUE INDEX IF NOT EXISTS "CampaignCollaborator_trackingCode_key" ON "CampaignCollaborator"("trackingCode");
CREATE INDEX IF NOT EXISTS "CampaignCollaborator_campaignId_idx" ON "CampaignCollaborator"("campaignId");
CREATE INDEX IF NOT EXISTS "CampaignCollaborator_creatorId_idx" ON "CampaignCollaborator"("creatorId");

DO $$ BEGIN
  ALTER TABLE "CampaignCollaborator" ADD CONSTRAINT "CampaignCollaborator_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  ALTER TABLE "CampaignCollaborator" ADD CONSTRAINT "CampaignCollaborator_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "Creator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- CreateTable CollabRequest
CREATE TABLE IF NOT EXISTS "CollabRequest" (
    "id" TEXT NOT NULL,
    "sponsorId" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" "CollabStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "CollabRequest_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "CollabRequest_creatorId_status_idx" ON "CollabRequest"("creatorId", "status");
CREATE INDEX IF NOT EXISTS "CollabRequest_sponsorId_idx" ON "CollabRequest"("sponsorId");

DO $$ BEGIN
  ALTER TABLE "CollabRequest" ADD CONSTRAINT "CollabRequest_sponsorId_fkey" FOREIGN KEY ("sponsorId") REFERENCES "Sponsor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  ALTER TABLE "CollabRequest" ADD CONSTRAINT "CollabRequest_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "Creator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- CreateTable CreatorListing
CREATE TABLE IF NOT EXISTS "CreatorListing" (
    "id" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "bio" TEXT,
    "categories" TEXT[],
    "estimatedReach" INTEGER,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CreatorListing_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "CreatorListing_creatorId_key" ON "CreatorListing"("creatorId");

DO $$ BEGIN
  ALTER TABLE "CreatorListing" ADD CONSTRAINT "CreatorListing_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "Creator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- CreateTable IntelligenceSubscription
CREATE TABLE IF NOT EXISTS "IntelligenceSubscription" (
    "id" TEXT NOT NULL,
    "creatorId" TEXT,
    "sponsorId" TEXT,
    "tier" TEXT NOT NULL,
    "activeUntil" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "IntelligenceSubscription_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "IntelligenceSubscription_creatorId_key" ON "IntelligenceSubscription"("creatorId");
CREATE UNIQUE INDEX IF NOT EXISTS "IntelligenceSubscription_sponsorId_key" ON "IntelligenceSubscription"("sponsorId");

DO $$ BEGIN
  ALTER TABLE "IntelligenceSubscription" ADD CONSTRAINT "IntelligenceSubscription_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "Creator"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  ALTER TABLE "IntelligenceSubscription" ADD CONSTRAINT "IntelligenceSubscription_sponsorId_fkey" FOREIGN KEY ("sponsorId") REFERENCES "Sponsor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- CreateTable Notification
CREATE TABLE IF NOT EXISTS "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userType" "NotificationUserType" NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "href" TEXT,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "Notification_userId_userType_idx" ON "Notification"("userId", "userType");
CREATE INDEX IF NOT EXISTS "Notification_userId_userType_readAt_idx" ON "Notification"("userId", "userType", "readAt");

-- CreateTable ParticipantRating
CREATE TABLE IF NOT EXISTS "ParticipantRating" (
    "id" TEXT NOT NULL,
    "redemptionId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ParticipantRating_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "ParticipantRating_redemptionId_key" ON "ParticipantRating"("redemptionId");

DO $$ BEGIN
  ALTER TABLE "ParticipantRating" ADD CONSTRAINT "ParticipantRating_redemptionId_fkey" FOREIGN KEY ("redemptionId") REFERENCES "Redemption"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- CreateTable PhysicalCard
CREATE TABLE IF NOT EXISTS "PhysicalCard" (
    "id" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "cardNumber" TEXT NOT NULL,
    "nfcUid" TEXT,
    "issuedAt" TIMESTAMP(3),
    "status" "CardStatus" NOT NULL DEFAULT 'PENDING',
    CONSTRAINT "PhysicalCard_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "PhysicalCard_creatorId_key" ON "PhysicalCard"("creatorId");
CREATE UNIQUE INDEX IF NOT EXISTS "PhysicalCard_cardNumber_key" ON "PhysicalCard"("cardNumber");

DO $$ BEGIN
  ALTER TABLE "PhysicalCard" ADD CONSTRAINT "PhysicalCard_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "Creator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- CreateTable PlatformSettings
CREATE TABLE IF NOT EXISTS "PlatformSettings" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "transferMethod" TEXT NOT NULL DEFAULT 'ShamCash',
    "transferAccount" TEXT NOT NULL DEFAULT '',
    "transferInstructions" TEXT,
    "sparkUnit" INTEGER,
    "featuredCampaignId" TEXT,
    "featuredCreatorId" TEXT,
    "heroCampaignId" TEXT,
    "maxPrizeQuantity" INTEGER,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "PlatformSettings_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "PlatformSettings" ADD COLUMN IF NOT EXISTS "sparkUnit" INTEGER;
ALTER TABLE "PlatformSettings" ADD COLUMN IF NOT EXISTS "featuredCampaignId" TEXT;
ALTER TABLE "PlatformSettings" ADD COLUMN IF NOT EXISTS "featuredCreatorId" TEXT;
ALTER TABLE "PlatformSettings" ADD COLUMN IF NOT EXISTS "heroCampaignId" TEXT;
ALTER TABLE "PlatformSettings" ADD COLUMN IF NOT EXISTS "maxPrizeQuantity" INTEGER;

-- CreateTable TrustScoreSnapshot
CREATE TABLE IF NOT EXISTS "TrustScoreSnapshot" (
    "id" TEXT NOT NULL,
    "entityType" "TrustEntityType" NOT NULL,
    "entityId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "completionRate" DOUBLE PRECISION NOT NULL,
    "deliverySpeed" DOUBLE PRECISION NOT NULL,
    "ratingAverage" DOUBLE PRECISION,
    "fraudRate" DOUBLE PRECISION NOT NULL,
    "campaignsCount" INTEGER NOT NULL,
    "calculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TrustScoreSnapshot_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "TrustScoreSnapshot_entityType_entityId_idx" ON "TrustScoreSnapshot"("entityType", "entityId");
CREATE INDEX IF NOT EXISTS "TrustScoreSnapshot_calculatedAt_idx" ON "TrustScoreSnapshot"("calculatedAt");
