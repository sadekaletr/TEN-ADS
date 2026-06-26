# TENEGTA — Operational Playbooks (Beta)

Runbooks for manual ops during beta. Link every admin action to `AuditLog` where possible.

---

## 1. فشل رفع إثبات الشحن (proof upload)

**الأعراض:** المستخدم يرى خطأ بعد رفع الصورة، أو `proofImageUrl` فارغ في `/admin/wallet`.

**الإجراء الحالي:** `uploadTopUpProof` يرمي exception؛ الطلب يبقى `PENDING` بدون proof.

**الإجراء المطلوب:**

1. اطلب من الصانع إعادة المحاولة من `/dashboard/wallet` (زر رفع الإثبات).
2. إن فشل التخزين (`storage/` ممتلئ أو صلاحيات):
   - Admin يراجع `TopUpRequest` في `/admin/wallet`
   - يتواصل عبر WhatsApp ويطلب إرسال الإثبات
   - بعد الموافقة اليدوية: `approveTopUp` مع ملاحظة في `AuditLog`
3. سجّل في AuditLog: `action: wallet.topup_proof_failed` مع `requestId` وسبب الخطأ.

**منع التكرار:** تأكد من وجود مجلد `storage/` قابل للكتابة على الخادم؛ في الإنتاج فعّل `STORAGE_*` لـ S3.

---

## 2. فشل البريد الإلكتروني

**الأعراض:** لا يصل بريد تأكيد؛ الإشعار داخل التطبيق فقط.

**الإجراء الحالي:** [`src/lib/email.ts`](../src/lib/email.ts) يتخطى الإرسال بصمت إذا لم يُضبط `RESEND_API_KEY`.

**الإجراء المطلوب:**

1. تحقق من logs الخادم لسطر `email skipped` أو خطأ API.
2. الإشعار داخل التطبيق (`Notification`) يبقى المصدر الأساسي — أبلغ المستخدم أن يفتح لوحة الإشعارات.
3. للعمليات الحرجة (موافقة شحن، رفض): Admin يتابع يدوياً عبر WhatsApp.
4. لا تعيد المحاولة أكثر من 3 مرات؛ سجّل `email.failed` في metadata.

**Fallback:** In-app notification + log فقط حتى تفعيل Resend في production.

---

## 3. حذف حملة بالخطأ

**الأعراض:** حملة اختفت من لوحة الصانع؛ `deletedAt` مضبوط.

**الإجراء الحالي:** Soft delete عبر `deletedAt` على `Campaign`.

**الإجراء المطلوب:**

1. من Prisma Studio أو script admin: اضبط `deletedAt = null` للحملة المعنية.
2. سجّل `AuditLog`:
   - `action: campaign.restored`
   - `entityType: Campaign`
   - `entityId: <id>`
   - `actorType: admin`
3. أبلغ الصانع والراعي إذا كانت الحملة `ACTIVE` سابقاً.
4. راجع QR والروابط `/campaign/[slug]` — يجب أن تعمل بعد الاستعادة.

**منع التكرار:** استخدم `ConfirmDialog` قبل الحذف (موجود في واجهة الحملات).

---

## 4. امتلاء الجوائز 100%

**الأعراض:** `prizeClaimed >= prizeQuantity`؛ الحملة `ENDED`؛ إشعار عند 85%.

**الإجراء الحالي:** تحويل الحالة إلى `ENDED` + إشعار عند 85%.

**الإجراء المطلوب عند الامتلاء:**

1. **Auto-pause:** تأكد أن الحالة `ENDED` (لا استرداد جديد).
2. **تنبيه الراعي:** إشعار sponsor + اقتراح تجديد الكمية أو حملة جديدة.
3. **إخفاء من Landing:** إذا كانت `featuredCampaignId` في `PlatformSettings`، أزلها من `/admin/homepage`.
4. سجّل `campaign.prizes_exhausted` في AuditLog.

**تجديد الجوائز:** Admin أو الصانع يزيد `prizeQuantity` ويعيد `status` إلى `ACTIVE` بعد اتفاق مع الراعي.

---

## 5. Rollback & canary (deploy)

**When to rollback:** error rate spike in Sentry, S3 read failures, or p95 &gt; 2× baseline after deploy.

**Immediate mitigations (no code deploy):**

1. **S3 read canary off:** set `STORAGE_READ_CANARY=0` — reads revert to local `storage/` even if `STORAGE_*` is set.
2. **Sentry test route:** ensure `ENABLE_SENTRY_TEST` is unset in production.
3. **Disable risky cron** if implicated — rotate `CRON_SECRET` if leaked.

**Application rollback:**

1. Revert to previous deployment artifact / container image on Hostinger.
2. Run `npx prisma migrate deploy` only if the reverted build expects an older schema — **migrations are forward-only**; do not `migrate reset` on production.
3. If a migration is irreversible, restore DB from latest `scripts/backup-db.sh` snapshot on staging first, then production with ops approval.

**Canary procedure (S3 read):**

| Phase | `STORAGE_READ_CANARY` | Monitor |
|-------|----------------------|---------|
| Staging | `1` (100%) | proof upload + `/api/storage/...` admin view |
| Prod pilot | `1` on single instance / 10% traffic | Sentry, `/api/health`, top-up approvals |
| Full flip | `1` everywhere | 48h error budget |
| Rollback | `0` | local read fallback |

**Post-rollback:** document incident in AuditLog metadata; update [`LAUNCH_GATE.md`](./LAUNCH_GATE.md) if gate evidence is invalidated.

---

## 6. Sentry alerts (production)

Configure in Sentry project settings:

- **Error rate:** alert when 5xx or unhandled errors &gt; 10 events / 5 min (adjust per traffic).
- **Release health:** tag releases with `SENTRY_RELEASE=tenegta-spark@<version>`; compare regressions after deploy.
- **Health endpoint:** external uptime check on `GET /api/health` every 60s; page ops if `db: "down"`.

---

## مرجع AuditLog

كل إجراء admin يجب أن يمر عبر [`logAudit`](../src/lib/audit.ts):

| الحدث | action مقترح |
|-------|----------------|
| موافقة شحن | `wallet.topup_approved` |
| رفض شحن | `wallet.topup_rejected` |
| استعادة حملة | `campaign.restored` |
| امتلاء جوائز | `campaign.prizes_exhausted` |
| فشل proof | `wallet.topup_proof_failed` |

---

## جهات الاتصال (املأ قبل Beta)

| الدور | الاسم | WhatsApp |
|-------|-------|----------|
| Ops lead | | |
| Admin on-call | | |
| Dev escalation | | |
