"use client";

import Link from "next/link";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { FormField } from "@/components/ui/FormField";
import { SmartFileDropzone } from "@/components/ui/SmartFileDropzone";
import { TrustProofUploader } from "@/components/ui/TrustProofUploader";
import { CreatorSpotlightCard } from "@/components/creators/CreatorSpotlightCard";
import { CreatorCardSkeleton } from "@/components/creators/CreatorCardSkeleton";
import type { CreatorCardData } from "@/lib/creators/getFeaturedCreators";
import { fadeUp, scaleIn, staggerContainer, staggerItem } from "@/lib/motion/variants";
import { duration, easeGold, transition } from "@/lib/motion/tokens";
import { useMotionSafe } from "@/lib/motion/useMotionSafe";
import { CommandKPICluster } from "@/components/ui/CommandKPICluster";
import { TopUpPackageCard } from "@/components/wallet/TopUpPackageCard";
import { ProofConfidencePanel } from "@/components/wallet/ProofConfidencePanel";
import { SponsorRoiCard } from "@/components/sponsor/SponsorRoiCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { StepProgressRail } from "@/components/ui/StepProgressRail";
import { FilterPill, FilterPillGroup } from "@/components/ui/FilterPill";
import {
  DashboardLoadingSkeleton,
  TopUpLoadingSkeleton,
  SponsorRoiLoadingSkeleton,
} from "@/components/ui/SkeletonCard";
import { spark } from "@/lib/format";
import { buildTopUpPackages } from "@/lib/wallet/topup-packages";
import { TOKENS } from "@/styles/tokens";

const NOW = new Date().toISOString();

const DEMO_CREATOR: CreatorCardData = {
  id: "ui40-demo",
  name: "روان الشمعة",
  handle: "@rawan_shamaa",
  avatarUrl: "/creators/spotlight/rawan-shamaa-cover.png",
  coverImageUrl: "/creators/spotlight/rawan-shamaa-cover.png",
  city: "دمشق",
  categories: ["fashion", "lifestyle"],
  verified: true,
  sparkScore: 742,
  trustScore: 88,
  campaignsCount: 4,
  activeCampaigns: 2,
  totalRedemptions: 56,
  conversionRate: 0.12,
  showcaseTagline: "روان الشمعة",
  spotlightRank: 1,
  bio: "صانعة محتوى أزياء — حملات حية مع رعات موثّقين",
  createdAt: NOW,
  listingCreatedAt: NOW,
};

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4 rounded-2xl border border-strong bg-bg-surface p-6 shadow-surface">
      <div>
        <h3 className={`${TOKENS.type.cardTitle} text-text-primary`}>{title}</h3>
        {description ? (
          <p className="mt-1 text-sm text-text-secondary">{description}</p>
        ) : null}
      </div>
      {children}
    </div>
  );
}

