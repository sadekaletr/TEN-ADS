# TENEGTA — Performance Query Audit (Beta)

Run on **staging** after `npm run db:seed:volume`. Target: **p95 < 500ms** for dashboard/sponsor pages with ~100 campaigns / 1000+ redemptions.

## Indexes added

| Model | Index | Used by |
|-------|-------|---------|
| `Campaign` | `[sponsorId, status]` | `getSponsorOverview`, `getSponsorRoi` |
| `Campaign` | `[status, createdAt]` | `getFeaturedCaseStudy`, marketplace discover |
| `Redemption` | `[createdAt]` | Sponsor leads ordering |
| `Redemption` | `[campaignId, createdAt]` | Per-campaign analytics timelines |

## EXPLAIN ANALYZE commands

Connect to staging Postgres and run:

```sql
-- Replace :sponsorId with a seeded sponsor id
EXPLAIN ANALYZE
SELECT c.* FROM "Campaign" c
WHERE c."sponsorId" = :sponsorId AND c."deletedAt" IS NULL
ORDER BY c."createdAt" DESC;

-- Sponsor ROI redemptions
EXPLAIN ANALYZE
SELECT r.* FROM "Redemption" r
JOIN "Campaign" c ON c.id = r."campaignId"
WHERE c."sponsorId" = :sponsorId
ORDER BY r."createdAt" DESC
LIMIT 50;

-- Featured case study (high prizeClaimed, ACTIVE)
EXPLAIN ANALYZE
SELECT * FROM "Campaign"
WHERE status = 'ACTIVE' AND "deletedAt" IS NULL
ORDER BY "prizeClaimed" DESC
LIMIT 1;

-- Campaign analytics events (per campaign)
EXPLAIN ANALYZE
SELECT * FROM "CampaignEvent"
WHERE "campaignId" = :campaignId
ORDER BY "createdAt" DESC
LIMIT 200;

-- Network recommendations (verified sponsors with campaigns)
EXPLAIN ANALYZE
SELECT s.* FROM "Sponsor" s
WHERE s.verified = true AND s."deletedAt" IS NULL
ORDER BY s."trustScore" DESC NULLS LAST
LIMIT 3;
```

## Surfaces to smoke-test

| Page | File | Risk at volume |
|------|------|----------------|
| Dashboard home | `BusinessDashboard` + dashboard actions | N+1 campaigns |
| Sponsor ROI | `getSponsorRoi` | Full scan without `sponsorId` index |
| Case study | `getFeaturedCaseStudy` | Sort on `prizeClaimed` |
| Campaign analytics | `getCampaignAnalytics` | Multiple `findMany` on events/visits |
| Network | `lib/network/recommendations.ts` | Multi-table joins |

## Pass criteria

- Index Scan (not Seq Scan) on `Campaign_sponsorId_status_idx` for sponsor queries
- `Redemption_createdAt_idx` or `campaignId_createdAt` used for leads
- No query > 500ms p95 on volume seed dataset
