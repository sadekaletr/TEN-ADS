"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  redeemCode,
  trackRedemptionStarted,
  uploadVerificationPhoto,
  validateCodeSubmit,
} from "@/app/redeem/actions";
import { getClientSessionId, trackEvent } from "@/lib/track-client";
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

interface RedeemFlowProps {
  campaign: CampaignWithRelations;
  code: string;
  trackingRef?: string;
  consumerRef?: string;
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
  }, [phase, campaign.id, sessionId]);

  async function runValidation() {
    setPhase("validating");
    setError("");
    try {
      await validateCodeSubmit(campaign.id, sessionId);
      await trackRedemptionStarted(campaign.id, sessionId);
      await new Promise((r) => setTimeout(r, 1200));
      setPhase("claim");
    } catch {
      setError("تعذّر التحقق من الكود");
      setPhase("code");
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
      setPhase("code");
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
      setPhase("reveal");
    } else {
      setError(result.error);
      trackEvent(campaign.id, sessionId, "REDEMPTION_FAILED", {
        reason: result.error,
      });
      setPhase("error");
    }
  }

  return (
    <main className="redeem-safe mx-auto flex min-h-dvh max-w-md flex-col items-center px-4 py-8 pb-safe">
      <Image
        src="/brand/tenegta-logo.svg"
        alt="TENEGTA Spark"
        width={140}
        height={36}
        className="mb-8 opacity-90"
        priority
      />

      {phase === "welcome" && (
        <RedeemWelcomeScreen campaign={campaign} onContinue={() => setPhase("preview")} />
      )}

      {phase === "preview" && (
        <RedeemRewardPreview campaign={campaign} onContinue={() => setPhase("creator")} />
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
          title={t("redeem.errorTitle")}
          description={error}
          action={
            <Button variant="secondary" className="min-h-11" onClick={() => setPhase("welcome")}>
              {t("redeem.tryAgain")}
            </Button>
          }
        />
      )}
    </main>
  );
}
