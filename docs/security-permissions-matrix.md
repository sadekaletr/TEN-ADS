# TENEGTA — Security Permissions Matrix (Beta)

Manual verification checklist before beta launch. Run after each auth/storage change.

## Private storage (`/api/storage/[key]`)

| Actor | Top-up proof | Verification photo |
|-------|--------------|-------------------|
| Admin | ✅ all | ✅ all |
| Creator (owner) | ✅ own requests | ✅ own campaign redemptions |
| Creator (other) | ❌ | ❌ |
| Sponsor | ❌ | ❌ |
| Anonymous | ❌ | ❌ |

Proofs are stored under `storage/` (local) or S3 via `STORAGE_*` env — **not** under `public/`.

Legacy URLs (`/topup-proofs/`, `/verifications/`) must not be used for new uploads.

## Portal data isolation

| Actor | Must see | Must NOT see |
|-------|----------|--------------|
| Creator A | Own campaigns, wallet, redemptions | Creator B campaigns, sponsor PII beyond collab |
| Sponsor A | Own campaigns, leads, ROI | Sponsor B campaigns |
| Admin | All via `/admin/*` | — |
| Anonymous | `/campaign/[slug]`, `/c/[code]` ACTIVE only | Dashboard, proof URLs, admin |

## API routes

| Route | Auth | IDOR guard |
|-------|------|------------|
| `GET /api/network/sponsors` | Creator session | `creatorId` query must match session |
| `GET /api/network/creators` | Sponsor session | `sponsorId` query must match session |
| `GET /api/network/template` | Creator session | `creatorId` query must match session |
| `GET /api/storage/[key]` | Any authenticated role with ownership | Key prefix + DB ownership check |

## Manual test script

1. Log in as Creator A → upload top-up proof → open `/api/storage/...` → 200.
2. Log in as Creator B → same URL → 403.
3. Log in as Admin → same URL → 200.
4. Log out → same URL → 401.
5. Creator A → `/api/network/sponsors?creatorId=<B id>` → 403.
6. Sponsor A → `/api/network/creators?sponsorId=<B id>` → 403.

## Pre-launch

- [ ] No files in `public/topup-proofs/` or `public/verifications/` on staging
- [ ] `storage/` in `.gitignore`
- [ ] Security review on release diff
