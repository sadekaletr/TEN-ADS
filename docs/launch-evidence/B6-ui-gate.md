# UI Launch Gate — TENEGTA Spark

Checklist before declaring UI changes production-ready. Complements [B6-visual-signoff.md](./B6-visual-signoff.md).

## Visual consistency

- [ ] New components appear in `/design-preview`
- [ ] No hardcoded gold hex outside `tokens.ts` / `globals.css` in changed files
- [ ] Latin digits in all finance/analytics (`n()`, `spark()`)

## Responsive (320 → 1440+)

- [ ] Top-up sticky bar does not overlap form on mobile
- [ ] Redeem welcome CTA thumb-reachable
- [ ] Dashboard KPI grid stacks on narrow viewports

## Motion

- [ ] `useMotionSafe` / `prefers-reduced-motion` on new animated components
- [ ] No particles on `/dashboard`, `/admin`, `/sponsor`

## Accessibility

- [ ] Top-up stepper has `aria-current="step"`
- [ ] Focus ring visible on tab navigation in design-preview
- [ ] Status badges have text labels (not color-only)

## Performance

- [ ] `npm run perf:p95` — p95 ≤ 104ms (+20% vs 87ms baseline) after dashboard changes
- [ ] `npm run build` exit 0
- [ ] E2E critical paths pass (`B2-results.json`)

## Evidence

- Design governance: [GOVERNANCE.md](../ui/GOVERNANCE.md)
- KPI baselines: [KPI-BASELINES.md](../ui/KPI-BASELINES.md)
