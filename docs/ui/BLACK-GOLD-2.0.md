# TENEGTA Black Gold 2.0 — Art Direction

Visual upgrade layer on UI Masterplan v2. Token-driven; no stack changes.

## Contrast model

| Layer | Token | Hex / value |
|-------|-------|-------------|
| L0 void | `--void` | `#030304` |
| L1 surface | `--surface` | `#0f0e0a` |
| L2 surface-2 | `--surface-2` | `#16140f` |
| L3 glass | `--glass-bg` | gradient + 22% border |
| L4 featured | `--glass-bg-featured` | gradient + 45% border |

## Text tiers

- **primary** `--text-primary` `#f5f0e8`
- **secondary** `--text-secondary` `#b8aea0`
- **tertiary** `--text-tertiary` `#7a7268`

## Lighting rules

**Allowed:** hero spotlight, CTA glow (48px cap), featured card rim, one KPI pulse on mount.

**Forbidden:** particles on auth/dashboard, glow on every card, animated table gradients.

## Signature components (12)

| Component | Route |
|-----------|-------|
| `HeroSpotlightPanel` | Landing hero |
| `MagneticPrimaryCTA` | Landing, dashboard |
| `DataDepthCard` | Trust, dashboard, ROI, reveal |
| `TrustProofUploader` | Top-up proof |
| `SmartFileDropzone` | Redeem + wallet |
| `ConversionRail` | Redeem welcome |
| `CommandKPICluster` | Dashboard ATF |
| `EnergyRingV2` | Sponsor ROI |
| `WalletConfidenceStrip` | Top-up |
| `LiveSignalTicker` | Dashboard |
| `StatusPillPro` | Admin wallet |
| `SectionCinematicDivider` | Redeem reveal, landing sections |

Preview: `/design-preview` → tab **BlackGold**.

## Quality gates

- `npm run test` + `npm run build`
- `npm run perf:p95` ≤ 104ms
- E2E: `landing-conversion` + `critical-paths`
- Every new component in BlackGold preview tab

## Evidence

- Perf baseline: [BF-perf-post-ui.json](../launch-evidence/BF-perf-post-ui.json)
