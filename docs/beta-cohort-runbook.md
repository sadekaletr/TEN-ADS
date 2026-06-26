# TENEGTA — Beta Cohort Runbook

تشغيل برنامج Beta لمدة **4–6 أسابيع** مع مستخدمين حقيقيين.

## معايير القبول

| الشريحة | العدد | المعايير |
|---------|-------|----------|
| رعاة | 3–5 | قطاعات مختلفة (مطاعم، retail، خدمات) |
| صناع | 20–50 | ≥5 verified عبر `/admin/trust` |
| استردادات | 200–500 | حقيقية خلال 6 أسابيع |

## بيئة التشغيل

- [ ] Staging منفصل عن demo seed — `npm run db:seed:minimal` ثم حسابات يدوية
- [ ] Domain حقيقي + SSL
- [ ] [`production-checklist.md`](production-checklist.md) مكتمل
- [ ] قناة دعم WhatsApp Business
- [ ] Admin wallet جاهز للشحن اليدوي السريع

## Onboarding — راعٍ

لكل راعٍ جديد:

1. [ ] إنشاء حساب sponsor + verify badge (`/admin/trust`)
2. [ ] إرسال تعليمات ShamCash من `/admin/settings`
3. [ ] أول حملة مع صانع (collab أو marketplace)
4. [ ] مراجعة ROI بعد **10 استردادات** (`/sponsor/roi`)
5. [ ] تسجيل وقت الإكمال في جدول المتابعة

**هدف:** دورة كاملة (حملة → استرداد → ROI) خلال 3 أسابيع.

## Onboarding — صانع

لكل صانع جديد:

1. [ ] شحن Spark — مسار كامل [`e2e-smoke-test.md`](e2e-smoke-test.md)
2. [ ] أول حملة ACTIVE في **< 30 دقيقة** (سجّل الوقت)
3. [ ] مشاركة `/campaign/[slug]` على قناة حقيقية
4. [ ] أول استرداد من متابع حقيقي
5. [ ] verified badge إن تجاوز trust threshold

## جدول المتابعة الأسبوعي

| الأسبوع | رعاة نشطون | صناع نشطون | استردادات تراكمية | ملاحظات |
|---------|------------|------------|-------------------|---------|
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |
| 4 | | | | |
| 5 | | | | |
| 6 | | | | |

## مقاييس من `/admin/beta`

راجع أسبوعياً:

- Time to First Campaign (median / p90)
- Time to First Redemption
- Time to Top-up Approved
- Creator Retention (≥2 campaigns / 30d)
- Redemptions (30d)

## بوابة الخروج من Beta

- [ ] ≥3 رعاة أكملوا دورة كاملة
- [ ] ≥10 صناع أطلقوا حملة ثانية
- [ ] صفر تسريب proof URLs ([`security-permissions-matrix.md`](security-permissions-matrix.md))
- [ ] p95 dashboard < 500ms على volume seed ([`perf-queries.md`](perf-queries.md))

## ما لن نبنيه أثناء Beta

- Spark Network 2.0 / ML
- Payments automation
- Native app
- ميزات Intelligence جديدة

تُقيَّم بعد [`beta-findings-template.md`](beta-findings-template.md) فقط.
