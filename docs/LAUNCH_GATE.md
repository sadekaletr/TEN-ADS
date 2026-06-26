# Launch Gate — TENEGTA Spark

**Status: OPEN** — Global Launch **NOT APPROVED**. Ops screenshots (Sentry/S3/Resend) and signed B6 still required.

| Blocker | Layer | Status | Evidence |
|---------|-------|--------|----------|
| B1 Build | Build Proven | **PASS** | [B1-unit.log](./launch-evidence/B1-unit.log) · [B1-build.log](./launch-evidence/B1-build.log) |
| B2 E2E ×6 | Build Proven | **PASS** | [B2-results.json](./launch-evidence/B2-results.json) · [B2-playwright-report/](./launch-evidence/B2-playwright-report/) |
| B3 CI | Operationally Proven | **PENDING** | [B3-ci-run-url.txt](./launch-evidence/B3-ci-run-url.txt) — push to GitHub required |
| B4 Sentry | Operationally Proven | **PENDING** | `B4-sentry-screenshot.png` — see [B4-ops-proof-README](./launch-evidence/B4-ops-proof-README.md) |
| B4 S3 read | Code + unit tests PASS; ops **PENDING** | **PENDING** | `tests/blob-storage.test.ts` · `B4-s3-proof.png` |
| B4 Resend | Code PASS; ops **PENDING** | **PENDING** | `src/lib/email.ts` · `B4-resend-email.png` |
| B4 Health | Code Exists | **PASS** | `GET /api/health` |
| B5 Beta ops | Local volume evidence | **PARTIAL** | [B5-perf.json](./launch-evidence/B5-perf.json) · [B5-beta-metrics.png](./launch-evidence/B5-beta-metrics.png) |
| B6 Visual | Manual sign-off | **PENDING** | [B6-visual-signoff.md](./launch-evidence/B6-visual-signoff.md) — unsigned |
| 48-page audit | Automated | RUN | [MATRIX.md](./visual-audit/MATRIX.md) |

## Commands

```bash
npm run test          # Vitest → B1-unit.log
npm run build         # Next build → B1-build.log
npm run test:e2e      # 6 critical scenarios + warmup
npm run test:audit    # 48-page matrix
npm run db:seed:volume && npm run perf:p95 && npm run capture:beta
```

## Definition of Done

Launch Gate → **CLOSED** when B3 URL is green, B4 ops screenshots attached, B6 signed, and real staging cohort per [beta-cohort-runbook.md](./beta-cohort-runbook.md).

## Launch package (يوم الإطلاق)

- [GO-NO-GO-CHECKLIST.md](./launch-evidence/GO-NO-GO-CHECKLIST.md)
- [RISK-REGISTER.md](./launch-evidence/RISK-REGISTER.md)
- [LAUNCH-DAY-RUNBOOK.md](./launch-evidence/LAUNCH-DAY-RUNBOOK.md)
