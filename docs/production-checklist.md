# Production Checklist — TENEGTA Spark

Each item has **Code** (implementation exists) and **Ops proof** (verified in staging/production with artifact in `docs/launch-evidence/`).

## Production deploy

| Item | Code | Ops proof |
|------|------|-----------|
| Use `db:seed:minimal` only in production | [x] `npm run db:seed:minimal` | [ ] no demo campaigns in prod |
| Post-deploy verification | [x] `npm run post-deploy` | [ ] run after each deploy |
| Change default admin password | — | [ ] first login |
| `ENABLE_DESIGN_PREVIEW` unset in prod | [x] middleware | [ ] `/design-preview` redirects |
| ShamCash transfer account from admin | [x] `/admin/wallet` | [ ] real account configured |

## Infrastructure

| Item | Code | Ops proof |
|------|------|-----------|
| `DATABASE_URL` + `prisma migrate deploy` | [x] CI + `.env.example` | [ ] production host |
| `REDIS_URL` + `RATE_LIMIT_INTERNAL_SECRET` | [x] middleware + rate-limit | [ ] production Redis |
| `NEXTAUTH_URL` + `NEXTAUTH_SECRET` | [x] `.env.example` | [ ] staging/prod values set |
| Sentry (`SENTRY_DSN`, release tagging) | [x] `sentry.*.config.ts`, `instrumentation.ts` | [ ] `B4-sentry-screenshot.png` |
| Resend (`RESEND_API_KEY`, `EMAIL_FROM`) | [x] `src/lib/email.ts`, admin/creator hooks | [ ] `B4-resend-email.png` |
| Storage (`STORAGE_*`, canary read) | [x] `blob-storage.ts`, `STORAGE_READ_CANARY` | [ ] `B4-s3-proof.png` |
| Health check | [x] `GET /api/health` | [ ] uptime monitor wired |

## Backups

| Item | Code | Ops proof |
|------|------|-----------|
| `scripts/backup-db.sh` documented | [x] script exists | [ ] cron on production |
| Restore drill | — | [ ] tested on staging |

## SEO / OG

| Item | Code | Ops proof |
|------|------|-----------|
| `public/robots.txt` | [x] | [ ] deployed |
| `/sitemap.xml` | [x] | [ ] deployed |
| `/campaign/[slug]` OG | [x] metadata | [ ] manual share smoke |
| `/creator/[handle]` OG | [x] metadata | [ ] manual share smoke |

## Security

| Item | Code | Ops proof |
|------|------|-----------|
| Proof images not in `public/` | [x] `storage/` + `/api/storage` | [x] local dev |
| Admin routes require session | [x] | [ ] prod smoke |
| Cron routes protected | [x] `CRON_SECRET` | [ ] prod smoke |
| No demo creds in prod | [x] `db:seed:minimal` | [ ] prod login check |

## Automated tests

| Item | Code | Ops proof |
|------|------|-----------|
| Vitest (`npm run test`) | [x] | [ ] `B1-unit.log` |
| Production build (`npm run build`) | [x] | [ ] `B1-build.log` |
| Playwright 6 critical scenarios | [x] `tests/e2e/*.spec.ts` | [ ] `B2-results.json` + HTML report |
| GitHub Actions CI green | [x] `.github/workflows/ci.yml` | [ ] `B3-ci-run-url.txt` |

## Beta & visual

| Item | Code | Ops proof |
|------|------|-----------|
| Beta metrics `/admin/beta` | [x] `AdminBetaClient` | [ ] `B5-beta-metrics.png` + real cohort |
| Dashboard p95 &lt; 500ms | [x] `scripts/perf-dashboard-p95.ts` | [ ] `B5-perf.json` on volume seed |
| Manual visual sign-off (6 pages) | [x] template | [ ] signed `B6-visual-signoff.md` |

## References

- [e2e-smoke-test.md](./e2e-smoke-test.md)
- [visual-audit/MATRIX.md](./visual-audit/MATRIX.md)
- [LAUNCH_GATE.md](./LAUNCH_GATE.md)
- [launch-evidence/](./launch-evidence/)
