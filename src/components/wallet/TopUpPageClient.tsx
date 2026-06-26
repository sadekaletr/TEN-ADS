"use client";

import { useRef, useState } from "react";
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
import {
  StickyActionBar,
  StickyActionBarButton,
} from "@/components/ui/StickyActionBar";
import { Button } from "@/components/ui/Button";
import { SparkAmount } from "@/components/ui/SparkAmount";
import { GlassCard } from "@/components/ui/GlassCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Checkbox } from "@/components/ui/Checkbox";
import { cn } from "@/lib/utils";
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
  const transferUsd = sparkPackageUsd(amount, usdPerSpark);

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
        <GlassCard className="space-y-4 text-center">
          <p className="text-2xl text-gold-1">تم استلام طلبك</p>
          <p className="text-sm text-dim">قيد المراجعة — ستصلك إشعار عند الموافقة</p>
          <SparkAmount amount={amount} size="lg" className="justify-center" />
        </GlassCard>
        <GlassCard>
          <h2 className="mb-4 text-lg text-gold-1">متابعة الطلب</h2>
          <TopUpTimeline request={submittedRequest} />
        </GlassCard>
        <div className="flex flex-col gap-2">
          <Button href="/dashboard/wallet" fullWidth className="min-h-11">
            الذهاب للمحفظة
          </Button>
        </div>
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
          <Button href="/dashboard/wallet" variant="secondary" size="sm" className="min-h-11">
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

      {draft && (
        <DraftCampaignBanner title={draft.title} sparkNeeded={draft.sparkNeeded} />
      )}

      {step === "package" && (
        <>
          <TopUpSocialProof data={socialProof} />
          <div className="grid items-stretch gap-4 sm:grid-cols-3">
            {packages.map((pkg) => (
              <TopUpPackageCard
                key={pkg.amount}
                pkg={pkg}
                selected={!customMode && selectedAmount === pkg.amount}
                onSelect={() => {
                  setCustomMode(false);
                  setSelectedAmount(pkg.amount);
                }}
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
              <Input
                type="number"
                min={1}
                value={customAmount}
                onChange={(e) => setCustomAmount(Number(e.target.value))}
                className="min-h-11 font-mono"
              />
            )}
            <Button
              fullWidth
              disabled={amount < 1}
              className="min-h-11"
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
                className="min-h-11"
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
          <Button variant="ghost" size="sm" className="min-h-11" onClick={() => setStep("package")}>
            ← تغيير الباقة
          </Button>
          <GlassCard className="space-y-2 text-center">
            <p className="text-sm text-dim">المبلغ المطلوب شحنه</p>
            <SparkAmount amount={amount} size="xl" className="justify-center" />
            <p className="text-sm text-dim">
              ما يعادل{" "}
              <span className="font-mono font-semibold text-gold-1">{formatUsd(transferUsd)}</span>
              {isPartner && (
                <>
                  {" "}
                  <span className="font-mono text-dim line-through">
                    {formatUsd(sparkPackageUsd(amount, sparkPricing.listUsd))}
                  </span>
                </>
              )}
            </p>
            {partner && (
              <p className="text-xs text-dim">
                كود الشريك:{" "}
                <span className="font-mono text-gold-1">{partner.discountCode}</span>
              </p>
            )}
          </GlassCard>
          <ProofConfidencePanel
            settings={transferSettings}
            amountLabel={
              <div className="text-center">
                <p className="text-xs text-dim">المبلغ</p>
                <SparkAmount amount={amount} size="md" className="justify-center" />
              </div>
            }
          />
          <Button fullWidth className="min-h-11" onClick={() => setStep("proof")}>
            تم التحويل — رفع الإثبات
          </Button>
        </div>
      )}

      {(step === "proof" || step === "submit") && (
        <GlassCard className="space-y-4">
          <Button variant="ghost" size="sm" className="min-h-11" onClick={() => setStep("transfer")}>
            ← رجوع للتحويل
          </Button>
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
            <TrustProofUploader
              label="صورة إثبات التحويل"
              hint="PNG أو JPG — تأكد من وضوح رقم العملية"
              trustCopy="إثباتك يُراجع يدوياً خلال ساعات — لا يُشارك خارج المنصة"
              fileName={proofFile?.name ?? null}
              previewUrl={proofPreview}
              onSelect={handleProofSelect}
            />
            <div>
              <Label htmlFor="bank-ref">رقم العملية / المرجع</Label>
              <Input
                id="bank-ref"
                type="text"
                value={bankReference}
                onChange={(e) => setBankReference(e.target.value)}
                className="min-h-11 font-mono"
                required
                minLength={3}
              />
            </div>
            {submitError && (
              <p className="rounded border border-danger/30 bg-danger-muted px-3 py-2 text-sm text-danger">
                {submitError}
              </p>
            )}
            <Button
              type="submit"
              loading={loading}
              disabled={amount < 1 || !proofFile}
              fullWidth
              className="hidden min-h-11 py-3 text-base md:flex"
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
