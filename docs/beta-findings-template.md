# Beta Findings — Week N

**الفترة:** YYYY-MM-DD → YYYY-MM-DD  
**المُعد:**  
**بيئة:** staging / production beta

---

## ملخص الأرقام (من `/admin/beta`)

| Metric | القيمة | الهدف |
|--------|--------|-------|
| Time to First Campaign (median) | | < 48h |
| Time to First Redemption (median) | | < 7d |
| Time to Top-up Approved (median) | | < 24h |
| Creator Retention (30d) | | ≥ 20% |
| Redemptions (30d) | | 200+ بحلول الأسبوع 6 |
| Active creators / sponsors | | 20–50 / 3–5 |

---

## UX Friction

نقاط احتكاك من الملاحظات الميدانية والدعم.

| # | الوصف | الشريحة | الخطورة | اقتراح |
|---|--------|---------|---------|--------|
| 1 | | creator / sponsor / consumer | H/M/L | |
| 2 | | | | |

---

## Trust Issues

شكوك حول الإثباتات، التحقق، SLA.

| # | الوصف | الدليل | الإجراء |
|---|--------|--------|---------|
| 1 | | | |

---

## Performance Issues

صفحات أو API أبطأ من **1s** (أو p95 > 500ms للوحات).

| Surface | الوقت المقاس | الحجم | ملاحظات |
|---------|--------------|-------|---------|
| Dashboard | | | |
| Sponsor ROI | | | |
| Redeem flow | | | |

راجع [`perf-queries.md`](perf-queries.md) لـ EXPLAIN ANALYZE.

---

## Operational Issues

حوادث admin / شحن / استرداد — راجع [`ops-playbooks.md`](ops-playbooks.md).

| التاريخ | الحدث | الإجراء | AuditLog id |
|---------|-------|---------|-------------|
| | | | |

---

## Revenue Opportunities

ما طلبه الرعاة للدفع أو التوسع.

| # | الطلب | من | أولوية v2 |
|---|-------|-----|-----------|
| 1 | | | |

---

## قرارات الأسبوع

- [ ] blocker جديد → يوقف التوسع
- [ ] تحسين v2 → يُضاف للـ backlog
- [ ] لا إجراء

**ملاحظات حرة:**

---

## تجميع أسبوعي (للمشرف)

```bash
# على staging بعد volume seed للتحقق من الأداء
npm run db:seed:volume
# ثم راجع /admin/beta وانسخ القيم إلى هذا القالب
```

احفظ نسخة من كل أسبوع في `docs/beta-reports/week-N.md` (اختياري).
