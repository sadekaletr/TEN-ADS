# Runbook يوم الإطلاق — Beta Controlled

**التاريخ:** _______________  
**المنطقة الزمنية:** _______________  
**قائد الإطلاق (Ops):** _______________  
**قائد تقني (Dev):** _______________

> نفّذ بالترتيب. علّم ☐ عند الإكمال.  
> أي **حرج** → أوقف onboarding جديد + راجع [RISK-REGISTER.md](./RISK-REGISTER.md).

---

## T-24h — التحضير

| الوقت | المهمة | المسؤول | ☐ |
|-------|--------|---------|---|
| T-24h | مراجعة [GO-NO-GO-CHECKLIST.md](./GO-NO-GO-CHECKLIST.md) — مسودة GO/NO-GO | PM | ☐ |
| T-24h | تأكيد backup DB حديث + مسار restore معروف | DevOps | ☐ |
| T-20h | `npm run test` + `npm run build` على فرع الإطلاق | Dev | ☐ |
| T-20h | CI green — حفظ URL في `B3-ci-run-url.txt` | Dev | ☐ |
| T-16h | staging: جلسة B4 (S3 + Sentry + Resend) — 3 screenshots | DevOps | ☐ |
| T-12h | توقيع B6 أو قائمة استثناءات موثّقة | PM/Design | ☐ |
| T-8h | تجهيز cohort: أسماء 3 رعاة + 10 صناع + أرقام WhatsApp | Ops | ☐ |
| T-4h | إعلان داخلي: on-call + قناة incident | Ops | ☐ |

---

## T-2h — Pre-flight

| الوقت | المهمة | الأمر / المسار | ☐ |
|-------|--------|----------------|---|
| T-2h | Deploy إلى staging (أو prod إن جاهز) | pipeline / Hostinger | ☐ |
| T-2h | Migrate | `npx prisma migrate deploy` | ☐ |
| T-1h45 | Health | `curl /api/health` → `db: up` | ☐ |
| T-1h30 | Smoke D1–D7 | [GO-NO-GO](./GO-NO-GO-CHECKLIST.md) §D | ☐ |
| T-1h15 | Sentry test (staging فقط) | `GET /api/debug/sentry-test` + `ENABLE_SENTRY_TEST=1` | ☐ |
| T-1h | قرار Go/No-Go رسمي | توقيع PM + Ops | ☐ |

**إذا NO-GO:** أوقف الجدول؛ وثّق السبب؛ لا ترسل دعوات cohort.

---

## T-0 — ساعة الإطلاق

| الوقت | المهمة | تفاصيل | ☐ |
|-------|--------|--------|---|
| **T+0** | فتح الوصول للـ cohort | روابط login + تعليمات ShamCash | ☐ |
| T+15m | مراقبة Sentry | صفر errors حرجة؟ | ☐ |
| T+15m | مراقبة `/api/health` | uptime check | ☐ |
| T+30m | أول شحن؟ | تابع `/admin/wallet` | ☐ |
| T+45m | أول استرداد؟ | تابع `/admin/beta` أو live | ☐ |
| **T+1h** | **Checkpoint 1** | ملخص: errors / شحن / استرداد / شكاوى | ☐ |

### Checkpoint 1 — نموذج ملخص (انسخ في Slack/WhatsApp)

```
[T+1h] TENEGTA Beta
- Health: OK / FAIL
- Sentry new issues: N
- Top-ups pending: N | approved: N
- Redemptions (live): N
- Support tickets: N
- Blockers: none / <list>
```

---

## T+1h → T+4h — مراقبة نشطة

| الوقت | المهمة | ☐ |
|-------|--------|---|
| كل 30m | فحص Sentry + health | ☐ |
| كل 60m | `/admin/beta` — لقطة أو CSV | ☐ |
| عند الحاجة | موافقة شحن &lt; 4h SLA | ☐ |
| عند 429/login | تحقق Redis + rate limits | ☐ |

**تصعيد فوري إلى Dev إذا:**
- `db: down` &gt; 2 دقيقة
- نفس الخطأ &gt; 10 مرات في 5 دقائق
- فشل رفع proof لجميع المستخدمين (R02)

---

## T+4h — Checkpoint 2

| المهمة | ☐ |
|--------|---|
| cohort أكمل onboarding واحد على الأقل (راعٍ + صانع) | ☐ |
| لا incident حرج مفتوح | ☐ |
| قرار: استمر / تقليل cohort / rollback | ☐ |

---

## T+24h — يوم +1

| المهمة | ☐ |
|--------|---|
| تقرير `/admin/beta` → `docs/beta-findings-template.md` | ☐ |
| مراجعة AuditLog لأحداث غير عادية | ☐ |
| تحديث `LAUNCH_GATE.md` إن أُغلقت فجوات | ☐ |
| قرار canary S3: الإبقاء على `STORAGE_READ_CANARY=0` أو رفع تدريجي | ☐ |

---

## Rollback سريع (إن لزم)

1. `STORAGE_READ_CANARY=0`
2. Revert إلى image/deployment السابق
3. تحقق `/api/health`
4. أبلغ cohort عبر WhatsApp (قالب جاهز أدناه)
5. post-mortem خلال 24h

**قالب إيقاف مؤقت:**

> مرحبًا، نواجه ضغطًا تقنيًا بسيطًا على المنصة. الخدمة متوقفة مؤقتًا للصيانة (~ساعة). نرجع لكم فور الاستقرار. شكرًا لصبركم — فريق TENEGTA

---

## جهات الاتصال (املأ قبل T-0)

| الدور | الاسم | WhatsApp | ☐ |
|-------|-------|----------|---|
| Ops lead | | | ☐ |
| Dev on-call | | | ☐ |
| PM | | | ☐ |

---

**مراجع:** [GO-NO-GO-CHECKLIST.md](./GO-NO-GO-CHECKLIST.md) · [RISK-REGISTER.md](./RISK-REGISTER.md) · [ops-playbooks.md](../ops-playbooks.md)
