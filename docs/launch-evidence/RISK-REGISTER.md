# Risk Register — Beta Controlled Launch

**آخر مراجعة:** 2026-06-24  
**النطاق:** TENEGTA Spark — Beta Controlled Launch (ليس Global Scale)

مقياس: **احتمال** (منخفض / متوسط / مرتفع) × **الأثر** (منخفض / متوسط / حرج) → **إجراء فوري**

---

## مصفوفة مختصرة

| ID | الخطر | احتمال | أثر | المالك | الإجراء الفوري |
|----|-------|--------|-----|--------|----------------|
| R01 | فشل CI بعد push — اختبارات flaky | متوسط | متوسط | Dev | `DISABLE_LOGIN_RATE_LIMIT=1` في CI؛ retries=2؛ warmup spec |
| R02 | S3 misconfig — قراءة proof خاطئة | متوسط | حرج | DevOps | `STORAGE_READ_CANARY=0` افتراضيًا؛ canary تدريجي؛ fallback محلي |
| R03 | لا بريد للـ Creator (لا email في schema) | مرتفع | متوسط | Product/Ops | in-app notification أساسي؛ Resend لـ OPS فقط؛ WhatsApp fallback |
| R04 | Resend معطّل أو rate-limited | متوسط | متوسط | Ops | تحقق `B4-resend-email.png`؛ مراقبة logs؛ لا تعتمد على email للمستخدم |
| R05 | Sentry لا يلتقط أخطاء prod | منخفض | حرج | DevOps | `SENTRY_DSN` + release tag؛ اختبار `ENABLE_SENTRY_TEST=1` على staging فقط |
| R06 | Login 429 أثناء E2E أو demo day | متوسط | منخفض | Dev | `DISABLE_LOGIN_RATE_LIMIT` في dev/staging؛ Redis في prod |
| R07 | `production-checklist` مضلل (code≠ops) | منخفض | متوسط | PM | عمودان Code/Ops؛ لا ✅ بدون artifact |
| R08 | Visual regression غير ملحوظ | متوسط | متوسط | Design/PM | B6 يدوي للصفحات الست؛ audit آلي ≠ جودة |
| R09 | Volume/perf وهمي على بيانات demo | متوسط | متوسط | Dev | `db:seed:volume` على staging؛ `B5-perf.json` على volume |
| R10 | Admin يوافق شحن خاطئ | منخفض | حرج | Ops | ConfirmDialog موجود؛ AuditLog؛ مراجعة proof في `/admin/wallet` |
| R11 | امتلاء جوائز 100% بدون تنبيه راعٍ | متوسط | متوسط | Ops | playbook §4؛ إشعار 85% |
| R12 | Migrate irreversible على prod | منخفض | حرج | DevOps | backup قبل deploy؛ لا `migrate reset`؛ rollback playbook |
| R13 | تسريب demo credentials | منخفض | حرج | DevOps | `db:seed:minimal` فقط على prod؛ فحص `/login` |
| R14 | SSE/live redemptions تحت ضغط | متوسط | متوسط | Dev | مراقبة p95؛ تقليل cohort إذا latency &gt; 500ms |
| R15 | ضغط دعم WhatsApp يوم الإطلاق | مرتفع | متوسط | Ops | cohort صغير (3+10)؛ FAQ جاهز؛ on-call معرّف |

---

## تفاصيل الخطر الأعلى (Top 5)

### R02 — S3 read misconfig
- **الإشارة المبكرة:** 404/500 على `/api/storage/...`؛ proof فارغ في admin
- **الإجراء:** `STORAGE_READ_CANARY=0` → revert deploy → راجع `STORAGE_ENDPOINT` / bucket / key
- **الدليل المطلوب:** `B4-s3-proof.png`

### R03 — Creator بلا email
- **الإشارة المبكرة:** شكاوى "لم يصلني تأكيد"
- **الإجراء:** وجّه لـ `/dashboard/notifications`؛ OPS يتابع عبر WhatsApp
- **قرار منتج لاحق:** حقل email اختياري في onboarding

### R05 — Sentry صامت
- **الإشارة المبكرة:** أخطاء في logs بدون issues في dashboard
- **الإجراء:** تحقق DSN + `withSentryConfig` + release؛ اختبار staging
- **الدليل:** `B4-sentry-screenshot.png`

### R12 — Migration فاشلة
- **الإشارة المبكرة:** deploy ينجح لكن `db: down` في health
- **الإجراء:** rollback image؛ restore من backup؛ لا تكرار migrate blindly
- **مرجع:** [ops-playbooks.md](../ops-playbooks.md) §5 Rollback

### R15 — فريق الدعم م overwhelmed
- **الإشارة المبكرة:** &gt;5 تذاكر متزامنة في أول ساعتين
- **الإجراء:** إيقاف onboarding جديد مؤقتًا؛ تجميع FAQ؛ تصعيد لـ dev إذا bug متكرر

---

## سجل القرارات (املأ عند الإطلاق)

| التاريخ | الخطر | القرار | من |
|---------|-------|--------|-----|
| | | | |

---

**مراجع:** [ops-playbooks.md](../ops-playbooks.md) · [GO-NO-GO-CHECKLIST.md](./GO-NO-GO-CHECKLIST.md)
