-- AlterTable
ALTER TABLE "Campaign" ADD COLUMN     "heroTemplate" TEXT;

-- AlterTable
ALTER TABLE "Redemption" ADD COLUMN     "participantId" TEXT,
ADD COLUMN     "sessionId" TEXT;

-- CreateTable
CREATE TABLE "Participant" (
    "id" TEXT NOT NULL,
    "phoneHash" TEXT,
    "ipHash" TEXT,
    "sessionIds" TEXT[],
    "tags" TEXT[],
    "firstSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Participant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SparkScoreSnapshot" (
    "id" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "conversionRate" DOUBLE PRECISION NOT NULL,
    "fraudRate" DOUBLE PRECISION NOT NULL,
    "consistency" DOUBLE PRECISION NOT NULL,
    "computedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SparkScoreSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampaignMetricHourly" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "hour" TIMESTAMP(3) NOT NULL,
    "pageViews" INTEGER NOT NULL DEFAULT 0,
    "codeSubmits" INTEGER NOT NULL DEFAULT 0,
    "redemptions" INTEGER NOT NULL DEFAULT 0,
    "failed" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "CampaignMetricHourly_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FraudSignal" (
    "id" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityHash" TEXT NOT NULL,
    "campaignId" TEXT,
    "riskScore" DOUBLE PRECISION NOT NULL,
    "reason" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FraudSignal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Participant_phoneHash_key" ON "Participant"("phoneHash");

-- CreateIndex
CREATE INDEX "Participant_ipHash_idx" ON "Participant"("ipHash");

-- CreateIndex
CREATE INDEX "SparkScoreSnapshot_creatorId_computedAt_idx" ON "SparkScoreSnapshot"("creatorId", "computedAt");

-- CreateIndex
CREATE INDEX "CampaignMetricHourly_campaignId_hour_idx" ON "CampaignMetricHourly"("campaignId", "hour");

-- CreateIndex
CREATE UNIQUE INDEX "CampaignMetricHourly_campaignId_hour_key" ON "CampaignMetricHourly"("campaignId", "hour");

-- CreateIndex
CREATE INDEX "FraudSignal_entityHash_campaignId_idx" ON "FraudSignal"("entityHash", "campaignId");

-- CreateIndex
CREATE INDEX "FraudSignal_createdAt_idx" ON "FraudSignal"("createdAt");

-- CreateIndex
CREATE INDEX "Redemption_participantId_idx" ON "Redemption"("participantId");

-- CreateIndex
CREATE INDEX "Redemption_sessionId_idx" ON "Redemption"("sessionId");

-- AddForeignKey
ALTER TABLE "Redemption" ADD CONSTRAINT "Redemption_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SparkScoreSnapshot" ADD CONSTRAINT "SparkScoreSnapshot_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "Creator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignMetricHourly" ADD CONSTRAINT "CampaignMetricHourly_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;
