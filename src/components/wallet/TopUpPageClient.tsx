"use client";

import { useMemo, useRef, useState } from "react";
import {
  requestTopUp,
  uploadTopUpProof,
} from "@/app/dashboard/actions";
import {
  PartnerSparkBanner,
  SparkListPriceStrip,
} from "@/components/wallet/PartnerSparkBanner";
import {
  DraftCampaignBanner,
  TopUpPackageCard,
} from "@/components/wallet/TopUpPackageCard";
import { TopUpSocialProof } from "@/components/wallet/TopUpSocialProof";
import { TopUpTimeline } from "@/components/wallet/TopUpTimeline";
import { WalletTopUpStepper, type TopUpStepKey } from "@/components/wallet/WalletTopUpStepper";
import { ProofConfidencePanel } from "@/components/wallet/ProofConfidencePanel";
import { WalletConfidenceStrip } from "@/components/ui/WalletConfidenceStrip";
import { TrustProofUploader } from "@/components/ui/TrustProofUploader";
import { FormField } from "@/components/ui/FormField";
import {
  StickyActionBar,
  StickyActionBarButton,
} from "@/components/ui/StickyActionBar";
import { Button } from "@/components/ui/Button";
import { SparkAmount } from "@/components/ui/SparkAmount";
import { GlassCard } from "@/components/ui/GlassCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { Input } from "@/components/ui/Input";
import { Checkbox } from "@/components/ui/Checkbox";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import { trackProductEvent } from "@/lib/analytics/product-events";
import type { TopUpRequest } from "@prisma/client";
import type { TopUpPackage } from "@/lib/wallet/topup-packages";
import type { TopUpSocialProofData } from "@/lib/wallet/social-proof";
import type { TransferSettings } from "@/lib/platform-settings";
import type { SparkPricing } from "@/lib/spark-pricing";
import { formatUsd, sparkPackageUsd } from "@/lib/spark-pricing";

interface TopUpPageClientProps {
  packages: TopUpPackage[];
  socialProof: TopUpSocialProofData;
  walletBalance: number;
  transferSettings: TransferSettings;
  initialAmount?: number;
  needAmount?: number;
  draft?: { title: string; sparkNeeded: number } | null;
  sparkPricing: SparkPricing;
  partner?: { discountCode: string; creatorName: string } | null;
}

function TopUpSummary({
  amount,
  transferUsd,
  listUsd,
  isPartner,
}: {
  amount: number;
  transferUsd: number;
  listUsd?: number;
  isPartner: boolean;
}) {
  return (
    <div className="rounded-xl border border-strong bg-bg-elevated/80 p-4">
      <div className="flex items-center justify-between gap-4 border-b border-subtle pb-3">
        <span className="text-sm text-text-secondary">مبلغ الشحن</span>
        <SparkAmount amount={amount} size="md" />
      </div>
      <div className="flex items-center justify-between gap-4 pt-3">
        <span className="text-sm font-medium text-text-primary">الإجمالي المطلوب</span>
        <div className="text-end">
          <p className="font-mono text-xl font-semibold tabular-nums text-gold-accent">
            {formatUsd(transferUsd)}
          </p>
          {isPartner && listUsd != null && listUsd !== transferUsd && (
            <p className="font-mono text-xs tabular-nums text-text-tertiary line-through">
              {formatUsd(listUsd)}
            </p>
          )}
        </div>
      </div>
      <p className="mt-2 text-xs text-text-tertiary">لا رسوم إضافية — المبلغ النهائي واضح قبل الإرسال</p>
    </div>
  );
}

