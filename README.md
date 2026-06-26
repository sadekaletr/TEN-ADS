# TENEGTA Spark — Showcase Product

منصة حوافز تسويقية لصناع المحتوى مع طبقة Intelligence وCommand Center حي.

## التشغيل السريع

```bash
docker compose up -d
npm install
npx prisma migrate dev
npm run db:seed
npm run dev
```

افتح [http://localhost:3000](http://localhost:3000)

## حسابات العرض الداخلي

| الدور | الدخول | كلمة المرور |
|-------|--------|-------------|
| صانع محتوى | `+963900000001` | `demo1234` |
| صانع بريميوم (verified) | `+963900000002` | `premium1234` |
| إدارة | `admin@tenegta.com` | `admin1234` |

## أكواد Hero Campaigns

| القالب | الكود | الغرض |
|--------|-------|-------|
| H1 Viral Burst | `SPARK-HERO-H1` | Live feed + Story spike |
| H2 Steady Local | `SPARK-HERO-H2` | Fraud graph + city map |
| H3 Premium | `SPARK-HERO-H3` | Spark Score + QR Portal |
| Demo | `SPARK-DEMO-CODE` | حملة تجريبية أساسية |

## مسار العرض v1 (Dashboard + Redeem)

1. **لوحة التحكم** — `/dashboard` — KPI strip + تيار حي + رؤى + جدول حملات
2. **Command Center** — `/dashboard/command` — Spark particles عند كل استرداد حي
3. **رحلة الاسترداد** — `/c/SPARK-HERO-H1` — Landing → كود → تحقق → بيانات → جائزة + مشاركة
4. **قسم المنتج** — `/#product-film` — فيديو وخطوات الاسترداد

### Design Hierarchy

- **Surface** — خلفية void gradient فقط (بدون circuit grid على body)
- **Content** — `SurfaceCard` مع elevation
- **Action** — CTA واحد primary لكل شاشة (`Button`)
- **Signal** — spark/motion في Live panel فقط

## Motion Showcase (45 ثانية)

1. **Login** — `/login` — Circuit Wake خفيف
2. **Dashboard** — `/dashboard` — Business Control Room
3. **Command Center** — `/dashboard/command` — Spark particle عند كل استرداد حي
4. **Redeem Journey** — `/c/SPARK-HERO-H1` — 4 مراحل + زر مشاركة

### لغة الحركة (TENEGTA Motion)

- **Spark Flow** — جسيم ذهبي: مستخدم → حملة → محفظة (`src/lib/spark-flow-events.ts`)
- **Gold Magnetic** — `MagneticCore` على CTAs والدوائر
- **Circuit Activation** — `CircuitWake` عند فتح الصفحات
- **Tokens** — `@/lib/motion` (timing موحّد لكل الأسطح)

## الطبقات الجديدة
- **Intelligence:** Participant graph, Spark Score, Fraud signals, توصيات حملات
- **Experience:** Command Center, QR Portal, Reward Reveal cinematic
- **Live:** SSE `/api/live/redemptions` مع fallback polling

## Cron (اختياري)

```bash
curl -X POST http://localhost:3000/api/cron/compute-scores \
  -H "x-cron-secret: dev-cron-secret"
```

يحسب Spark Scores ويجمع `CampaignMetricHourly`.
