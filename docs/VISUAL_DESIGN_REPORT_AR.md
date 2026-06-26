# TENEGTA Spark — التقرير البصري الشامل للواجهات

**الغرض:** مرجع بصري يصف **شكل كل واجهة** في الموقع بالتفصيل، بحيث يفهم القارئ التصميم الكامل (التخطيط، الألوان، الخطوط، المكوّنات، الحركة، السلوك على الجوال) **دون الحاجة لرؤية الشاشة**.

**الإصدار:** 1.0 · يونيو 2026
**المصدر:** مستخرج مباشرة من الكود الفعلي (`src/app`, `src/components`, `globals.css`, `tokens.ts`, `tailwind.config.ts`).

---

## فهرس المحتويات

1. [الهوية البصرية ونظام التصميم](#1-الهوية-البصرية-ونظام-التصميم)
2. [مكتبة المكوّنات الأساسية (UI Primitives)](#2-مكتبة-المكوّنات-الأساسية)
3. [الصفحة الرئيسية (Landing)](#3-الصفحة-الرئيسية-landing)
4. [رحلة الاسترداد (Consumer)](#4-رحلة-الاسترداد)
5. [الصفحات العامة](#5-الصفحات-العامة)
6. [شاشات تسجيل الدخول](#6-شاشات-تسجيل-الدخول)
7. [بوابة الصانع (Dashboard)](#7-بوابة-الصانع)
8. [بوابة الراعي (Sponsor)](#8-بوابة-الراعي)
9. [مركز التحكم (Admin)](#9-مركز-التحكم)
10. [الوكالة والذكاء](#10-الوكالة-والذكاء)
11. [الصفحات القانونية ومعاينة التصميم](#11-الصفحات-القانونية-ومعاينة-التصميم)
12. [ملخص السلوك المتجاوب (Responsive)](#12-ملخص-السلوك-المتجاوب)

---

## 1. الهوية البصرية ونظام التصميم

### اللغة البصرية العامة

TENEGTA Spark يعتمد جمالية **"ذهب فاخر على عتمة"** — خلفية سوداء شبه مطلقة مع لمسات ذهبية معدنية، تأثيرات زجاجية (glassmorphism)، وشبكة "دوائر كهربائية" (circuit grid) خفيفة. الإحساس العام: منصة تقنية راقية، هادئة بصرياً، مع توهجات ذهبية تجذب العين نحو نقاط الفعل (CTA).

- **الاتجاه:** RTL افتراضياً (عربي)، مع دعم LTR للإنجليزية. التموضع يستخدم `start`/`end` بدل `left`/`right`.
- **المزاج:** داكن دائماً (`color-scheme: dark`)، لا يوجد وضع فاتح.

### لوحة الألوان (Palette)

| المجموعة | المتغير | القيمة | الاستخدام |
|----------|---------|--------|-----------|
| **العتمة** | void | `#030304` | الخلفية الأساسية للموقع كله |
| | surface | `#0f0e0a` | أسطح البطاقات الأساسية |
| | surface-2 | `#16140f` | حقول الإدخال، الأسطح الثانوية |
| | surface-elevated | `rgba(22,20,15,0.92)` | القوائم المنسدلة والطبقات العائمة |
| **الذهب** | gold-1 | `#f0c97a` | أفتح درجة — العناوين والقيم |
| | gold-2 | `#d4a855` | اللون التفاعلي الأساسي (أزرار، حدود نشطة) |
| | gold-3 | `#c8953a` | درجة متوسطة |
| | gold-4 | `#9a6e20` | أغمق درجة — الحدود الخفيفة |
| **النص** | warm-white | `#f5f0e8` | النص الأساسي (أبيض دافئ) |
| | dim | `#b8aea0` | النص الثانوي |
| | dimmer / text-tertiary | `#7a7268` | النص الثالثي/التلميحات |
| **دلالي** | success | `#5dca6e` | نجاح |
| | warning | `#e8b84a` | تحذير |
| | danger | `#e24b4a` | خطأ/خطر |
| | info | `#6eb5e8` | معلومة |
| | destructive | `#993556` | إجراءات تدميرية |

**التدرج الذهبي للأزرار:** `linear-gradient(135deg, #f0c97a 0%, #d4a855 50%, #c8953a 100%)` مع نص داكن `#1a1408`.

**خلفية الموقع (void gradient):** `radial-gradient(ellipse at top, #16140f 0%, #030304 70%)` — توهج خافت في الأعلى يتلاشى لأسود.

### الحدود والزوايا والظلال

- **الحدود:** ذهبية شفافة بدرجات — خفيفة `rgba(212,168,85,0.18)`، افتراضية `0.28`، قوية `0.45`، spotlight `0.55`.
- **الزوايا:** `sm 0.5rem` · `md 0.75rem` · `lg 1rem` · `xl 1.25rem` · البطاقات الزجاجية `rounded-2xl`.
- **الظلال:**
  - بطاقة: `0 4px 16px rgba(0,0,0,0.45)` + إضاءة داخلية علوية.
  - مميزة: حلقة ذهبية + توهج `0 0 40px rgba(212,168,85,0.12)`.
  - زر: `0 4px 16px rgba(212,168,85,0.35)` + لمعة داخلية.
  - توهج CTA: `0 0 48px rgba(212,168,85,0.35)`.

### الزجاجية (Glassmorphism)

`GlassCard` هي اللبنة البصرية الأهم:
- خلفية متدرجة: `linear-gradient(135deg, rgba(212,168,85,0.08) 0%, rgba(15,14,10,0.96) 60%)`
- ضبابية: `backdrop-blur-md`
- حد ذهبي شفاف + ظل + إضاءة علوية داخلية
- النسخة المميزة (`featured`): تركيز ذهبي 16% + حلقة وتوهج.

### شبكة الدوائر (Circuit Grid)

نمط خلفية يميّز الهوية: خطوط أفقية وعمودية متكررة `rgba(212,168,85,0.08)` كل 48px (أو 60px في بعض الصفحات بشفافية `0.04`). أحياناً تُكمَّل بـ"وصلات" نقطية ذهبية تنبض. تظهر بقوة في **Command Center** و**لوحة Admin** و**شاشات الدخول**، وبخفوت في باقي الصفحات.

### الخطوط (Typography)

| الخط | المتغير | الاستخدام |
|------|---------|-----------|
| Noto Naskh Arabic | `font-arabic` | النص العربي الأساسي |
| Syne | `font-brand` | العناوين الكبيرة والشعار |
| Space Mono | `font-mono` | الأرقام، الأكواد، الإحصائيات (tabular) |

سلّم الأحجام: العنوان البطولي `clamp(2.5rem,5vw,4rem)` · H1 `text-3xl md:text-4xl` · عنوان قسم `text-3xl` · عنوان بطاقة `text-xl` · نص `text-base leading-[1.65]`.

**تأثير خاص:** `text-gradient-gold` — نص بتدرج ذهبي (`#f0c97a → #d4a855 → #c8953a`) عبر `background-clip: text`، يُستخدم للكلمات المميزة في العناوين.

### الحركة (Motion)

- **المدد:** فوري 120ms · سريع 220ms · عادي 400ms · بطيء 700ms.
- **منحنيات التوقيت:** `easeGold = cubic-bezier(0.16, 1, 0.3, 1)` (انسياب ناعم) · `easeSnap = cubic-bezier(0.34, 1.2, 0.64, 1)` (ارتداد خفيف).
- **التفاعل الافتراضي:** الأزرار `scale(1.02)` عند hover و`scale(0.98)` عند الضغط (Framer Motion spring).
- **احترام `prefers-reduced-motion`:** كل المسارات الحرجة (RewardReveal, particles, aurora, circuit) تتخطّى الحركة عند تفعيل الإعداد.

### الأيقونات

مكتبة **Phosphor Icons** (الوزن العادي) عبر مكوّن `Icon`. أيقونة العلامة الخاصة `SparkIcon`: سداسي بتدرج ذهبي `#f0c97a→#d4a855→#9a6e20` مع ماسة مركزية داكنة `#1a1408`.

---

## 2. مكتبة المكوّنات الأساسية

هذه اللبنات تتكرر في كل الواجهات، وفهمها يفسّر 80% من المظهر.

### Button (الزر)

أساس: `inline-flex border font-medium transition-colors` + حلقة تركيز ذهبية.

| النوع | المظهر |
|-------|--------|
| **primary** | تدرج ذهبي كامل، نص داكن `#1a1408`، ظل ذهبي، `hover:brightness-110` |
| **secondary** | شفاف، حد `gold-4/40`، نص `gold-1`، عند hover حد `gold-2` + خلفية `gold-2/10` |
| **ghost** | بلا حد، نص `dim` يتحول لـ`warm-white` عند hover |
| **destructive** | حد `destructive/50` + خلفية `destructive/20` |

الأحجام: `sm` (px-3 py-1.5 نص xs) · `md` (px-4 py-2.5 نص sm) · `lg` (px-6 py-3 نص base). على الجوال هدف اللمس `min-h-11` (44px).

### MagneticPrimaryCTA

زر أساسي "مغناطيسي" للنقاط الحرجة: نفس التدرج الذهبي + توهج CTA إضافي (`0 0 48px`)، يميل قليلاً نحو المؤشر عند الاقتراب (~12px). ارتفاع أدنى `3rem`.

### GlassCard (البطاقة الزجاجية)

`rounded-2xl backdrop-blur-md` مع 4 مستويات ارتفاع (elevation):
- **1** (افتراضي): تدرج ذهبي 8%.
- **2** (featured): تركيز 16% + حلقة + توهج 40px.
- **3**: سطح مرتفع معتم.
- النسخة `interactive` ترفع البطاقة `-translate-y-0.5` عند hover.

### StatusBadge (شارة الحالة)

كبسولة `rounded-full px-2.5 py-0.5 text-xs`:
- معلّق: `bg-warning-muted text-warning`
- موافق/مباشر: `bg-success-muted text-success`
- مرفوض: `bg-danger-muted text-danger`
- منتهٍ: `bg-surface-2 text-dim`

### EnergyRing (حلقة الطاقة)

حلقة SVG دائرية (64px، سماكة 6) تدور `-90°`، مسار خلفي `rgba(212,168,85,0.1)`، ولون التقدم يتغير: ذهبي عادةً، أصفر عند ≥85%، أحمر عند ≥100%. في المنتصف نسبة `font-mono text-xs`. تتحرك بسلاسة 400ms.

### TrustScoreRing (حلقة الثقة)

حلقة دائرية تعرض درجة الثقة بأحجام (small 72px / default 100px / large 140px)، تدرج `#9a6e20→#f0c97a`، مع رسم سينمائي للحلقة وتوهج `box-shadow` ذهبي بعد اكتمالها.

### ConversionRail (شريط مراحل التحويل)

مؤشر خطوات أفقي (يُستخدم في رحلة الاسترداد): دوائر `h-7 w-7` موصولة بخطوط:
- نشط: `bg-gold-2` نص داكن + توهج CTA.
- مكتمل: `bg-gold-2/30 text-gold-1` + ✓.
- قادم: حد افتراضي + `bg-surface-2`.

### DataDepthCard / SparkPulseCard / CommandKPICluster

بطاقات عرض الأرقام (KPI):
- **DataDepthCard:** بطاقة مركزية بأيقونة 32px، قيمة ضخمة `font-brand text-gold-1` (حتى `text-5xl` في النسخة المميزة) مع spotlight علوي.
- **SparkPulseCard:** بطاقة زجاجية صغيرة، تسمية `text-xs` + قيمة `font-mono text-2xl text-gold-1`، مع توهج نابض اختياري ومؤشر تغيّر (delta) أخضر/أحمر.
- **CommandKPICluster:** بطاقة بطولية كبيرة (`text-4xl/5xl`) + شبكة KPI ثانوية أصغر، تدخل بـfade متدرج.

### SmartFileDropzone (منطقة رفع الملفات)

مستطيل بحد متقطّع `border-2 border-dashed` بارتفاع 120px+:
- خامل: حد افتراضي، عند hover يقوى.
- سحب فوقه: `border-gold-2 bg-gold-2/10`.
- محدّد: `border-strong bg-gold-2/5` مع معاينة `max-h-48 object-cover`.
- خطأ: `border-danger/50 bg-danger-muted`.

### CopyableField (حقل قابل للنسخ)

قيمة `font-mono text-lg text-gold-1` بمحاذاة LTR + زر "نسخ" ثانوي يتبدّل إلى "تم النسخ". يُستخدم لأرقام ShamCash والأكواد.

### StickyActionBar (شريط الإجراء اللاصق)

على الجوال فقط (`md:hidden`): شريط ثابت أسفل الشاشة `fixed inset-x-0 bottom-0`، خلفية `bg-void/95 backdrop-blur-md` + حد علوي ذهبي، يحترم `safe-area-inset-bottom`، يحوي زراً `fullWidth min-h-12`. يضمن بقاء زر الفعل الأساسي في متناول الإبهام.

### مكوّنات بطاقات أخرى

- **CircuitCard:** مثل GlassCard لكن `rounded-lg` — تُستخدم كثيراً في Admin والصفحات العامة.
- **AnimatedCircuitCard:** بطاقة تدخل بـscale-in وتتوهج عند hover (`rgba(212,168,85,0.12)`) — مميزة لصفحات الحملة.

---

## 3. الصفحة الرئيسية (Landing)

الملف `src/app/page.tsx` — عمود واحد RTL داخل `CircuitPageBackground`، بعرض أقصى `72rem`، الأقسام مفصولة بحشوة `5rem`. الترتيب: Hero → TrustStats → NetworkBar → LogoStrip → HowItWorks → SparkJourney → RedemptionDemo → LiveCaseStudy → Benefits → Testimonials → Pricing → FAQ → FinalCTA → Footer.

### 3.1 شريط التنقل (LandingNav)

شريط لاصق أعلى الصفحة `sticky top-0 z-50`، خلفية شفافة `bg-void/80 backdrop-blur-md` + حد سفلي ذهبي خفيف. يحوي:
- **يمين (RTL):** شعار TENEGTA (SVG 120×32، `opacity-90`).
- **روابط (desktop فقط):** "كيف يعمل"، "تجربة"، "الأسعار"، "الأسئلة" — `text-sm text-dim hover:text-gold-1`.
- **يسار:** مبدّل اللغة + زر "ابدأ الآن" (primary) + زر "للتجار" (secondary).
- **الجوال:** الروابط والأزرار تختفي، يظهر زر همبرغر يفتح **MobileNav**: طبقة `fixed inset-0 bg-void/80` مع لوحة منزلقة `rounded-2xl border bg-surface p-6` تحوي الروابط بحجم `text-lg` وأزرار CTA بعرض كامل.

### 3.2 القسم البطولي (Hero)

أطول قسم `min-h-[92vh]`، خلفية **spotlight** بيضاوية ذهبية في الأعلى `radial-gradient(ellipse 900px 520px at 50% -10%, rgba(212,168,85,0.22))`. تخطيط عمودين على الديسكتوب (`lg:grid-cols-2`):
- **العمود النصي:**
  - "Eyebrow": كبسولة `rounded-full border bg-surface-2/80` مع نقطة ذهبية نابضة.
  - عنوان ضخم `clamp(2.5rem,5vw,4rem)` بخط `font-brand`، مع كلمة مميزة بـ`text-gradient-gold`.
  - عنوان فرعي `text-lg text-text-secondary`.
  - ثلاثة أزرار CTA: زر مغناطيسي أساسي (أيقونة صاروخ) + "للتجار" (secondary، أيقونة متجر) + "تجربة الهدية" (ghost/secondary حسب تجربة A/B).
  - سطر ثقة صغير `text-xs text-text-tertiary` يظهر بتأخير.
- **العمود البصري:** بطاقة زجاجية تحوي **JourneyAutoplay** — عرض تلقائي لمراحل الرحلة (أيقونة Spark 56px تتحرك، مؤشرات نقطية أسفلها، زر إيقاف/تشغيل)، خلف البطاقة توهج ذهبي `blur-3xl`.
- **الدخول:** عناصر تتصاعد (opacity 0→1، y 16→0) بتأخيرات متتابعة 0/0.1/0.2/0.3s.

> ملاحظة: مكوّنا `LandingAurora` (بقع ضوء ذهبية ضبابية متحركة) و`LandingSparkParticles` (14 جزيء متطاير) موجودان في الكود لكن غير مستدعَيين حالياً؛ التأثير المماثل يأتي من spotlight الـHero وشبكة circuit.

### 3.3 إحصائيات الثقة (TrustStats)

قسم بخلفية `bg-surface/30`، عنوان `H2 text-gold-1` متوسّط + سطر "حداثة البيانات" صغير. شبكة `md:grid-cols-3` من **DataDepthCard** (الأعلى قيمة مميزة elevation 4، الباقي elevation 2)، تظهر بـscroll-reveal متدرج. المقاييس: حملات نشطة، Spark موزّع، استردادات الأسبوع — أرقام حقيقية من قاعدة البيانات.

### 3.4 شريط الشبكة (NetworkBar)

شريط أفقي `border-y bg-surface/50 backdrop-blur-sm` يعرض أرقاماً متحركة (`AnimatedNumber font-mono text-2xl text-gold-1`) مع تسميات `text-dim`، متمركزة وملتفّة.

### 3.5 شريط الشعارات (LogoStrip)

عنوان "موثوق به من" + **marquee** أفقي لا نهائي (40s) لشعارات الرعاة الموثّقين من قاعدة البيانات، يتوقف عند hover، مع تلاشي حوافّ (`mask-fade-x`). كل شعار في بطاقة `rounded-xl border bg-surface-2/50` (لوغو 32×32 أو دائرة حرف أول احتياطية).

### 3.6 كيف يعمل (HowItWorksSteps)

شبكة `md:grid-cols-3` من بطاقات زجاجية تفاعلية متمركزة، كل واحدة: أيقونة 40px ذهبية + عنوان `font-brand text-gold-1` + وصف. ترتفع `y: -8` عند hover.

### 3.7 رحلة الشرارة (SparkJourney)

قسم بخلفية توهج شعاعي سفلي. شبكة `lg:grid-cols-4` من بطاقات زجاجية: رقم `font-mono`، أيقونة ذهبية تتأرجح، عنوان، وصف. على الديسكتوب توصل البطاقات خطوط أفقية ذهبية متلاشية تحاكي "مسار الطاقة".

### 3.8 العرض التجريبي (RedemptionDemo)

قسم "تجربة" به زر يفتح **iframe** لرحلة استرداد حقيقية بوضع `?demo=1` (بلا كتابة على قاعدة البيانات). الإطار `rounded-2xl border` بظل عميق ثلاثي الطبقات يوحي بالعمق، بارتفاع `min(560px,70vh)`.

### 3.9 دراسة الحالة الحية (LiveCaseStudy)

بطاقة زجاجية مميزة بعمودين: يسار بيانات حملة حقيقية (eyebrow + عنوان + handle)، يمين شبكة إحصائيات `grid-cols-2 sm:grid-cols-4` (كل خلية قيمة `font-mono text-gold-1` ترتفع عند hover) + رمز QR في مربع أبيض ينبض بتوهج ذهبي.

### 3.10 المزايا (Sponsor + Creator Benefits)

عمودان `lg:grid-cols-2`: قائمة مزايا للراعي وأخرى للصانع. كل عنصر صف `rounded-lg border bg-surface-2/30` بأيقونة ذهبية، ينزلق `x: 4` ويتوهج حده عند hover، يتبعه زر CTA.

### 3.11 الشهادات (Testimonials)

شبكة `md:grid-cols-3` بطاقات زجاجية: اقتباس `text-warm-white` + اسم `font-mono text-gold-2`، ترتفع عند hover.

### 3.12 الأسعار (TierShowcase)

`id="pricing"` — ثلاث باقات (BASIC / PRO / EMPIRE) عبر `TierPicker` بشبكة `md:grid-cols-3`. الباقة الوسطى (PRO) مميزة (`featured`) بشارة "الأكثر شعبية" (`bg-gold-2 text-void`). كل بطاقة: أيقونة Spark + سعر `font-mono text-2xl`، قائمة مزايا بعلامات ✓ (مضمّنة `text-warm-white`) أو 🔒 (غير مضمّنة `text-dimmer`)، وزر CTA بعرض كامل.

### 3.13 الأسئلة الشائعة (FAQ)

`id="faq"` بخلفية `surface`. حاوية `max-w-2xl` من بطاقات أكورديون: زر السؤال `font-medium` + سهم يدور 180° عند الفتح، والجواب ينفتح بحركة ارتفاع 0→auto (300ms).

### 3.14 نداء الفعل النهائي (FinalCTA)

بطاقة **ذهبية صريحة** (عكس باقي الموقع): تدرج `#f0c97a → #d4a855 → #c8953a → #f0c97a` مع لمعان متحرك (`shimmer` 6s) وظل ذهبي عميق. النص داكن `#1a1408`، عنوان `text-3xl md:text-4xl`، وزرّان: ثانوي بخلفية داكنة `bg-void/90` + ghost. ترتفع البطاقة قليلاً عند hover.

### 3.15 التذييل (Footer)

`SiteLegalFooter`: حد علوي ذهبي خفيف، خلفية `bg-void/80`، روابط قانونية متمركزة `text-xs text-dim hover:text-gold-1` مفصولة بفواصل ذهبية، وحقوق النشر `text-dimmer`.

---

## 4. رحلة الاسترداد

تجربة **موبايل-أولاً** بامتياز (`max-w-md`, `min-h-dvh`, `redeem-safe`)، تتدفّق عبر مراحل متحركة. الشعار 140×36 أعلى الصفحة.

### 4.1 إدخال الكود اليدوي (`/redeem`)

عمود متمركز `max-w-md`: مبدّل اللغة أعلى اليمين، شعار، ثم بطاقة زجاجية بعنوان ووصف، وحقل إدخال مميّز `py-4 text-center font-mono tracking-widest` بـplaceholder `SPARK-XXXX-XXXX`، وزر primary بعرض كامل (معطّل حتى إدخال كود). وضع `?demo=1` يضيف شريطاً علوياً "معاينة تجريبية".

### 4.2 الرحلة الكاملة (`/c/[code]` — RedeemFlow)

أعلى الشاشة **ConversionRail** بأربع خطوات (ترحيب/تحقق/استلام/جائزة). المراحل:

1. **الترحيب:** نص "أهلاً بك" + عنوان الحملة `text-2xl` + اسم الصانع ذهبي + **DataDepthCard مميزة** تعرض قيمة الجائزة بحجم ضخم `font-brand text-4xl/5xl` مع spotlight. زر المتابعة على الجوال يظهر في **StickyActionBar** أسفل الشاشة.
2. **معاينة الجائزة:** صورة الجائزة `h-40 rounded-xl` أو أيقونة هدية دائرية، اسم الراعي + الجائزة، زر "Claim".
3. **مقدمة الصانع:** avatar دائري (أو حرف أول)، "رسالة من" + الاسم، فيديو ترويجي اختياري، زر متابعة.
4. **إدخال الكود:** حقل `font-mono tracking-widest text-gold-1` متمركز، رسالة خطأ `text-gold-3`، زر تحقق.
5. **التحقق:** شريط تقدم `h-1 w-48` مع عنصر نبضة ذهبية متحرك (`validation-pulse` 1.4s)، نص "جاري التحقق…"، تأخير ~1200ms.
6. **نموذج الاستلام (ClaimForm):** عنوان قسم بخط `font-brand text-3xl`، حقول إدخال، **TrustProofUploader** (بطاقة `bg-surface-stack` بأيقونة قفل ونص تشفير لرفع صورة التحقق)، Checkbox موافقة بروابط قانونية، زر "تأكيد الاستلام" (معطّل بلا موافقة).
7. **كشف الجائزة (RewardReveal):** **حركة سينمائية** من 4 مراحل — تعتيم (600ms) → بوابة دائرية ذهبية تتمدد scale 0→12 مع اسم الجائزة (1800ms) → انفجار ضوئي → بطاقة نتيجة مميزة بحلقة ذهبية. تعرض "تم الاستلام بنجاح" + الجائزة + رقم مرجعي `font-mono` + أزرار مشاركة/حفظ.
8. **الإيصال (RedemptionReceipt):** بطاقة زجاجية متمركزة، أيقونة هدية، رقم مرجعي `font-mono text-2xl`، رمز QR في مربع أبيض، أزرار "حفظ PNG" و"طباعة".

**حالة الخطأ:** `EmptyState` بحد متقطّع وأيقونة ذهبية + زر "حاول مجدداً".

---

## 5. الصفحات العامة

### 5.1 صفحة الحملة العامة (`/campaign/[slug]`)

موبايل-أولاً `max-w-lg`. شعار متمركز، ثم ميديا (فيديو/صورة `aspect-video`)، شعار الراعي دائري، شارة "موثّق" (`SponsorVerifiedBadge`)، شارة "حملة محترفة" للباقة PRO، عنوان `text-2xl`، الجائزة `text-lg text-gold-1`، شارة أداء (`CampaignPerformanceBadge` خضراء ≥70% وإلا ذهبية)، وزرّان: "استلم جائزتك الآن" (primary) و"لديّ كود آخر" (secondary → `/redeem`).

### 5.2 ملف الصانع العام (`/creator/[handle]`)

خلفية `CircuitPageBackground`، حاوية `max-w-2xl`. بطاقة هوية زجاجية: avatar دائري، اسم `text-xl`، handle `font-mono text-gold-2`، شارة توثيق، **TrustScoreRing** (100px) + Spark Score، وشبكة KPI ثلاثية. تبويبات أفقية (نشطة `border-b-2 border-gold-2`): الحملات النشطة (بطاقات بروابط)، السابقة (**CampaignWall** شبكة `grid-cols-3 sm:grid-cols-4` بأيقونات Spark)، الشركاء (شعارات دائرية). أسفلها نموذج طلب تعاون + زر واتساب بعرض كامل.

### 5.3 متجر الراعي (`/shop/[sponsorId]`)

خلفية افتراضية (بلا circuit). `max-w-2xl`. بطاقة راعٍ (CircuitCard): **TrustScoreRing كبيرة** (140px، نص `text-5xl`)، اسم `text-2xl text-gold-1`، مدينة، جوائز موزّعة `font-mono`، شارة Streak. تتبعها قائمة حملات الراعي ببطاقات CircuitCard (عنوان + جائزة `text-gold-3` + تقدم).

### 5.4 لوحة ترتيب الرعاة (`/leaderboard/sponsors/[city]`)

خلفية circuit، `max-w-lg`. عنوان `font-brand text-2xl` "الأنشط في {المدينة}". قائمة مرتّبة بـStreak الأسبوعي؛ المراكز الثلاثة الأولى بحدود مميّزة متدرجة (الأول `border-gold-1/70` + توهج، الثاني gold-2، الثالث gold-3) وحشوة أكبر، مع رقم ضخم خلفي شبه شفّاف `text-4xl text-gold-4/10`، وأيقونة لهب تنبض (`animate-junction-pulse`) عند Streak ≥4 أسابيع.

---

## 6. شاشات تسجيل الدخول

أربع شاشات بدرجات تفصيل مختلفة، كلها `max-w-md` متمركزة:

| الشاشة | المميزات البصرية |
|--------|------------------|
| **`/login` (صانع)** | الأغنى — خلفية `CircuitWake` (شبكة + خطوط SVG ذهبية ترتسم بـ700ms)، دخول `PageEnter` متدرج، شعار + اسم العلامة `font-brand text-2xl text-gold-1`، نموذج داخل `AnimatedCircuitCard`، حقل هاتف `font-mono` (`+963900000001`)، زر داخل `MagneticCore` (مغناطيسي). مبدّل لغة أعلى. |
| **`/sponsor/login`** | أبسط — CircuitCard مباشرة بعنوان `text-lg text-gold-1`، حقول email/password، زر loading. بلا circuit متحرك. |
| **`/admin/login`** | مشابه للراعي مع عنوان `font-brand text-2xl text-gold-1` فوق البطاقة. |
| **`/agency/login`** | الأبسط بصرياً — CircuitCard فقط، حقول native خام (بلا مكوّن Input)، زر بحد ذهبي بسيط (بلا تدرج)، بلا شعار ولا مبدّل لغة. |

---

## 7. بوابة الصانع

### 7.1 الهيكل العام (Dashboard Shell)

**لا يوجد sidebar رئيسي** — التنقل عبر **شريط علوي أفقي** (`DashboardNav`): خلفية `bg-surface/80 backdrop-blur` + حد سفلي ذهبي. يحوي اسم العلامة `font-brand text-gold-1` + اسم الصانع، ويميناً مبدّل اللغة + جرس الإشعارات + رصيد المحفظة `font-mono text-gold-1` + أزرار محفظة/شحن + خروج. تحته **تبويبات أفقية قابلة للتمرير** (5 روابط: Dashboard, Campaigns, Command Center, Collab Requests, Marketplace Listing) — النشط `border-b-2 border-gold-2 text-gold-1`. المحتوى `max-w-6xl mx-auto px-4 py-8 pb-safe`. شبكة circuit المتحركة (`CircuitWake strong`) تظهر **فقط** في Command Center.

### 7.2 اللوحة الرئيسية (`/dashboard`)

من أعلى لأسفل (`space-y-8`): رأس صفحة، شبكة KPI ثلاثية (`SparkPulseCard`: رصيد، حملات نشطة، تحويل — الأولى نابضة)، أزرار CTA، **WalletHeroCard** كبيرة (توهج ذهبي يتنفّس `blur-3xl` خلف أيقونة Spark 56px ورقم متحرك `text-5xl` + تحويل SYP + زر شحن)، **CreatorProgressBar** (شارات مستويات + شريط تقدم متدرج `from-gold-3 to-gold-1`)، ثم شبكة `lg:grid-cols-2`: يسار تدفق Spark الحي (`LiveSparkFlow`)، يمين بطاقات رؤى وتوصيات. وأخيراً جدول الحملات النشطة (داخل GlassCard، صفوف `hover:bg-gold-2/5`، عناوين تتحول ذهبية عند hover، شارات حالة) أو `EmptyState` بحد متقطّع.

### 7.3 مركز القيادة (`/dashboard/command`)

أكثر الشاشات "سينمائية": خلفية `CircuitWake strong` (شبكة + خطوط SVG ذهبية ترتسم). يحوي:
- عدّادات عامة (`GlobalCounters`) — ثلاثة أرقام spring `font-mono text-3xl text-gold-1` (استردادات اليوم، حملات نشطة، % تحويل) داخل `AnimatedCircuitCard`.
- شبكة `lg:grid-cols-2`: تدفق Spark الحي الكامل (حتى 12 عنصر، عناصر جديدة تدخل بـspring وتتوهج `border-gold-2/60`) + "Campaign Pulse" (دوائر مغناطيسية بحجم 48–112px حسب ROI تنبض).
- **خريطة سوريا الحية** (`CityMapLive`): SVG `aspect-[4/3]` بحدود ذهبية خافتة، نقاط مدن، ونبضات live (`motion.circle`) تتمدد scale 0→4 وتتلاشى عند كل استرداد.

### 7.4 المحفظة (`/dashboard/wallet`)

حاوية ضيقة `max-w-3xl`. **WalletBalanceHero** (GlassCard مميزة، `SparkAmount size="xl"` متمركز + ≈SYP + زر شحن بعرض كامل). ثم **تبويبات** "المعاملات"/"طلبات الشحن" (نشط `border-b-2 border-gold-2`). المعاملات قائمة `divide-y` (عنوان + مبلغ ذهبي موجب/أحمر سالب)، والطلبات قائمة معلّقة.

### 7.5 شحن المحفظة (`/dashboard/wallet/topup`)

معالج 5 خطوات (`max-w-5xl`):
- **WalletTopUpStepper:** نص تقدم + شريط `bg-gold-2` + كبسولات خطوات (منجز `bg-gold-2/20`، نشط `ring-1 ring-gold-2/50`، قادم باهت).
- **الخطوات:** اختيار الباقة (شبكة `sm:grid-cols-3` من `TopUpPackageCard`، المميزة بشارة "الأكثر طلباً"، المحدّدة `ring-2 scale-[1.02]`، رقم `font-brand text-5xl`) → السعر (بطاقة مركزية) → التحويل (**ProofConfidencePanel** بأيقونة قفل + `CopyableField` لرقم ShamCash + قائمة طمأنة ✓) → رفع الإثبات (صورة + حقل `font-mono` + خطأ أحمر) → تم (بطاقة نجاح `text-2xl text-gold-1` + خط زمني).
- على الجوال زر الإرسال ينتقل إلى **StickyActionBar** أسفل الشاشة.

### 7.6 معالج إنشاء الحملة (`/dashboard/campaigns/new`)

تخطيط عمودين `lg:grid-cols-2`: يسار النموذج، يمين **معاينة حية** على شكل **إطار هاتف** (`rounded-3xl border bg-[#050406] shadow-2xl`) تتحدّث فورياً. مسار breadcrumb أعلى.
- **الخطوة 0 (البداية):** بطاقة "Copilot" بعنوان `text-2xl text-gold-1` "اكتب جملة وخلص" + Textarea + زر كبير `py-4 text-lg`، تتبعها قوالب قابلة للطي.
- **الخطوات 1–5:** `TierPicker` (3 باقات) + **Stepper** بست شرائح `h-1` (منجز `bg-gold-2`). الخطوات: الراعي → الجائزة (`SegmentedControl` SHARED/UNIQUE) → القواعد (checkboxes + مدينة) → Co-Campaign (للـEMPIRE فقط: بحث `@handle` + نِسب) → المراجعة (ملخص + زر إطلاق محاط بـ`MagneticCore`).

### 7.7 نظام تشغيل الحملة (`/dashboard/campaigns/[id]/*`)

غلاف خاص (`CampaignOsShell`): **sidebar على الديسكتوب** (`lg:w-52 lg:sticky`) يتحول إلى **تبويبات أفقية قابلة للتمرير على الجوال**. عنوان الحملة + "Campaign OS" + زر "نسخ الرابط". ست تبويبات (نشط `bg-gold-2/15 text-gold-1` + خط جانبي `lg:border-s-2`): 

| التبويب | المحتوى البصري |
|---------|----------------|
| **Overview** | بطاقات `AnimatedCircuitCard`: معلومات الراعي/الجائزة، أكواد `font-mono tracking-[0.2em]` + نقاط، تقدم، QR، قصة الحملة، **FunnelChart** (أشرطة `bg-gold-2` بشفافية متناقصة)، توزيع مدن/أجهزة/أوقات ذروة |
| **Analytics** | شبكة 2×2: قمع، مدن، ذروة، أجهزة + لوحة إشارات احتيال |
| **Live** | بطاقة واحدة + `LiveSparkFlow` كامل |
| **Leads/Participants** | `RedemptionsTable` (معرض إثباتات مصغّرة + فلاتر + جدول) |
| **Assets** | استوديو أصول QR: شبكة `sm:grid-cols-2`، كل أصل بمعاينة `aspect-video` + رابط تحميل + زر ZIP |
| **Settings** | حالة + زر إيقاف/استئناف + تعديل كمية الجوائز + زر أرشفة |

> ملاحظة: `/fraud` يعيد التوجيه إلى `/analytics`.

### 7.8 الإشعارات وطلبات التعاون والقائمة

- **الجرس (NotificationBell):** زر مربّع `border-gold-4/25` بشارة عدد ذهبية، يفتح قائمة منسدلة `bg-surface-elevated` (عناصر غير مقروءة `bg-gold-2/5` بأيقونة ذهبية).
- **صندوق الإشعارات (`/dashboard/notifications`):** `max-w-2xl`، زر "تعليم الكل كمقروء"، إشعارات مجمّعة يومياً ببطاقات زجاجية (غير المقروءة `border-gold-2/30 bg-gold-2/5`).
- **طلبات التعاون (`/dashboard/requests`):** بطاقات بكل طلب (اسم الراعي + مدينة + رسالة + زرّا قبول/رفض).
- **قائمة Marketplace (`/dashboard/listing`):** `max-w-xl`، نموذج داخل GlassCard (نبذة Textarea + تصنيفات + Checkbox إظهار + زر حفظ).

---

## 8. بوابة الراعي

### 8.1 الهيكل العام

شريط علوي (`SponsorNav`) مطابق نمطياً لشريط الصانع: `bg-surface/80 backdrop-blur`، اسم العلامة + "راعٍ — {الاسم}"، مبدّل لغة + جرس + زر Marketplace + خروج، وتبويبات أفقية (نظرة عامة، الحملات، المستفيدون، العائد). خلفية تدرّج void فقط (بلا circuit). المحتوى `max-w-6xl`.

### 8.2 نظرة عامة (`/sponsor`)

رأس "بوابة الراعي". شبكة KPI `sm:grid-cols-2 lg:grid-cols-4` من بطاقات زجاجية متمركزة (رقم `text-3xl font-mono text-gold-1` + تسمية): حملات نشطة، جوائز موزّعة، مشاركون، إجمالي الحملات. تتبعها بطاقة "صناع مقترحون" (روابط ذهبية) عند توفّر بيانات.

### 8.3 الحملات (`/sponsor/campaigns`)

قائمة بطاقات زجاجية لكل حملة: يسار العنوان + `@handle` الصانع + إحصائيات؛ يمين **CampaignPerformanceBadge** (كبسولة `font-mono`؛ ≥70% خضراء `bg-green-500/15`، وإلا ذهبية) + شارة حالة + رابط Marketplace للحملات النشطة. تتكدّس عمودياً على الجوال.

### 8.4 المستفيدون (`/sponsor/leads`)

`SponsorLeadsTable` داخل GlassCard: جدول `overflow-x-auto min-w-[480px]` (الاسم `warm-white`، الحملة/المدينة `dim`، التاريخ `font-mono`). حالة فارغة `EmptyState` بحد متقطّع وأيقونة Spark.

### 8.5 العائد (`/sponsor/roi`)

بطاقة SLA متمركزة (قيمة `text-3xl font-mono` بالساعات + "متوسط الرد على طلبات التعاون"). ثم 3 `SparkPulseCard`. ثم بطاقة "حسب الحملة": كل صف باسم + أرقام `font-mono text-gold-2` + **شريط تقدم** (مسار `h-1.5 bg-surface-2` + تعبئة `#d4a855`، انتقال 400ms).

### 8.6 الإشعارات (`/sponsor/notifications`)

مطابق لصندوق إشعارات الصانع (تجميع يومي، بطاقات زجاجية، غير مقروء `border-gold-2/30`).

### 8.7 Marketplace (`/marketplace` و `/marketplace/discover`)

خلفية `CircuitPageBackground`، `max-w-4xl`. رأس "السوق" + تبويبات ("اكتشف الحملات"/"ابحث عن صناع"):
- **الحملات:** شبكة `sm:grid-cols-2` بطاقات زجاجية (عنوان + تفاصيل + جائزة `text-gold-1` + شارة راعٍ موثّق).
- **الصناع:** **فلاتر لاصقة** (`sticky top-0`، بطاقة `bg-surface-elevated/95 backdrop-blur`) — حقل مدينة دائري + كبسولات فلترة (`FilterPill` نشط `border-gold-2 bg-gold-2/15`). شبكة بطاقات (`SurfaceCard` ترتفع وتتوهج حدودها عند hover) بـ**TrustScoreRing** صغيرة + اسم `hover:text-gold-1` + handle `font-mono`.
- **`/discover`** نسخة عامة بـ`LandingNav` + زر "دخول الرعاة".

---

## 9. مركز التحكم (Admin)

### 9.1 الهيكل (AdminShell)

حاوية `max-w-5xl` بتخطيط `lg:flex-row`. **شريط جانبي** (`aside lg:w-48`): تسمية "Control Center"، روابط (نظرة عامة، المحفظة، الإعدادات، الصفحة الرئيسية، الثقة، Beta) — على الجوال تبويبات أفقية، على الديسكتوب عمودية، النشط `bg-gold-2/15 text-gold-1` + خط جانبي `lg:border-s-2 lg:border-gold-2`.

### 9.2 لوحة الإدارة (`/admin`)

الشاشة الوحيدة في Admin بخلفية متحركة (`CircuitWake light` + `PageEnter`). تحوي:
- رأس "لوحة الإدارة" + زر خروج ghost.
- KPI ثلاثية (`CircuitCard`): Spark متداول (`SparkBadge` + SYP)، حملات نشطة، إجمالي استردادات.
- بطاقة CTA "طلبات شحن معلّقة" + عدد + زر "مراجعة المحفظة".
- اختصارات (إعدادات/صفحة رئيسية/ثقة).
- **FraudSignalsPanel** ("Fraud Graph"): عناصر بحد ذهبي، سبب `text-gold-3`، hash `font-mono`، درجة خطر ≥70% بلون `destructive`.
- **AudienceInsightsPanel** + **ActivityFeed** (نشاط المنصة، صفوف بحد سفلي + وقت `text-xs`).

### 9.3 عمليات المحفظة (`/admin/wallet`)

رأس "عمليات المحفظة" + **تنبيه SLA** (إذا تجاوز طلب 4 ساعات: شريط `border-warning/40 bg-warning-muted text-warning`). كل طلب في `CircuitCard`: اسم + `StatusBadge` معلّق + handle/طريقة + `SparkBadge` + **معاينة صورة الإثبات** (`Image max-h-60 object-contain`) + زرّا موافقة (primary) / رفض (secondary يفتح `ConfirmDialog` بزر تدميري). فارغ: `EmptyState`.

### 9.4 الإعدادات (`/admin/settings` + `/transfer`)

نموذج ببطاقتين CircuitCard: ShamCash (حقول + Textarea) وسعر الصرف (حقول رقمية `font-mono`)، زر حفظ primary + رسالة "تم الحفظ" ذهبية. المسار الفرعي `/transfer` صفحة منفصلة أضيق (`max-w-lg`) بنموذج داخل GlassCard ورابط رجوع.

### 9.5 الصفحة الرئيسية (`/admin/homepage`)

`CircuitCard` بثلاث قوائم منسدلة (`Select`): قصة النجاح، حملة Hero، صانع مميز + زر حفظ.

### 9.6 الثقة (`/admin/trust`)

قسمان (صناع/رعاة): صفوف بحد سفلي، اسم + شارة "موثّق" ذهبية + handle + `SparkBadge` + زر "توثيق/إلغاء توثيق" ghost.

### 9.7 Beta Metrics (`/admin/beta`)

رأس "Beta Metrics" + زر "تصدير CSV". شبكة KPI `sm:grid-cols-2` (قيمة `text-2xl text-gold-1`). بطاقة "تفاصيل زمنية p90" بقائمة تعريف `dl grid` (مصطلح `text-dim` + قيمة `warm-white`). تذييل يشير لقالب التقرير الأسبوعي.

---

## 10. الوكالة والذكاء

### 10.1 لوحة الوكالة (`/agency/dashboard`)

خلفية circuit، `max-w-4xl`. عنوان الوكالة `font-brand text-2xl`. **KpiStrip** (`sm:grid-cols-3`، خلايا `surface-elevated backdrop-blur`، قيمة `font-mono text-2xl text-gold-1`). ثم بطاقات أعضاء (`AgencyMemberCard`): اسم + handle + **شريط إنفاق** (مسار `h-1.5` + تعبئة `gold-3`، تتحول لتحذير قرب الحد). أبسط من بوابتي الصانع/الراعي (فجوة مقصودة).

### 10.2 الخريطة الحرارية (`/intelligence/heatmap`)

تتطلب اشتراك Spark Intelligence (بلا اشتراك: بطاقة دعوة). مع اشتراك: عنوان "Spark Heatmap"، `SegmentedControl` للفترات، خريطة سوريا SVG (`SyriaHeatmapMap`) بمناطق تتلوّن حسب الكثافة `rgba(212,168,85, 0.15+intensity*0.55)` ونقاط نبض، إحصائية عائمة (`CountUpStat` بخلفية `bg-void/80 backdrop-blur`)، وقائمة محافظات بخلفية متدرجة حسب الكثافة.

---

## 11. الصفحات القانونية ومعاينة التصميم

### 11.1 الخصوصية والشروط (`/privacy`, `/terms`)

`LegalDocument` بعرض `max-w-2xl` داخل بطاقة زجاجية: عنوان `font-brand text-2xl text-gold-1`، تاريخ سريان، أقسام (h2 `text-lg warm-white` + نص `text-sm text-dim leading-relaxed`)، تذييل بحد علوي. يظهر `SiteLegalFooter` على كل الصفحات عدا الرئيسية.

### 11.2 معاينة التصميم (`/design-preview`)

مرجع نظام التصميم الحي. عنوان "Design System — Governance Center" `text-3xl text-gold-1`، تبويبات (النشط `bg-gold-2/20 rounded-lg`). الأقسام: **Tokens** (عينات ألوان + Typography) · **Components** (أزرار، GlassCard L1/L2، SparkPulseCard، EnergyRing، StatusBadge، CopyableField، ProofConfidencePanel) · **Motion** (مدد الحركة) · **Roles** (4 بطاقات أدوار) · **A11y** (RTL وحلقة التركيز) · **Landing** (متغيرات Hero + جدول أحداث).

---

## 12. ملخص السلوك المتجاوب

| نقطة الكسر | السلوك العام |
|------------|--------------|
| **< sm** | Nav: همبرغر فقط + drawer · KPI عمود واحد · إخفاء الرصيد والخروج · أزرار `min-h-11` · **StickyActionBar** أسفل الشاشة للأفعال الأساسية |
| **sm+** | شبكات KPI 2–3 أعمدة · بطاقات الباقات 3 أعمدة · الإيصال صف أفقي |
| **md+** | روابط Nav تظهر · إخفاء StickyActionBar وإظهار الأزرار inline · شبكات أوسع |
| **lg+** | Hero عمودان · SparkJourney 4 أعمدة · Campaign OS وAdmin بشريط جانبي · معاينة المعالج لاصقة · KPI الراعي 4 أعمدة |
| **عام** | الجداول `overflow-x-auto min-w-[480px]` · التبويبات قابلة للتمرير أفقياً · `pb-safe` و`safe-area-inset` محترمة · `prefers-reduced-motion` يلغي الحركات السينمائية |

### القواعد البصرية الثابتة عبر الموقع

1. **خلفية سوداء دائماً** مع توهج ذهبي علوي خافت؛ لا وضع فاتح.
2. **الذهب = الفعل والقيمة:** كل ما هو تفاعلي أو رقم مهم يُلوَّن ذهبياً.
3. **الأرقام دائماً `font-mono`** (tabular) لاتساق المحاذاة.
4. **البطاقات زجاجية** (`GlassCard`/`CircuitCard`) بحدود ذهبية شفافة وضبابية خلفية.
5. **الأزرار الأساسية** بتدرج ذهبي ونص داكن وتوهج؛ الثانوية مفرّغة بحد ذهبي.
6. **التنقل أفقي** (topbar + تبويبات) في بوابات الصانع/الراعي، وجانبي في Campaign OS وAdmin.
7. **شبكة circuit** للهوية التقنية، تشتدّ في الشاشات "الحية" (Command, Admin, Login).
8. **الحركة هادفة:** دخول متدرج، توهج عند hover، وكشف سينمائي عند لحظات الذروة (RewardReveal).

---

*نهاية التقرير البصري — TENEGTA Spark Visual Design Report · يونيو 2026*
