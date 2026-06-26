# Landing Experiments — Batch F

## Hypotheses

| Variant | Hypothesis | Primary metric |
|---------|------------|----------------|
| `control` | Baseline proof-oriented hero | `landing_demo_click` / `landing_view` |
| `variant_a` | ROI/store-visit copy increases creator signups | `landing_cta_creator_click` / `landing_view` |
| `variant_b` | Demo-forward copy increases demo engagement | `landing_demo_click` / `landing_view` |

Set `NEXT_PUBLIC_LANDING_EXPERIMENT=control|variant_a|variant_b` and redeploy.

## Success metrics (60d)

- `landing_demo_click` / `landing_view` — **+15%** relative vs 7-day baseline
- `landing_cta_creator_click` / `landing_view` — **+10%** relative

## Ship criteria

- 7-day staging baseline recorded in `LandingEvent`
- No E2E regression (`landing-conversion.spec.ts`)
- `npm run build` green
- Dashboard p95 ≤ 104ms ([BF-perf-post-ui.json](../launch-evidence/BF-perf-post-ui.json))

## Stop criteria

- Demo click rate drops >10% vs baseline for 3 consecutive days
- Creator CTA rate drops >15% vs baseline
- Any analytics API error rate >1% of landing views

## Measurement queries

### 7-day funnel (Prisma / SQL)

```sql
-- Demo click rate
SELECT
  COUNT(*) FILTER (WHERE name = 'landing_demo_click')::float
  / NULLIF(COUNT(*) FILTER (WHERE name = 'landing_view'), 0) AS demo_rate
FROM "LandingEvent"
WHERE "createdAt" >= NOW() - INTERVAL '7 days';

-- Creator CTA rate by experiment
SELECT
  experiment,
  COUNT(*) FILTER (WHERE name = 'landing_cta_creator_click')::float
  / NULLIF(COUNT(*) FILTER (WHERE name = 'landing_view'), 0) AS creator_rate
FROM "LandingEvent"
WHERE "createdAt" >= NOW() - INTERVAL '7 days'
GROUP BY experiment;
```

### Export sample (dev)

```bash
npx tsx scripts/export-landing-events-sample.ts
```

Writes [BF-events-sample.json](../launch-evidence/BF-events-sample.json).

## Event inventory

| Event | Trigger |
|-------|---------|
| `landing_view` | Page mount |
| `landing_scroll_25/50/75/100` | Scroll milestones |
| `landing_cta_creator_click` | Hero, nav, final CTA |
| `landing_cta_sponsor_click` | Hero, nav |
| `landing_demo_click` | Hero demo, demo section |
| `landing_final_cta_click` | Final CTA block |
| `landing_faq_expand` | FAQ open |
| `landing_nav_login_click` | Nav login |

## UI benchmark sprint (Jun 2026)

Hero CTA hierarchy after Black Gold 2.0 polish:

| Variant | Primary CTA | Secondary | Ghost |
|---------|-------------|-----------|-------|
| `control` | Creator signup (`MagneticPrimaryCTA`) | Sponsor login | Demo / product film |
| `variant_a` | Creator signup (ROI copy) | Sponsor login | Demo |
| `variant_b` | Creator signup | Sponsor login | Live demo code (`/c/SPARK-HERO-H1`) |

**Before:** 4 equal-weight buttons (creator, sponsor, discover, demo).  
**After:** 1 hero + 1 secondary + 1 ghost — discover moved to nav/footer.

Compare screenshots in `docs/visual-audit/screenshots/` before/after deploy.

## IA order (post Batch F)

`Nav → Hero → Trust → HowItWorks → Demo → CaseStudy → Benefits → Tier → FAQ → FinalCta`

Relocated: `SparkNetworkStrip`, `LandingLogoStrip`, `LandingSparkJourney`, `LandingTestimonials`.
