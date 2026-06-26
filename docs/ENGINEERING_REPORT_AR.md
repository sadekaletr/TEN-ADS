# TENEGTA Spark — التقرير الشامل للموقع

**الإصدار:** 0.1.0  
**آخر تحديث:** يونيو 2026  
**المشروع:** `tenegta-spark` — monolith واحد (Next.js 14 App Router)  
**الغرض:** مرجع واحد يغطي **كل الموقع**: المسارات، الأدوار، البيانات، الأمان، Landing، Beta، والجاهزية للإطلاق.

---

## فهرس المحتويات

1. [ملخص تنفيذي](#1-ملخص-تنفيذي)
2. [البنية التقنية](#2-البنية-التقنية)
3. [خريطة الموقع الكاملة](#3-خريطة-الموقع-الكاملة)
4. [قاعدة البيانات](#4-قاعدة-البيانات)
5. [المصادقة والأمان](#5-المصادقة-والأمان)
6. [الصفحة الرئيسية (Landing)](#6-الصفحة-الرئيسية-landing)
7. [بوابة الصانع (Creator)](#7-بوابة-الصانع-creator)
8. [بوابة الراعي (Sponsor)](#8-بوابة-الراعي-sponsor)
9. [رحلة المستهلك (Redeem)](#9-رحلة-المستهلك-redeem)
10. [السوق والتعاون (Marketplace)](#10-السوق-والتعاون-marketplace)
11. [مركز التحكم (Admin)](#11-مركز-التحكم-admin)
12. [الوكالة (Agency)](#12-الوكالة-agency)
13. [الذكاء والتحليلات](#13-الذكاء-والتحليلات)
14. [واجهات API](#14-واجهات-api)
15. [نظام التصميم والحركة](#15-نظام-التصميم-والحركة)
16. [التدويل والمحتوى](#16-التدويل-والمحتوى)
17. [برنامج Beta Readiness](#17-برنامج-beta-readiness)
18. [الجاهزية للإنتاج](#18-الجاهزية-للإنتاج)
19. [الاختبارات والأوامر](#19-الاختبارات-والأوامر)
20. [تقييم الجاهزية والفجوات](#20-تقييم-الجاهزية-والفجوات)

---

## 1. ملخص تنفيذي

**TENEGTA Spark** منصة تسويق بالحوافز تربط **صناع المحتوى** بـ **الرعاة (التجار)** و**المستهلكين** عبر حملات جوائز رقمية. العملة الداخلية **Spark**؛ الشحن اليدوي عبر **ShamCash**؛ الاسترداد فوري عبر أكواد وQR.

### الأدوار

| الدور | الوصف | الدخول |
|-------|--------|--------|
| **مجهول** | Landing، استرداد، صفحات حملة/صانع عامة | `/` · `/c/[code]` · `/campaign/[slug]` |
| **صانع (Creator)** | حملات، محفظة، تحليلات، تعاون | `/login` → `/dashboard` |
| **راعٍ (Sponsor)** | حملات، leads، ROI، سوق صناع | `/sponsor/login` → `/sponsor` |
| **إدارة (Admin)** | شحن، ثقة، homepage، Beta metrics | `/admin/login` → `/admin` |
| **وكالة (Agency)** | إدارة صناع ضمن وكالة | `/agency/login` → `/agency/dashboard` |

### أرقام المشروع (يونيو 2026)

| البند | العدد |
|-------|-------|
| صفحات (`page.tsx`) | **48** |
| مسارات API | **18** |
| نماذج Prisma | **27** |
| migrations | **6** |
| مكوّنات UI primitives | **36** |
| أقسام Landing | **16** |
| وثائق تشغيل (`docs/`) | **9** |

### تقييم جاهزية تقريبي

| المحور | التقييم | ملاحظة |
|--------|---------|--------|
| نطاق المنتج (ورقياً) | **8.8–9.2 / 10** | مسارات كاملة لكل دور |
| Design System | **9 / 10** | primitives موحّدة + design-preview |
| محتوى حقيقي (Wallet/Notifications) | **9 / 10** | format-transaction + copy موحّد |
| Landing وتجربة أولى | **9+ / 10** | aurora، scroll reveal، بيانات حية |
| Admin Ops | **9 / 10** | Control Center + proof preview |
| أمان تشغيلي | **8 / 10** | تخزين خاص + IDOR guards؛ S3 read متبقي |
| إنتاج (Sentry/email/S3) | **7 / 10** | stubs + checklists |
| اختبارات آلية | **6 / 10** | Vitest أساسي؛ لا E2E Playwright |

---

## 2. البنية التقنية

### الحزم

| التقنية | الإصدار | الاستخدام |
|---------|---------|-----------|
| Next.js | 14.2.x | App Router، SSR، API |
| React | 18.3.x | UI |
| TypeScript | 5.8.x | أنواع |
| Prisma | 6.9.x | ORM |
| PostgreSQL | 16 | بيانات (منفذ **5435**) |
| Redis | 7 | SSE حي + rate limit (منفذ **6381**) |
| NextAuth | 4.24.x | JWT + Credentials (4 أدوار) |
| Framer Motion | 12.x | حركة Landing وDashboard |
| Tailwind CSS | 3.4.x | تصميم |
| Vitest | 3.x | unit tests |

### هيكل المجلدات

```
Ads_Tenegta/
├── prisma/           schema، 6 migrations، 3 seeds
├── src/
│   ├── app/          48 صفحة + 18 API + server actions
│   ├── components/   ~174 مكوّن (landing، dashboard، admin، ui…)
│   ├── lib/          ~83 ملف (auth، wallet، intelligence، storage…)
│   └── messages/     ar.json، en.json
├── docs/             9 وثائق تشغيل
├── tests/            lib.test.ts
├── scripts/          smoke-test.ts، backup-db.sh
├── storage/          إثباتات خاصة (gitignored)
└── public/           robots.txt، brand، QR
```

### مخطط البنية

```
المتصفح (RTL/LTR)
    │
Next.js 14 + Middleware (أدوار + rate limit)
    │
├── Server Components / Actions
├── API Routes
    │
├── PostgreSQL (Prisma)
├── Redis (SSE + rate limit)
├── storage/ أو S3 (إثباتات)
└── NextAuth JWT
```

---

## 3. خريطة الموقع الكاملة

### 3.1 عام — بدون تسجيل (9+)

| المسار | الوظيفة |
|--------|---------|
| `/` | Landing كاملة (16 قسمًا) |
| `/privacy` | سياسة الخصوصية |
| `/terms` | شروط الاستخدام |
| `/redeem` | إدخال كود يدوي |
| `/c/[code]` | رحلة استرداد |
| `/campaign/[slug]` | صفحة حملة عامة |
| `/creator/[handle]` | ملف صانع عام |
| `/shop/[sponsorId]` | متجر/حملات راعٍ |
| `/leaderboard/sponsors/[city]` | ترتيب رعاة حسب مدينة |
| `/design-preview` | مرجع Design System (تطوير) |

### 3.2 دخول (4)

| المسار | الدور |
|--------|-------|
| `/login` | Creator |
| `/sponsor/login` | Sponsor |
| `/admin/login` | Admin |
| `/agency/login` | Agency |

### 3.3 صانع — `/dashboard/*` (17)

| المسار | الوظيفة |
|--------|---------|
| `/dashboard` | لوحة رئيسية (KPI + live + حملات) |
| `/dashboard/campaigns` | قائمة الحملات |
| `/dashboard/campaigns/new` | معالج إنشاء (Campaign Wizard) |
| `/dashboard/campaigns/[id]` | تفاصيل + تحليلات |
| `/dashboard/campaigns/[id]/analytics` | تحليلات متقدمة |
| `/dashboard/campaigns/[id]/assets` | أصول QR |
| `/dashboard/campaigns/[id]/fraud` | إشارات احتيال |
| `/dashboard/campaigns/[id]/live` | استرداد حي |
| `/dashboard/campaigns/[id]/participants` | مشاركون |
| `/dashboard/campaigns/[id]/settings` | إعدادات |
| `/dashboard/command` | Command Center (حركة قوية) |
| `/dashboard/wallet` | محفظة + سجل غني |
| `/dashboard/wallet/topup` | شحن ShamCash (stepper + proof) |
| `/dashboard/notifications` | صندوق إشعارات |
| `/dashboard/requests` | طلبات تعاون |
| `/dashboard/listing` | قائمة Marketplace |
| `/wallet/topup` | alias → محفظة |

### 3.4 راعٍ — `/sponsor/*` + marketplace (8)

| المسار | الوظيفة |
|--------|---------|
| `/sponsor` | نظرة عامة |
| `/sponsor/campaigns` | حملات الراعي |
| `/sponsor/leads` | leads / استردادات |
| `/sponsor/roi` | ROI + SLA |
| `/sponsor/notifications` | إشعارات |
| `/marketplace` | سوق صناع (يتطلب sponsor) |
| `/marketplace/discover` | اكتشاف حملات |
| `/partner` | redirect → `/sponsor` |

### 3.5 إدارة — `/admin/*` (8)

| المسار | الوظيفة |
|--------|---------|
| `/admin` | نظرة عامة |
| `/admin/wallet` | طلبات شحن + **معاينة proof** |
| `/admin/settings` | إعدادات منصة + سعر Spark |
| `/admin/settings/transfer` | ShamCash |
| `/admin/homepage` | حملة مميزة / hero |
| `/admin/trust` | توثيق صناع ورعاة |
| `/admin/beta` | مقاييس Beta + تصدير CSV |

### 3.6 وكالة + ذكاء (3)

| المسار | الوظيفة |
|--------|---------|
| `/agency/dashboard` | أعضاء الوكالة |
| `/intelligence/heatmap` | خريطة حرارية (اشتراك) |

---

## 4. قاعدة البيانات

**PostgreSQL** — **27 نموذجاً**، **11 enum**.

### النماذج الأساسية

| النموذج | الغرض |
|---------|--------|
| `Creator` | صانع، محفظة، trust، soft-delete |
| `Sponsor` | راعٍ، streak، verify |
| `Campaign` | حملة (tier، codes، anti-abuse، slug) |
| `CampaignCode` | SHARED / UNIQUE + QR |
| `Redemption` | استرداد + verification photo |
| `Participant` | رسم بياني مجهول للمشاركين |
| `WalletTransaction` | TOPUP / CAMPAIGN_SPEND / REFUND |
| `TopUpRequest` | شحن ShamCash + `proofImageUrl` |
| `PlatformSettings` | ShamCash، featured IDs، sparkUnit |
| `Notification` | إشعارات in-app |
| `AuditLog` | تدقيق immutable |
| `CollabRequest` | طلبات تعاون sponsor→creator |
| `CreatorListing` | ملف Marketplace |

### التحليلات والذكاء

`CampaignVisit` · `CampaignEvent` · `CampaignMetricHourly` · `FraudSignal` · `TrustScoreSnapshot` · `SparkScoreSnapshot` · `IntelligenceSubscription`

### Indexes أداء (Beta)

- `Campaign`: `[sponsorId, status]`، `[status, createdAt]`
- `Redemption`: `[createdAt]`، `[campaignId, createdAt]`

### Migrations

1. init → analytics → enterprise → intelligence → **beta_perf_indexes** → **quality_readiness**

---

## 5. المصادقة والأمان

### NextAuth (`src/lib/auth.ts`)

| Provider | تسجيل الدخول | الدور |
|----------|--------------|-------|
| creator | phone + password | creator |
| admin | email + password | admin |
| sponsor | email + password | sponsor |
| agency_admin | email + password | agency_admin |

- JWT sessions · bcrypt · `logAudit` عند فشل الدخول
- Soft-delete على Creator/Sponsor

### Middleware

- حماية أدوار: `/dashboard`، `/admin`، `/sponsor`، `/marketplace`، `/agency`، `/intelligence`
- **Rate limit:** redeem 30/min/IP · login 10/15min/IP
- إنتاج: `REDIS_URL` + `RATE_LIMIT_INTERNAL_SECRET`

### التخزين الخاص

| النوع | المسار | الوصول |
|-------|--------|--------|
| إثبات شحن | `storage/topup-proofs/` | admin + صاحب الطلب |
| صورة تحقق | `storage/verifications/` | admin + صانع الحملة |
| التقديم | `blob-storage.ts` | local أو S3 (`STORAGE_*`) |
| القراءة | `GET /api/storage/[key]` | جلسة + `storage-access.ts` |

**لا رفع جديد إلى `public/`** — راجع `docs/security-permissions-matrix.md`

### حماية IDOR

- `/api/network/*` — `creatorId`/`sponsorId` يجب أن يطابق الجلسة
- Intelligence / recommendations — ملكية campaign/creator
- Dashboard actions — استعلامات مقيّدة بـ `creatorId`

### Cron

`CRON_SECRET` على: compute-scores · compute-trust-scores · compute-streaks

---

## 6. الصفحة الرئيسية (Landing)

**الملف:** `src/app/page.tsx` — يجلب case study، stats، شعارات رعاة حقيقية.

### ترتيب الأقسام (16)

| # | القسم | مكوّن | حركة / بيانات |
|---|--------|--------|----------------|
| 1 | Nav | `LandingNav` | sticky، روابط #how-it-works #demo #pricing #faq |
| 2 | Hero | `LandingHero` | Aurora CSS، جزيئات Spark، JourneyAutoplay |
| 3 | Network | `SparkNetworkStrip` | أرقام حية متحركة |
| 4 | Trust | `LandingTrustStats` | حملات نشطة، Spark، استردادات أسبوع |
| 5 | Journey | `LandingSparkJourney` | 4 خطوات + scroll reveal |
| 6 | شعارات | `LandingLogoStrip` | marquee رعاة موثّقين من DB |
| 7 | Case study | `LandingLiveCaseStudy` | حملة حقيقية + ROI + QR |
| 8 | Demo | `LandingRedemptionDemo` | iframe `/c/{code}?demo=1` |
| 9–10 | Benefits | Sponsor + Creator | i18n + hover |
| 11 | Why | `HowItWorksSteps` | 3 بطاقات تفاعلية |
| 12 | Testimonials | `LandingTestimonials` | i18n |
| 13 | Pricing | `LandingTierShowcase` | BASIC / PRO / EMPIRE |
| 14 | FAQ | `LandingFaq` | accordion متحرك |
| 15 | CTA | `LandingFinalCta` | shimmer ذهبي |
| 16 | Footer | `LandingFooter` | روابط قانونية |

### بنية الحركة

- `LandingScrollReveal` — `useInView` عند التمرير
- `LandingAurora` + `@keyframes aurora-drift-*`
- `LandingSparkParticles` — Framer Motion
- `useReducedMotion` محترم في كل المسارات الحرجة

### بيانات Landing

- `getFeaturedCaseStudy()` — override من admin أو خوارزمية
- `getLandingStats()` — حملات، Spark، استردادات أسبوع
- `getLandingSponsorLogos()` — رعاة verified مع حملات ACTIVE

---

## 7. بوابة الصانع (Creator)

### المحفظة (Fintech UX)

- `WalletTopUpStepper` — package → ShamCash → proof → submit
- `format-transaction.ts` — عناوين غنية (ShamCash، حملة، وقت نسبي)
- `uploadTopUpProof` → تخزين خاص + retry UX عند الفشل
- Admin يوافق من `/admin/wallet` مع معاينة الصورة

### الحملات

- `CampaignWizard` — 5 خطوات، Input/Checkbox/SegmentedControl موحّدة
- Campaign OS: analytics، live، fraud، participants، assets، settings
- Collaborators + tiers (BASIC / PRO / EMPIRE)
- امتلاء جوائز 100% → `ENDED` + إشعار راعٍ/صانع + إزالة من homepage

### Dashboard

- `BusinessDashboard` — KPI، live stream، insights، جدول حملات
- `/dashboard/command` — Command Center (particles، خريطة)

---

## 8. بوابة الراعي (Sponsor)

- نظرة عامة: حملات نشطة، استردادات، trust badge
- **Leads:** جدول استردادات مع فلاتر
- **ROI:** `getSponsorRoi` + SLA — تتبع أول زيارة في `AuditLog` (`sponsor.roi_viewed`)
- **Marketplace:** اكتشاف صناع، طلبات collab
- verify badge عبر `/admin/trust`

---

## 9. رحلة المستهلك (Redeem)

```
/c/[code] أو /redeem
  → landing → code → validating → claim → reveal
```

- `RedeemFlow` — 5 مراحل مع Framer Motion
- `ClaimForm` / `CodeEntryFocus` — مكوّنات UI موحّدة
- anti-abuse: هاتف/IP · تقييد مدينة
- verification photo → تخزين خاص
- `?demo=1` — معاينة بدون كتابة DB (Landing iframe)
- Rate limit على المسارات العامة

---

## 10. السوق والتعاون (Marketplace)

- `/marketplace` — صناع مع listings عامة
- `/marketplace/discover` — حملات للاكتشاف
- `CollabRequest` — sponsor يطلب تعاونًا → إشعار للصانع
- Spark Network APIs: sponsors / creators / template recommendations

---

## 11. مركز التحكم (Admin)

**`AdminShell`** — تنقل جانبي موحّد:

| الشاشة | القدرات |
|--------|---------|
| `/admin` | إحصاءات، fraud، activity |
| `/admin/wallet` | approve/reject + **proof preview** |
| `/admin/settings` | sparkUnit، حدود، ShamCash |
| `/admin/homepage` | featuredCampaignId، heroCampaignId |
| `/admin/trust` | verify creators/sponsors |
| `/admin/beta` | TTF campaign/redemption/top-up، retention، CSV |

كل إجراء حرج → `AuditLog` (راجع `docs/ops-playbooks.md`)

---

## 12. الوكالة (Agency)

- نموذج `Agency` + `AgencyMember` مع حدود إنفاق
- `/agency/dashboard` — minimal (بطاقات أعضاء)
- **فجوة:** لا portal كامل مقارنة بصانع/راعٍ

---

## 13. الذكاء والتحليلات

### `src/lib/analytics.ts`

قمع زيارات → إرسال كود → استرداد · مقاييس ساعية · مدن · أجهزة

### `src/lib/intelligence/`

spark-score · fraud · graph · recommendations · trust-score · streaks

### حي (Live)

`publishRedemption` → Redis → `GET /api/live/redemptions` (SSE)

### Cron

حساب درجات · trust · streaks — محمي بـ `CRON_SECRET`

---

## 14. واجهات API (18)

| المسار | الغرض |
|--------|--------|
| `/api/auth/[...nextauth]` | NextAuth |
| `/api/storage/[key]` | إثباتات خاصة |
| `/api/track` | أحداث حملة |
| `/api/live/redemptions` | SSE |
| `/api/notifications` | إشعارات |
| `/api/network/sponsors` | توصيات (creator) |
| `/api/network/creators` | توصيات (sponsor) |
| `/api/network/template` | قالب حملة |
| `/api/recommendations/[id]` | توصية صانع |
| `/api/intelligence/creator/[id]` | رؤى |
| `/api/intelligence/campaign/[id]/insights` | رؤى حملة |
| `/api/campaigns/[id]/assets` | أصول |
| `/api/export/pdf` | PDF فائزين |
| `/api/qr/[code]` | QR PNG/SVG |
| `/api/cron/*` | 3 مهام دورية |
| `/api/internal/rate-limit` | rate limit داخلي |

---

## 15. نظام التصميم والحركة

### Tokens (`globals.css` + `tailwind.config.ts`)

void · surface · gold-1..4 · warm-white · glass · circuit grid · `pb-safe` · `text-gradient-gold`

### UI Primitives (36 في `src/components/ui/`)

Button · Input · GlassCard · CircuitCard · Tabs · Table · Badge · ConfirmDialog · EmptyState · SparkAmount · TierPicker · Typography · …

### Motion

`src/lib/motion/` — tokens، variants، presets  
`src/components/motion/` — PageEnter، StaggerGrid، CircuitWake  
Landing: aurora، marquee، cta-shimmer، scroll reveal

### مرجع حي

`/design-preview` — كل primitives

---

## 16. التدويل والمحتوى

- `LocaleProvider` + `ar.json` / `en.json`
- Landing + login + dashboard nav + FAQ + pricing: **i18n كامل**
- Cookie: `spark_locale`
- `next-intl` في package.json **غير مفعّل** (تدويل مخصّص)
- سياسة الخصوصية: TENEGTA Spark كمشغّل — **بدون إشارة لشركات خارجية**

---

## 17. برنامج Beta Readiness

### وثائق (`docs/`)

| الملف | الغرض |
|-------|--------|
| `beta-cohort-runbook.md` | 3–5 رعاة، 20–50 صانع، 200–500 استرداد |
| `beta-findings-template.md` | تقرير أسبوعي |
| `ops-playbooks.md` | proof، email، حذف حملة، امتلاء جوائز |
| `security-permissions-matrix.md` | اختبار صلاحيات يدوي |
| `perf-queries.md` | EXPLAIN ANALYZE، p95 < 500ms |
| `e2e-smoke-test.md` | مسار قبول E2E يدوي |
| `production-checklist.md` | قائمة إطلاق |
| `design-qa-checklist.md` | QA بصري 320–1440px |

### مقاييس (`/admin/beta`)

- Time to First Campaign / Redemption / Top-up Approved
- Creator Retention (≥2 حملات / 30 يوم)
- Sponsor ROI Visibility
- تصدير CSV أسبوعي

### Seeds

| الأمر | الاستخدام |
|-------|-----------|
| `npm run db:seed` | demo كامل (تطوير) |
| `npm run db:seed:minimal` | **إنتاج:** admin + rates فقط |
| `npm run db:seed:volume` | 100 حملة / 1050+ استرداد (staging) |

### بوابة خروج Beta

≥3 رعاة دورة كاملة · ≥10 صناع حملة ثانية · صفر تسريب proof · p95 dashboard < 500ms

---

## 18. الجاهزية للإنتاج

| البند | الحالة |
|-------|--------|
| `robots.txt` | ✅ يحجب dashboard/admin/api |
| `sitemap.ts` | ✅ حملات + صناع نشطون |
| `email.ts` (Resend) | ⚠️ اختياري — in-app fallback |
| `instrumentation.ts` (Sentry) | ⚠️ stub — الحزمة غير مثبتة |
| `blob-storage` S3 upload | ✅ عند `STORAGE_*` |
| S3 **قراءة** في `/api/storage` | ❌ local فقط حالياً |
| `scripts/backup-db.sh` | ✅ موثّق |
| Rate limit إنتاج | يتطلب Redis |

---

## 19. الاختبارات والأوامر

```bash
docker compose up -d          # Postgres + Redis
npm run dev                   # تطوير
npm run build                 # إنتاج (أوقف dev أولاً لتجنب EPERM على .next)
npm run test                  # Vitest — stats-utils، storage URLs
npm run test:smoke            # تحقق ملفات Beta
npm run db:seed:minimal       # إنتاج أولي
npm run db:seed:volume        # اختبار أداء staging
npm run db:studio             # Prisma Studio
```

### بيانات demo (`e2e-smoke-test.md`)

| الدور | الدخول | كلمة المرور |
|-------|--------|-------------|
| صانع | +963900000001 | demo1234 |
| admin | admin@tenegta.com | admin1234 |

---

## 20. تقييم الجاهزية والفجوات

### ما هو جاهز للـ Beta

- مسارات كاملة لكل دور (48 صفحة)
- Landing عالمية مع بيانات حية وأنيميشن
- محفظة ShamCash + proof خاص + admin review
- Sponsor ROI + leads + marketplace
- Admin Control Center + Beta metrics
- أمان تشغيلي أساسي + playbooks
- indexes أداء + volume seed

### فجوات قبل توسع تجاري

| # | الفجوة | الأولوية |
|---|--------|----------|
| 1 | قراءة S3 في `/api/storage` عند الإنتاج | عالية |
| 2 | تثبيت Sentry + Resend في prod | عالية |
| 3 | E2E آلية (Playwright) | متوسطة |
| 4 | `production-checklist.md` — معظم البنود غير مؤشّرة | متوسطة |
| 5 | Agency portal محدود | منخفضة |
| 6 | PhysicalCard — schema فقط | منخفضة |
| 7 | `/marketplace/discover` في sitemap لكن يتطلب login | منخفضة |
| 8 | تغطية اختبارات ضئيلة (ملف واحد) | متوسطة |

### ما لن يُبنى أثناء Beta

Spark Network 2.0 / ML · Stripe/crypto · تطبيق native · ميزات Intelligence جديدة

---

## ملحق: تدفقات البيانات الرئيسية

### شحن Spark

```
TopUp stepper → requestTopUp → uploadTopUpProof (storage خاص)
  → Admin approve → walletBalance++ → Notification (+ email اختياري)
```

### حملة → استرداد

```
Wizard → createCampaign → QR → share /campaign/slug
  → Consumer /c/code → redeemCode → SSE live → Sponsor ROI
```

### امتلاء جوائز

```
prizeClaimed >= quantity → ENDED → notify → unfeature homepage → AuditLog
```

---

*نهاية التقرير — TENEGTA Spark Site Report · يونيو 2026*