export function GlobalUi40PreviewPanel() {
  const motionOk = useMotionSafe();

  const heroReveal = motionOk
    ? {
        initial: fadeUp.initial,
        animate: fadeUp.animate,
        transition: transition.normal,
      }
    : {};

  const previewUrl = useMemo(() => null, []);
  const demoPackages = useMemo(() => buildTopUpPackages(100, 0.5), []);

  const DEMO_TRANSFER = {
    transferMethod: "ShamCash",
    transferAccount: "+963900000000",
    transferInstructions: "تعليمات تجريبية للمعاينة",
  };

  return (
    <section className="space-y-8">
      <div>
        <h2 className={`${TOKENS.type.sectionTitle} text-gold-accent`}>
          Global UI 4.0 — PR-1 + PR-2 + PR-3 Governance
        </h2>
        <p className="mt-2 text-sm text-text-secondary">
          Public · Dashboard · Wallet · ROI · Admin · Redeem · Marketplace
        </p>
      </div>

      <Section
        title="Hero CTA hierarchy"
        description="One primary (glow) · one secondary · one ghost — min-h-12 tap targets"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button size="lg" variant="primary" glow className="min-h-12" icon={<Icon name="rocket" size={20} />}>
            Primary CTA
          </Button>
          <Button size="lg" variant="secondary" className="min-h-12" icon={<Icon name="storefront" size={20} />}>
            Secondary CTA
          </Button>
          <Button size="lg" variant="ghost" className="min-h-12" icon={<Icon name="play" size={20} />}>
            Ghost / Demo
          </Button>
        </div>
      </Section>

      <Section title="Creator card variants" description="Spotlight · default · skeleton · preview (no link)">
        <div className="grid gap-6 lg:grid-cols-3">
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-text-tertiary">
              Spotlight
            </p>
            <CreatorSpotlightCard creator={DEMO_CREATOR} size="spotlight" preview animate={false} />
          </div>
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-text-tertiary">
              Default grid
            </p>
            <CreatorSpotlightCard
              creator={{ ...DEMO_CREATOR, spotlightRank: null }}
              size="default"
              preview
              animate={false}
            />
          </div>
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-text-tertiary">
              Loading skeleton
            </p>
            <CreatorCardSkeleton />
          </div>
        </div>
      </Section>

      <Section title="Form controls" description="Unified field shell — default · focus · error · disabled · upload">
        <div className="grid gap-6 md:grid-cols-2">
          <FormField label="الاسم الكامل" required hint="مثال: أحمد محمد">
            <Input placeholder="الاسم الكامل" className="min-h-12" />
          </FormField>
          <FormField label="المدينة" error="اختر مدينة صالحة">
            <Input placeholder="المدينة" error className="min-h-12" />
          </FormField>
          <FormField label="الفئة">
            <Select className="min-h-12">
              <option value="">اختر فئة</option>
              <option value="fashion">أزياء</option>
              <option value="food">طعام</option>
            </Select>
          </FormField>
          <FormField label="معطّل">
            <Input disabled placeholder="غير متاح" className="min-h-12" />
          </FormField>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <p className="mb-2 text-xs text-text-tertiary">Dropzone idle</p>
            <SmartFileDropzone label="اسحب الصورة أو انقر" onSelect={() => {}} />
          </div>
          <div>
            <p className="mb-2 text-xs text-text-tertiary">Uploaded + trust shell</p>
            <TrustProofUploader
              label="إثبات التحويل"
              hint="PNG أو JPG"
              fileName="proof-2026.jpg"
              previewUrl={previewUrl}
              onSelect={() => {}}
            />
          </div>
        </div>
      </Section>

      <Section
        title="Dashboard command center (PR-2)"
        description="Dominant KPI · secondary metrics · primary/secondary CTA · loading skeleton"
      >
        <CommandKPICluster
          primary={{
            label: "رصيد Spark",
            value: <span className="font-mono">{spark(847)}</span>,
            meta: "آخر تحديث: اليوم",
          }}
          secondary={[
            { label: "حملات نشطة", value: "3", trend: "2 تنتهي هذا الأسبوع" },
            { label: "معدل التحويل", value: "12%", trend: "1,240 مشاهدة" },
          ]}
          primaryAction={{
            href: "#",
            label: "حملة جديدة",
            icon: <Icon name="rocket" size={16} />,
          }}
          secondaryAction={{ href: "#", label: "شحن المحفظة" }}
        />
        <p className="text-xs text-text-tertiary">Loading parity</p>
        <DashboardLoadingSkeleton />
      </Section>

      <Section
        title="Wallet top-up (PR-2)"
        description="Package selected/default · proof confidence · summary clarity"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <TopUpPackageCard
            pkg={demoPackages[1] ?? demoPackages[0]}
            selected={false}
            onSelect={() => {}}
          />
          <TopUpPackageCard
            pkg={demoPackages.find((p) => p.featured) ?? demoPackages[0]}
            selected
            onSelect={() => {}}
          />
        </div>
        <ProofConfidencePanel settings={DEMO_TRANSFER} />
        <p className="text-xs text-text-tertiary">Top-up loading skeleton</p>
        <TopUpLoadingSkeleton />
      </Section>

      <Section
        title="Sponsor ROI (PR-2)"
        description="KPI strip · narrative block · empty · range tabs"
      >
        <SponsorRoiCard
          totalRedemptions={128}
          totalSparkCost={640}
          costPerRedemption={5}
          campaigns={[
            { title: "حملة رمضان", redemptions: 72, sparkCost: 360 },
            { title: "إطلاق صيف", redemptions: 56, sparkCost: 280 },
          ]}
        />
        <p className="mb-2 text-xs text-text-tertiary">Empty state</p>
        <EmptyState
          variant="premium"
          title="لا توجد بيانات ROI"
          description="معاينة الحالة الفارغة"
        />
        <p className="mt-4 text-xs text-text-tertiary">ROI loading skeleton</p>
        <SponsorRoiLoadingSkeleton />
      </Section>

      <Section title="Admin density (PR-3)" description="KPI strip · status semantics · table zebra">
        <CommandKPICluster
          primary={{
            label: "طلبات معلّقة",
            value: <span className="font-mono">12</span>,
            meta: "SLA 4 ساعات",
          }}
          secondary={[
            { label: "موافقات اليوم", value: "8" },
            { label: "مرفوض", value: "1" },
          ]}
          primaryAction={{ href: "#", label: "مراجعة الآن", icon: <Icon name="wallet" size={16} /> }}
        />
        <div className="flex flex-wrap gap-2">
          <StatusBadge status="pending" />
          <StatusBadge status="approved" />
          <StatusBadge status="rejected" />
          <StatusBadge status="live" />
        </div>
        <DataTable
          rows={[
            { id: "1", name: "طلب شحن #42", amount: "150 Spark", status: "pending" as const },
            { id: "2", name: "طلب شحن #41", amount: "30 Spark", status: "approved" as const },
          ]}
          rowKey={(r) => r.id}
          columns={[
            { key: "name", header: "الطلب", cell: (r) => r.name },
            { key: "amount", header: "المبلغ", cell: (r) => r.amount, mono: true },
            {
              key: "status",
              header: "الحالة",
              cell: (r) => <StatusBadge status={r.status} />,
            },
          ]}
        />
      </Section>

      <Section title="Redeem journey (PR-3)" description="Step rail · trust · error premium">
        <StepProgressRail
          steps={[
            { id: "welcome", label: "ترحيب" },
            { id: "claim", label: "بيانات" },
            { id: "proof", label: "إثبات" },
            { id: "reveal", label: "جائزة" },
          ]}
          current="claim"
          className="max-w-md mx-auto"
        />
        <EmptyState
          variant="premium"
          icon="gift"
          title="كود غير صالح"
          description="معاينة حالة الخطأ — actionable CTAs"
        />
      </Section>

      <Section title="Marketplace filters (PR-3)" description="Active pill states · filtered empty">
        <FilterPillGroup label="الفئة">
          <FilterPill active>الكل</FilterPill>
          <FilterPill>أزياء</FilterPill>
          <FilterPill active>مطاعم</FilterPill>
        </FilterPillGroup>
        <EmptyState
          variant="premium"
          title="لا نتائج للفلتر"
          description="إعادة تعيين أو توسيع البحث"
        />
      </Section>

      <Section
        title="Interaction states"
        description="Hover/focus via Tab · disabled CTA"
      >
        <div className="flex flex-wrap gap-3">
          <Button variant="primary" glow className="min-h-12">
            Default
          </Button>
          <Button variant="secondary" className="min-h-12" disabled>
            Disabled
          </Button>
          <Button variant="ghost" className="focus-ring min-h-12">
            Focus me (Tab)
          </Button>
        </div>
      </Section>

      <Section
        title="Motion tokens"
        description={`instant ${duration.instant}s · fast ${duration.fast}s · normal ${duration.normal}s · slow ${duration.slow}s · cinematic ${duration.cinematic}s`}
      >
        <p className="text-xs text-text-tertiary">
          Easing: cubic-bezier({easeGold.join(", ")}) — transform + opacity only
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          <motion.div
            className="rounded-xl border border-strong bg-bg-elevated p-4 text-center text-sm text-gold-accent"
            {...heroReveal}
          >
            fadeUp
          </motion.div>
          <motion.div
            className="rounded-xl border border-strong bg-bg-elevated p-4 text-center text-sm text-gold-accent"
            initial={motionOk ? scaleIn.initial : false}
            animate={scaleIn.animate}
            transition={transition.slow}
          >
            scaleIn
          </motion.div>
          <motion.div
            className="rounded-xl border border-strong bg-bg-elevated p-4"
            variants={motionOk ? staggerContainer : undefined}
            initial={motionOk ? "initial" : false}
            animate="animate"
          >
            {[0, 1, 2].map((i) => (
              <motion.p
                key={i}
                className="text-sm text-text-secondary"
                variants={staggerItem}
              >
                stagger {i + 1}
              </motion.p>
            ))}
          </motion.div>
        </div>
        <p className="text-xs text-text-secondary">
          Reduced motion: enable OS setting — aurora, marquee, pulse, and non-essential Framer loops
          should stop.{" "}
          <Link href="/" className="text-gold-accent underline">
            Verify on landing
          </Link>
        </p>
      </Section>
    </section>
  );
}
