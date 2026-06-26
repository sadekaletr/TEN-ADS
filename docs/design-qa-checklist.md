# Design QA Checklist — TENEGTA Spark

## Viewports

- [ ] 1440px — Landing, Dashboard, Campaign OS, Sponsor portal
- [ ] 1280px — same
- [ ] 1024px — sidebar Campaign OS, tables horizontal scroll
- [ ] 390px — Wallet, Topup, Redeem, Marketplace
- [ ] 375px — critical paths (iPhone SE)
- [ ] 320px — no clipped CTAs

## Pages

| Page | Desktop | Mobile | RTL (ar) | LTR (en) |
|------|---------|--------|----------|----------|
| Landing | | | | |
| Wallet | | | | |
| Top-up | | | | |
| Dashboard | | | | |
| Campaign OS (all tabs) | | | | |
| Sponsor portal | | | | |
| Marketplace | | | | |
| Redeem `/c/[code]` | | | | |
| Creator profile | | | | |
| Campaign landing | | | | |

## Fix criteria

- No unintended horizontal overflow
- Touch targets ≥ 44px (`min-h-11`)
- `pb-safe` on mobile footers
- Typography: PageHeader / H2 hierarchy consistent
- Icon sizes: 16 / 20 / 24 only
- Tables use `overflow-x-auto`
