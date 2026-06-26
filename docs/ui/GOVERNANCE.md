# UI Governance — TENEGTA Spark Masterplan v2.0

Official adoption of the UI Masterplan. All UI work must follow this document.

## Design ownership matrix

| Domain | Owner approves | Consulted | Artifacts |
|--------|----------------|-----------|-----------|
| Color/type/spacing tokens | **Design Lead** | Frontend Lead | PR touching `tokens.ts`, `globals.css`, `tailwind.config.ts` |
| Motion (duration, presets, particles) | **Frontend Lead** | Design Lead | `src/lib/motion/*`, Framer usage in routes |
| Copy AR/EN | **Product** | Design | `src/messages/ar.json`, `en.json` |
| Finance flows (topup/redeem/wallet) | **Product + Ops** | Design, Frontend | wallet/redeem components |
| New UI components | **Design + Frontend** | Product | component file + `/design-preview` entry |
| Route layout / IA changes | **Product** | Design, Frontend | page-level PRs |
| Accessibility | **Frontend** | Design | axe audit, focus/ARIA PRs |
| Performance regression | **Frontend** | Ops | `B5-perf.json` compare |

## Definition of Ready (DoR)

A UI task enters implementation only when ALL are checked:

- [ ] **Copy:** AR string in `ar.json` (EN if bilingual); error/success/empty states written
- [ ] **States:** loading, empty, error, success specified
- [ ] **Data:** props map to existing server data or API ticket linked
- [ ] **RTL/LTR:** mirroring noted for directional icons/layout
- [ ] **Numerals:** finance fields use `n()`/`spark()` — no Arabic-Indic
- [ ] **Motion:** `useMotionSafe` / reduced-motion fallback defined
- [ ] **Preview:** `/design-preview` section name assigned
- [ ] **Perf:** no particles/heavy effects on authenticated routes unless exempted
- [ ] **Tests:** E2E path identified if critical flow touched

## Naming rules

| Prefix | Use | Examples |
|--------|-----|----------|
| `Spark*` | Marketing/emotional/metric delight | `SparkPulseCard`, `SparkAmount` |
| `Status*` | Operational state chips | `StatusBadge` |
| `Data*` | Neutral data display | `DataTable` (future) |
| `Proof*` / `Wallet*` | Fintech trust flows | `ProofConfidencePanel` |
| No prefix | Primitives | `Button`, `GlassCard`, `CopyableField` |

Do not name operational admin components `Spark*`.

## Design-preview gate

**No new component merges without an entry in `/design-preview`.**

PR checklist: `design-preview updated: yes/no (justify if no)`.

## References

- [KPI-BASELINES.md](./KPI-BASELINES.md)
- [LAUNCH_GATE.md](../LAUNCH_GATE.md)
- [B6-ui-gate.md](../launch-evidence/B6-ui-gate.md)
