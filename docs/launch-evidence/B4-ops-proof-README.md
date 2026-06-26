# Ops proof placeholders — Blocker 4

Attach real screenshots from staging/production when available.  
Do **not** mark Launch Gate rows as CLOSED until files exist here.

| Artifact | File | How to capture |
|----------|------|----------------|
| Sentry test event | `B4-sentry-screenshot.png` | Set `SENTRY_DSN`, deploy staging, `GET /api/debug/sentry-test` with `ENABLE_SENTRY_TEST=1`, screenshot Sentry Issues |
| S3 proof read | `B4-s3-proof.png` | Upload top-up proof with `STORAGE_*` + `STORAGE_READ_CANARY=1`, open `/api/storage/...` as admin |
| Resend delivery | `B4-resend-email.png` | Set `RESEND_API_KEY`, approve top-up with `TOPUP_NOTIFY_EMAIL`, screenshot inbox |

Code evidence (no screenshot required):

- `tests/blob-storage.test.ts` — S3 mock GET/PUT + local fallback
- `src/lib/blob-storage.ts` — `STORAGE_READ_CANARY`
- `src/app/api/health/route.ts` — `GET` → `{ ok, db }`
- `sentry.*.config.ts` — `release`, `environment`
