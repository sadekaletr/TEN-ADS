-- CreateTable
CREATE TABLE "LandingEvent" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "dir" TEXT NOT NULL,
    "section" TEXT,
    "ctaLabel" TEXT,
    "experiment" TEXT NOT NULL DEFAULT 'control',
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LandingEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LandingEvent_name_createdAt_idx" ON "LandingEvent"("name", "createdAt");

-- CreateIndex
CREATE INDEX "LandingEvent_sessionId_createdAt_idx" ON "LandingEvent"("sessionId", "createdAt");

-- CreateIndex
CREATE INDEX "LandingEvent_experiment_name_idx" ON "LandingEvent"("experiment", "name");
