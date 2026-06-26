-- Beta readiness: sponsor dashboard + redemption ordering indexes
CREATE INDEX IF NOT EXISTS "Campaign_sponsorId_status_idx" ON "Campaign"("sponsorId", "status");
CREATE INDEX IF NOT EXISTS "Campaign_status_createdAt_idx" ON "Campaign"("status", "createdAt");
CREATE INDEX IF NOT EXISTS "Redemption_createdAt_idx" ON "Redemption"("createdAt");
CREATE INDEX IF NOT EXISTS "Redemption_campaignId_createdAt_idx" ON "Redemption"("campaignId", "createdAt");
