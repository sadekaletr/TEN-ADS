"use client";

import { useEffect, useRef, useState } from "react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import {
  redeemCode,
  trackRedemptionStarted,
  uploadVerificationPhoto,
  validateCodeSubmit,
} from "@/app/redeem/actions";
import { getClientSessionId, trackEvent } from "@/lib/track-client";
import { trackProductEvent } from "@/lib/analytics/product-events";
import { RedeemWelcomeScreen } from "@/components/redeem/RedeemWelcomeScreen";
import { RedeemRewardPreview } from "@/components/redeem/RedeemRewardPreview";
import { RedeemCreatorIntro } from "@/components/redeem/RedeemCreatorIntro";
import { CodeEntryFocus } from "@/components/redeem/CodeEntryFocus";
import { ValidationState } from "@/components/redeem/ValidationState";
import { ClaimForm } from "@/components/redeem/ClaimForm";
import { RedemptionReceipt } from "@/components/redeem/RedemptionReceipt";
import { RedemptionRating } from "@/components/redeem/RedemptionRating";
import { RewardReveal } from "@/components/redeem/RewardReveal";
import { ReferralShareScreen } from "@/components/redeem/ReferralShareScreen";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Icon } from "@/components/ui/Icon";
import { RewardJourney } from "@/components/experience/RewardJourney";
import { useLocale } from "@/lib/i18n";
import type { Campaign, Creator, Sponsor } from "@prisma/client";

type CampaignWithRelations = Campaign & {
  sponsor: Sponsor;
  creator: Pick<Creator, "handle" | "name" | "avatarUrl" | "verified">;
};

type Phase =
  | "welcome"
  | "preview"
  | "creator"
  | "code"
  | "validating"
  | "claim"
  | "reveal"
  | "error";

const PHASE_LABELS: Record<Phase, string> = {
  welcome: "الترحيب",
  preview: "معاينة الجائزة",
  creator: "تعريف الصانع",
  code: "إدخال الكود",
  validating: "التحقق",
  claim: "بيانات الاستلام",
  reveal: "الجائزة",
  error: "خطأ",
};

interface RedeemFlowProps {
  campaign: CampaignWithRelations;
  code: string;
  trackingRef?: string;
  consumerRef?: string;
}

function resolveErrorCopy(error: string): { title: string; description: string } {
  const lower = error.toLowerCase();
  if (lower.includes("expired") || lower.includes("منته")) {
    return {
      title: "انتهت صلاحية الحملة",
      description: "هذه الحملة لم تعد متاحة للاسترداد. تواصل مع الراعي للمزيد.",
    };
  }
  if (lower.includes("already") || lower.includes("سبق")) {
    return {
      title: "تم الاسترداد مسبقاً",
      description: "يبدو أنك استلمت هذه الجائزة من قبل. تحقق من رسائلك أو تواصل مع الدعم.",
    };
  }
  if (lower.includes("invalid") || lower.includes("غير صالح")) {
    return {
      title: "كود غير صالح",
      description: "تأكد من الكود وحاول مرة أخرى، أو امسح رمز QR من جديد.",
    };
  }
  return {
    title: "تعذّر إتمام الاسترداد",
    description: error || "حدث خطأ غير متوقع. حاول مرة أخرى.",
  };
}