export function TopUpPageClient({
  packages,
  socialProof,
  walletBalance,
  transferSettings,
  initialAmount,
  needAmount,
  draft,
  sparkPricing,
  partner,
}: TopUpPageClientProps) {
  const defaultAmount =
    initialAmount ??
    (needAmount
      ? packages.find((p) => p.amount >= needAmount)?.amount ?? packages[1]?.amount ?? 15
      : packages.find((p) => p.featured)?.amount ?? 15);

  const [step, setStep] = useState<TopUpStepKey | "done">("package");
  const [selectedAmount, setSelectedAmount] = useState(defaultAmount);
  const [customMode, setCustomMode] = useState(false);
  const [customAmount, setCustomAmount] = useState(15);
  const [bankReference, setBankReference] = useState("");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [stripeLoading, setStripeLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedRequest, setSubmittedRequest] = useState<TopUpRequest | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const amount = customMode ? customAmount : selectedAmount;
  const showStickySubmit = step === "proof" || step === "submit";
  const isPartner = Boolean(partner);
  const usdPerSpark = isPartner ? sparkPricing.partnerUsd : sparkPricing.listUsd;
  const transferUsd = useMemo(
    () => sparkPackageUsd(amount, usdPerSpark),
    [amount, usdPerSpark]
  );
  const listUsd = useMemo(
    () => (isPartner ? sparkPackageUsd(amount, sparkPricing.listUsd) : undefined),
    [amount, isPartner, sparkPricing.listUsd]
  );

  function selectPackage(pkg: TopUpPackage) {
    setCustomMode(false);
    setSelectedAmount(pkg.amount);
    trackProductEvent("wallet_topup_package_select", {
      section: "topup_package",
      metadata: { amount: pkg.amount, featured: pkg.featured },
    });
  }

  function handleProofSelect(file: File | null) {
    setProofFile(file);
    if (proofPreview) URL.revokeObjectURL(proofPreview);
    setProofPreview(file ? URL.createObjectURL(file) : null);
    if (file) setStep("submit");
  }

  async function handleStripeCheckout() {
    setStripeLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      const data = (await res.json()) as { url?: string };
      if (data.url) window.location.href = data.url;
    } finally {
      setStripeLoading(false);
    }
  }

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!proofFile) return;
    setLoading(true);
    setSubmitError(null);
    trackProductEvent("wallet_topup_submit", {
      section: "topup_proof",
      metadata: { amount, hasReference: bankReference.length >= 3 },
    });
    try {
      const request = await requestTopUp(amount, bankReference, {
        transferMethod: transferSettings.transferMethod,
      });
      const fd = new FormData();
      fd.append("photo", proofFile);
      fd.append("requestId", request.id);
      const upload = await uploadTopUpProof(fd);
      if (!upload.ok) {
        setSubmitError(upload.error);
        return;
      }
      setSubmittedRequest({ ...request, proofImageUrl: upload.url });
      setStep("done");
    } catch {
      setSubmitError("حدث خطأ — تحقق من الاتصال وحاول مرة أخرى");
    }
    setLoading(false);
  }

  if (step === "done" && submittedRequest) {
    return (
      <div className="mx-auto max-w-lg space-y-6 pb-safe">
        <GlassCard className="space-y-4 border-success/30 bg-success/5 text-center">
          <Icon name="check" size={40} className="mx-auto text-success" />
          <p className="text-2xl font-semibold text-gold-accent">تم استلام طلبك</p>
          <p className="text-sm text-text-secondary">قيد المراجعة — ستصلك إشعار عند الموافقة</p>
          <SparkAmount amount={amount} size="lg" className="justify-center" />
        </GlassCard>
        <GlassCard>
          <h2 className="mb-4 text-lg font-semibold text-text-primary">متابعة الطلب</h2>
          <TopUpTimeline request={submittedRequest} />
        </GlassCard>
        <Button href="/dashboard/wallet" fullWidth className="min-h-12">
          الذهاب للمحفظة
        </Button>
      </div>
    );
  }

  const stepperKey: TopUpStepKey =
    step === "package"
      ? "package"
      : step === "transfer"
        ? "transfer"
        : step === "proof"
          ? "proof"
          : "submit";

  return (
    <div
      className={cn(
        "mx-auto max-w-5xl space-y-6 pb-safe",
        showStickySubmit && "pb-28 md:pb-safe"
      )}
    >
      <PageHeader
        title="شحن المحفظة"
        description={
          <>
            رصيدك: <SparkAmount amount={walletBalance} size="sm" />
          </>
        }
        action={
          <Button href="/dashboard/wallet" variant="secondary" size="sm" className="min-h-12">
            المحفظة
          </Button>
        }
      />

      <WalletConfidenceStrip balance={walletBalance} method={transferSettings.transferMethod} />

      {partner && (
        <PartnerSparkBanner
          creatorName={partner.creatorName}
          discountCode={partner.discountCode}
          listUsd={sparkPricing.listUsd}
          partnerUsd={sparkPricing.partnerUsd}
          compact
        />
      )}

      <SparkListPriceStrip
        listUsd={sparkPricing.listUsd}
        partnerUsd={sparkPricing.partnerUsd}
        isPartner={isPartner}
      />

      <WalletTopUpStepper current={stepperKey} />

      {draft && <DraftCampaignBanner title={draft.title} sparkNeeded={draft.sparkNeeded} />}

      {step === "package" && (
        <>
          <TopUpSocialProof data={socialProof} />
          <div className="grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {packages.map((pkg) => (
              <TopUpPackageCard
                key={pkg.amount}
                pkg={pkg}
                selected={!customMode && selectedAmount === pkg.amount}
                onSelect={() => selectPackage(pkg)}
              />
            ))}
          </div>
          <GlassCard className="space-y-4">
            <Checkbox
              label="مبلغ مخصص"
              checked={customMode}
              onChange={(e) => setCustomMode(e.target.checked)}
            />
            {customMode && (
              <FormField label="المبلغ (Spark)" hint="أدخل عدد Spark المطلوب">
                <Input
                  type="number"
                  min={1}
                  value={customAmount}
                  onChange={(e) => setCustomAmount(Number(e.target.value))}
                  className="min-h-12 font-mono tabular-nums"
                />
              </FormField>
            )}
            <TopUpSummary
              amount={amount}
              transferUsd={transferUsd}
              listUsd={listUsd}
              isPartner={isPartner}
            />
            <Button
              fullWidth
              glow
              disabled={amount < 1}
              className="min-h-12"
              onClick={() => setStep("transfer")}
            >
              متابعة — ShamCash
            </Button>
            {process.env.NEXT_PUBLIC_STRIPE_CHECKOUT === "1" && (
              <Button
                type="button"
                variant="secondary"
                fullWidth
                loading={stripeLoading}
                className="min-h-12"
                onClick={handleStripeCheckout}
              >
                الدفع بالبطاقة (Stripe)
              </Button>
            )}
          </GlassCard>
        </>
      )}

      {step === "transfer" && (
        <div className="space-y-4">
          <Button variant="ghost" size="sm" className="min-h-12" onClick={() => setStep("package")}>
            ← تغيير الباقة
          </Button>
          <TopUpSummary amount={amount} transferUsd={transferUsd} listUsd={listUsd} isPartner={isPartner} />
          <ProofConfidencePanel
            settings={transferSettings}
            amountLabel={
              <div className="rounded-lg border border-subtle bg-bg-base/40 py-3 text-center">
                <p className="text-xs text-text-tertiary">المبلغ المحوّل</p>
                <SparkAmount amount={amount} size="md" className="justify-center" />
              </div>
            }
          />
          <Button fullWidth glow className="min-h-12" onClick={() => setStep("proof")}>
            تم التحويل — رفع الإثبات
          </Button>
        </div>
      )}

      {(step === "proof" || step === "submit") && (
        <GlassCard className="space-y-4">
          <Button variant="ghost" size="sm" className="min-h-12" onClick={() => setStep("transfer")}>
            ← رجوع للتحويل
          </Button>
          <TopUpSummary amount={amount} transferUsd={transferUsd} listUsd={listUsd} isPartner={isPartner} />
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
            <TrustProofUploader
              label="صورة إثبات التحويل"
              hint="PNG أو JPG — تأكد من وضوح رقم العملية"
              trustCopy="إثباتك يُراجع يدوياً خلال ساعات — لا يُشارك خارج المنصة"
              fileName={proofFile?.name ?? null}
              previewUrl={proofPreview}
              onSelect={handleProofSelect}
            />
            <FormField label="رقم العملية / المرجع" required hint="من إيصال التحويل البنكي">
              <Input
                type="text"
                value={bankReference}
                onChange={(e) => setBankReference(e.target.value)}
                className="min-h-12 font-mono tabular-nums"
                required
                minLength={3}
              />
            </FormField>
            {submitError && (
              <p
                className="rounded-xl border border-danger/40 bg-danger-muted px-4 py-3 text-sm text-danger"
                role="alert"
              >
                {submitError}
              </p>
            )}
            <Button
              type="submit"
              glow
              loading={loading}
              disabled={amount < 1 || !proofFile}
              fullWidth
              className="hidden min-h-12 md:flex"
            >
              إرسال طلب الشحن
            </Button>
          </form>
        </GlassCard>
      )}

      {showStickySubmit && (
        <StickyActionBar
          primary={
            <StickyActionBarButton
              type="button"
              loading={loading}
              disabled={amount < 1 || !proofFile || bankReference.length < 3}
              onClick={() => formRef.current?.requestSubmit()}
            >
              إرسال طلب الشحن
            </StickyActionBarButton>
          }
        />
      )}
    </div>
  );
}
