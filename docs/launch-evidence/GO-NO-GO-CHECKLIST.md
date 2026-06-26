# Go / No-Go — Beta Controlled Launch

**التاريخ المخطط:** _______________  
**قرار:** ☐ GO · ☐ NO-GO · ☐ GO with conditions  
**موقّع PM:** _______________ · **موقّع Ops:** _______________

> استخدم هذا المستند **يوم الإطلاق** قبل فتح الوصول لأول cohort.  
> أي بند Ops بدون دليل = **NO-GO** افتراضيًا.

---

## A — Launch Gate (إلزامي)

| # | البند | الطبقة | الحالة | الدليل |
|---|-------|--------|--------|--------|
| A1 | Unit tests | Build Proven | ☐ | `B1-unit.log` |
| A2 | Production build | Build Proven | ☐ | `B1-build.log` |
| A3 | E2E ×6 | Build Proven | ☐ | `B2-results.json` |
| A4 | CI green على `main` | Ops | ☐ | `B3-ci-run-url.txt` |
| A5 | Sentry event | Ops | ☐ | `B4-sentry-screenshot.png` |
| A6 | S3 private read | Ops | ☐ | `B4-s3-proof.png` |
| A7 | Resend delivery | Ops | ☐ | `B4-resend-email.png` |
| A8 | Health endpoint | Code + Ops | ☐ | `GET /api/health` + monitor |
| A9 | Beta KPIs لوحة | Ops | ☐ | `B5-beta-metrics.png` (staging) |
| A10 | Visual sign-off ×6 | Ops | ☐ | `B6-visual-signoff.md` موقّع |

**قاعدة:** A1–A3 + A8 = كافية لـ **staging smoke فقط**.  
**Beta Controlled GO** يتطلب A1–A10 مكتملة.

---

## B — البنية التحتية (يوم الإطلاق)

| # | البند | ☐ |
|---|-------|---|
| B1 | `DATABASE_URL` + `prisma migrate deploy` ناجح على staging/prod |
| B2 | `NEXTAUTH_URL` + `NEXTAUTH_SECRET` صحيحان للدومين النهائي |
| B3 | SSL فعّال؛ لا mixed-content |
| B4 | `REDIS_URL` + rate limits مفعّلة (أو قرار مكتوب بتأجيلها) |
| B5 | `STORAGE_*` للكتابة؛ `STORAGE_READ_CANARY=0` حتى مرحلة canary |
| B6 | `RESEND_API_KEY` + `EMAIL_FROM` + `TOPUP_NOTIFY_EMAIL` / `OPS_ALERT_EMAIL` |
| B7 | `SENTRY_DSN` + `SENTRY_RELEASE=tenegta-spark@<version>` |
| B8 | Backup DB مجدول؛ آخر snapshot &lt; 24h |
| B9 | `SEED_MODE=minimal` على prod — لا demo credentials |
| B10 | Cron routes محمية بـ `CRON_SECRET` |

---

## C — المنتج والتشغيل (cohort أول)

| # | البند | ☐ |
|---|-------|---|
| C1 | ≥3 رعاة onboarded (حساب + verify + ShamCash instructions) |
| C2 | ≥10 صناع onboarded (شحن + حملة ACTIVE) |
| C3 | قناة دعم WhatsApp Business + on-call معرّف في `ops-playbooks.md` |
| C4 | Admin wallet جاهز لموافقات الشحن &lt; 4h في أوقات العمل |
| C5 | مسار استرداد `/c/[code]` مختبر على جهاز موبايل حقيقي |
| C6 | Incident channel (Slack/WhatsApp group) مفعّل |

---

## D — Smoke يدوي سريع (15 دقيقة)

نفّذ بالترتيب على **staging** ثم **prod** (إن GO):

| # | المسار | النتيجة المتوقعة | ☐ |
|---|--------|------------------|---|
| D1 | `/` | Landing + أرقام لاتينية | ☐ |
| D2 | Creator login → `/dashboard/campaigns` | قائمة حملات | ☐ |
| D3 | `/dashboard/wallet/topup` | wizard كامل | ☐ |
| D4 | Admin → `/admin/wallet` | موافقة شحن | ☐ |
| D5 | `/c/SPARK-HERO-H1` | شاشة ترحيب | ☐ |
| D6 | Sponsor → `/sponsor/roi` | بيانات ROI | ☐ |
| D7 | `/api/health` | `{ "ok": true, "db": "up" }` | ☐ |

---

## E — قرار الإطلاق

| السيناريو | الشرط | القرار |
|-----------|-------|--------|
| **GO — Beta Controlled** | A1–A10 + B1–B10 + C1–C4 + D1–D7 | فتح cohort محدود |
| **GO with conditions** | فجوة واحدة non-critical + خطة &lt; 48h | إطلاق مع مراقبة مضاعفة |
| **NO-GO** | أي فجوة في A1–A4 أو B1–B3 أو فشل D7 | تأجيل + إصلاح |

**شروط GO with conditions (مثال مسموح):**
- B4 Redis مؤجّل مع rate limit in-memory + موافقة مكتوبة
- C5/C6 قيد الإعداد لكن C1–C4 جاهزة

**شروط NO-GO (مثال إلزامي):**
- لا CI green
- لا Sentry على prod
- فشل migrate أو health `db: down`

---

## F — ما بعد القرار

| إذا GO | إذا NO-GO |
|--------|-----------|
| ابدأ [LAUNCH-DAY-RUNBOOK.md](./LAUNCH-DAY-RUNBOOK.md) | سجّل السبب في AuditLog / meeting notes |
| فعّل مراقبة Sentry 48h | حدّث `LAUNCH_GATE.md` = OPEN |
| `STORAGE_READ_CANARY` حسب خطة canary | أعد جدولة + أغلق الفجوة في checklist |
| تقرير يومي لـ `/admin/beta` | لا تفتح cohort |

---

**مراجع:** [LAUNCH_GATE.md](../LAUNCH_GATE.md) · [production-checklist.md](../production-checklist.md) · [beta-cohort-runbook.md](../beta-cohort-runbook.md)
