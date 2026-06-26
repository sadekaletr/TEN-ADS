## Summary

<!-- What changed and why -->

## Checklist

- [ ] Uses shared `Button` / `GlassCard` primitives (no raw card shells)
- [ ] List views include `EmptyState` when data can be empty
- [ ] Interactive controls have visible `focus-visible` styles
- [ ] Numbers/dates use `@/lib/format` helpers (Latin digits)
- [ ] No DB writes on GET/render paths
- [ ] `npm run lint`, `npx tsc --noEmit`, `npm run test`, `npm run build` pass locally

## Test plan

- [ ] Critical route smoke tested
- [ ] Screenshots/visual audit if UI-facing