export function RedeemFlow({
  campaign,
  code: initialCode,
  trackingRef,
  consumerRef,
}: RedeemFlowProps) {
  const { t } = useLocale();
  const [phase, setPhase] = useState<Phase>("welcome");
  const [code, setCode] = useState(initialCode);
  const [error, setError] = useState("");
  const [reference, setReference] = useState("");
  const [redemptionId, setRedemptionId] = useState("");
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [verificationFile, setVerificationFile] = useState<File | null>(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showReferral, setShowReferral] = useState(true);
  const sessionId = getClientSessionId();
  const liveRef = useRef<HTMLDivElement>(null);

  function goTo(next: Phase) {
    setPhase(next);
    trackProductEvent("redeem_step_change", {
      section: "redeem_flow",
      metadata: { phase: next, campaignId: campaign.id },
    });
  }

  useEffect(() => {
    trackEvent(campaign.id, sessionId, "PAGE_VIEW");
  }, [campaign.id, sessionId]);

  useEffect(() => {
    const funnelMap: Partial<Record<Phase, string>> = {
      welcome: "redeem_welcome",
      claim: "redeem_claim_start",
      reveal: "redeem_complete",
      error: "redeem_error",
    };
    const step = funnelMap[phase];
    if (step) {
      trackEvent(campaign.id, sessionId, "PAGE_VIEW", { funnelStep: step, phase });
    }
    liveRef.current?.focus();
  }, [phase, campaign.id, sessionId]);

  useEffect(() => {
    if (phase === "reveal") {
      trackProductEvent("redeem_success_reveal", {
        section: "redeem_flow",
        metadata: { campaignId: campaign.id, reference },
      });
    }
  }, [phase, campaign.id, reference]);

  async function runValidation() {
    goTo("validating");
    setError("");
    try {
      await validateCodeSubmit(campaign.id, sessionId);
      await trackRedemptionStarted(campaign.id, sessionId);
      await new Promise((r) => setTimeout(r, 1200));
      goTo("claim");
    } catch {
      setError("تعذّر التحقق من الكود");
      goTo("code");
    }
  }

  async function handleVerify() {
    if (!code.trim()) return;
    setLoading(true);
    await runValidation();
    setLoading(false);
  }

  function afterCreatorIntro() {
    if (initialCode.trim()) {
      void runValidation();
    } else {
      goTo("code");
    }
  }

  async function handleClaimSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await redeemCode(
      campaign.id,
      code,
      sessionId,
      {
        fullName,
        phone,
        address: campaign.requireAddress ? address : undefined,
        city: city || undefined,
      },
      trackingRef,
      consumerRef
    );

    setLoading(false);
    if (result.ok) {
      setReference(result.reference);
      setRedemptionId(result.redemptionId);
      if (verificationFile) {
        const fd = new FormData();
        fd.append("photo", verificationFile);
        await uploadVerificationPhoto(result.redemptionId, sessionId, fd);
      }
      goTo("reveal");
    } else {
      setError(result.error);
      trackEvent(campaign.id, sessionId, "REDEMPTION_FAILED", {
        reason: result.error,
      });
      goTo("error");
    }
  }

  const errorCopy = resolveErrorCopy(error);

  return (
    <main className="redeem-safe mx-auto flex min-h-dvh max-w-md flex-col items-center px-4 py-8 pb-safe">
      <div
        ref={liveRef}
        tabIndex={-1}
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {PHASE_LABELS[phase]}
      </div>

      <BrandLogo variant="logo" size="md" priority className="mb-6 opacity-95" />

      {phase !== "error" && (
        <RewardJourney currentPhase={phase} className="mb-8 max-w-sm" />
      )}

      {phase === "welcome" && (
        <RedeemWelcomeScreen campaign={campaign} onContinue={() => goTo("preview")} />
      )}

      {phase === "preview" && (
        <RedeemRewardPreview campaign={campaign} onContinue={() => goTo("creator")} />
      )}

      {phase === "creator" && (
        <RedeemCreatorIntro campaign={campaign} onContinue={afterCreatorIntro} />
      )}

      {phase === "code" && (
        <CodeEntryFocus
          code={code}
          onCodeChange={setCode}
          onVerify={handleVerify}
          loading={loading}
          error={error}
        />
      )}

      {phase === "validating" && <ValidationState />}

      {phase === "claim" && (
        <ClaimForm
          campaign={campaign}
          fullName={fullName}
          phone={phone}
          address={address}
          city={city}
          verificationFile={verificationFile}
          acceptedTerms={acceptedTerms}
          onFullNameChange={setFullName}
          onPhoneChange={setPhone}
          onAddressChange={setAddress}
          onCityChange={setCity}
          onVerificationFileChange={setVerificationFile}
          onAcceptedTermsChange={setAcceptedTerms}
          onSubmit={handleClaimSubmit}
          loading={loading}
        />
      )}

      {phase === "reveal" && (
        <div className="w-full space-y-6">
          <RewardReveal
            campaign={campaign}
            prizeName={campaign.prizeName}
            reference={reference}
            qrCode={code}
            revealStyle={campaign.revealStyle}
          />
          {showReferral && phone && (
            <ReferralShareScreen
              phone={phone}
              campaignId={campaign.id}
              code={code}
              onSkip={() => setShowReferral(false)}
            />
          )}
          <RedemptionReceipt
            reference={reference}
            prizeName={campaign.prizeName}
            sponsorName={campaign.sponsor.name}
            creatorName={campaign.creator.name}
            code={code}
          />
          {redemptionId && <RedemptionRating redemptionId={redemptionId} />}
        </div>
      )}

      {phase === "error" && (
        <EmptyState
          variant="premium"
          icon="gift"
          title={errorCopy.title}
          description={errorCopy.description}
          action={
            <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-center">
              <Button
                variant="primary"
                glow
                className="min-h-12"
                icon={<Icon name="rocket" size={16} />}
                onClick={() => goTo("claim")}
              >
                حاول مرة أخرى
              </Button>
              <Button
                variant="secondary"
                className="min-h-12"
                onClick={() => goTo("welcome")}
              >
                {t("redeem.tryAgain")}
              </Button>
            </div>
          }
        />
      )}
    </main>
  );
}
