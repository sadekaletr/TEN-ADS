-- CreateEnum
CREATE TYPE "CreatorPlanTier" AS ENUM ('STARTER', 'GROWTH', 'SCALE');

-- AlterTable
ALTER TABLE "Creator" ADD COLUMN "planTier" "CreatorPlanTier" NOT NULL DEFAULT 'STARTER';
ALTER TABLE "Creator" ADD COLUMN "planGrantedAt" TIMESTAMP(3);
ALTER TABLE "Creator" ADD COLUMN "foundingPartnerNo" INTEGER;

-- AlterTable
ALTER TABLE "Campaign" ADD COLUMN "descriptionVariantA" TEXT;
ALTER TABLE "Campaign" ADD COLUMN "descriptionVariantB" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Creator_foundingPartnerNo_key" ON "Creator"("foundingPartnerNo");
