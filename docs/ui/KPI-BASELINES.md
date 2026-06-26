# UI KPI Baselines — TENEGTA Spark

Measure on staging before Batch D merges. Landing baselines use `LandingEvent` table (Batch F).

| Route | KPI | Baseline (now) | Target (60d) | Measurement |
|-------|-----|----------------|--------------|-------------|
| `/` Landing | Visit → demo click | **Record 7d** — see query below | +15% relative | `landing_demo_click` / `landing_view` |
| `/` Landing | Visit → creator signup | **Record 7d** — see query below | +10% relative | `landing_cta_creator_click` / `landing_view` |
| `/dashboard` | Session → campaign/new | **TBD** | +20% relative | server log or event |
| `/creators` | Card click-through | **Record 7d** | +20% relative | `creator_card_click` / page views |
| `/dashboard/wallet/topup` | Start → submit proof | **TBD** | +10% relative | `wallet.topup_requested` / sessions |
| `/sponsor/roi` | Login → ROI view | **TBD** | +12% return visits | `trackSponsorRoiView` |
| `/admin/wallet` | Pending → approved &lt;4h | **TBD** | 90% within 4h | `reviewedAt - createdAt` |
| `/c/[code]` | Welcome → complete | **TBD** | -15% drop-off | `PAGE_VIEW` metadata `funnelStep` |
| Dashboard perf | p95 latency | **104ms** (post-UI) | stay &lt;500ms; alert &gt;104ms | `npm run perf:p95` |

## Benchmark UI sprint (Jun 2026) — measurement

Post-deploy, collect 7 days on staging before production merge.

### Creators funnel

```sql
-- Requires analytics_events or creators_page_view counts from app logs
-- Client: trackCreatorsEvent('creator_card_click')
```

### Redeem funnel (`CampaignEvent` metadata)

```sql
SELECT
  COUNT(*) FILTER (WHERE metadata->>'funnelStep' = 'redeem_complete')::float
  / NULLIF(COUNT(*) FILTER (WHERE metadata->>'funnelStep' = 'redeem_welcome'), 0) AS completion_rate
FROM "CampaignEvent"
WHERE type = 'PAGE_VIEW'
  AND metadata->>'funnelStep' IS NOT NULL
  AND "createdAt" >= NOW() - INTERVAL '7 days';
```

### QA checklist (sprint close)

- Viewports: 375 / 768 / 1280 ([design-qa-checklist.md](../design-qa-checklist.md))
- a11y: focus rings on cards; `aria-label` on creator card links
- Perf: `npm run perf:p95` after dashboard ATF changes
- Visual: re-run `npm run visual-audit` for `/`, `/creators`, `/dashboard`, `/sponsor/roi`, `/marketplace`, `/c/[code]`

## Landing measurement (7-day protocol)

```sql
SELECT
  COUNT(*) FILTER (WHERE name = 'landing_demo_click')::float
  / NULLIF(COUNT(*) FILTER (WHERE name = 'landing_view'), 0) AS demo_click_rate,
  COUNT(*) FILTER (WHERE name = 'landing_cta_creator_click')::float
  / NULLIF(COUNT(*) FILTER (WHERE name = 'landing_view'), 0) AS creator_cta_rate
FROM "LandingEvent"
WHERE "createdAt" >= NOW() - INTERVAL '7 days';
```

Export sample: `npx tsx scripts/export-landing-events-sample.ts` → [BF-events-sample.json](../launch-evidence/BF-events-sample.json)

## Protocol

1. Deploy UI changes to staging.
2. Collect 7 days of `LandingEvent` rows (or manual counts for beta cohort).
3. Update this file and reference in PR description.
4. Re-run `npm run perf:p95` after dashboard UI changes; fail if p95 &gt; 104ms (+20% vs B5 baseline 87ms).

## Evidence

- Performance (pre-UI): [B5-perf.json](../launch-evidence/B5-perf.json) — p95 **87ms**
- Performance (post-UI): [BF-perf-post-ui.json](../launch-evidence/BF-perf-post-ui.json) — p95 **104ms**, gate pass
- Performance (Benchmark sprint): [BENCHMARK-perf.json](../launch-evidence/BENCHMARK-perf.json) — p95 **63ms**, gate pass (≤104ms)
- Build gate: [BENCHMARK-build-pass.log](../launch-evidence/BENCHMARK-build-pass.log) — PASS
- Landing experiments: [LANDING-EXPERIMENTS.md](./LANDING-EXPERIMENTS.md)
- Visual sign-off: [B6-visual-signoff.md](../launch-evidence/B6-visual-signoff.md)
