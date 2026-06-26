"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input } from "@/components/ui/Input";
import { FormField } from "@/components/ui/FormField";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SurfaceCard } from "@/components/ui/SurfaceCard";
import { StepProgressRail } from "@/components/ui/StepProgressRail";
import { TrustProofUploader } from "@/components/ui/TrustProofUploader";
import { Icon } from "@/components/ui/Icon";
import { isProCampaign } from "@/lib/campaign-tiers";
import type { Campaign } from "@prisma/client";

const CLAIM_STEPS = [
  { id: "details", label: "بيانات" },
  { id: "proof", label: "إثبات" },
  { id: "confirm", label: "تأكيد" },
] as const;

function resolveClaimStep(
  fullName: string,
  phone: string,
  verificationFile: File | null,
  proCampaign: boolean
): (typeof CLAIM_STEPS)[number]["id"] {
  if (!fullName.trim() || !phone.trim()) return "details";
  if (proCampaign && !verificationFile) return "proof";
  return "confirm";
}

interface ClaimFormProps {
  campaign: Campaign;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  verificationFile: File | null;
  acceptedTerms: boolean;
  onFullNameChange: (v: string) => void;
  onPhoneChange: (v: string) => void;
  onAddressChange: (v: string) => void;
  onCityChange: (v: string) => void;
  onVerificationFileChange: (f: File | null) => void;
  onAcceptedTermsChange: (v: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading?: boolean;
}

export function ClaimForm({
  campaign,
  fullName,
  phone,
  address,
  city,
  verificationFile,
  acceptedTerms,
  onFullNameChange,
  onPhoneChange,
  onAddressChange,
  onCityChange,
  onVerificationFileChange,
  onAcceptedTermsChange,
  onSubmit,
  loading,
}: ClaimFormProps) {
  const proCampaign = isProCampaign(campaign.tier ?? "BASIC");
  const currentStep = resolveClaimStep(fullName, phone, verificationFile, proCampaign);

  const previewUrl = useMemo(
    () => (verificationFile ? URL.createObjectURL(verificationFile) : null),
    [verificationFile]
  );

  return (
    <div className="w-full space-y-4">
      <StepProgressRail
        steps={[...CLAIM_STEPS]}
        current={currentStep}
        className="max-w-xs mx-auto"
      />
      <SectionHeader
        title="بيانات الاستلام"
        description="أدخل معلوماتك لإتمام الاسترداد"
      />
      <SurfaceCard>
        <div className="mb-4 flex items-start gap-2 rounded-xl border border-strong bg-bg-elevated/60 px-3 py-2.5 text-xs text-text-secondary">
          <Icon name="lock" size={16} className="mt-0.5 shrink-0 text-gold-accent" />
          <p>
            بياناتك محمية ومشفّرة. نستخدمها فقط لتوصيل الجائزة ولن نشاركها مع أطراف ثالثة.
          </p>
        </div>
        <form onSubmit={onSubmit} className="space-y-4" aria-label="نموذج الاستلام">
          <FormField label="الاسم الكامل" required>
            <Input
              placeholder="الاسم الكامل"
              value={fullName}
              onChange={(e) => onFullNameChange(e.target.value)}
              className="min-h-12"
              required
            />
          </FormField>
          <FormField label="رقم الهاتف" required hint="أدخل رقم هاتف صالح للتواصل">
            <Input
              type="tel"
              placeholder="رقم الهاتف"
              value={phone}
              onChange={(e) => onPhoneChange(e.target.value)}
              className="min-h-12 font-mono tabular-nums"
              required
            />
          </FormField>
          {campaign.requireAddress && (
            <FormField label="العنوان" required>
              <Input
                placeholder="العنوان"
                value={address}
                onChange={(e) => onAddressChange(e.target.value)}
                className="min-h-12"
                required
              />
            </FormField>
          )}
          <FormField label="المدينة">
            <Input
              placeholder="المدينة"
              value={city}
              onChange={(e) => onCityChange(e.target.value)}
              className="min-h-12"
            />
          </FormField>
          <TrustProofUploader
            label={
              proCampaign
                ? "تحقق فوري بالكاميرا — موصى به"
                : "تحقق فوري بالكاميرا (اختياري)"
            }
            hint="التقط صورة واضحة أو ارفع من المعرض"
            capture="environment"
            fileName={verificationFile?.name ?? null}
            previewUrl={previewUrl}
            onSelect={onVerificationFileChange}
          />
          <Checkbox
            label={
              <span>
                أوافق على{" "}
                <Link href="/privacy" className="text-gold-2 hover:text-gold-1 focus-ring rounded">
                  سياسة الخصوصية
                </Link>{" "}
                و{" "}
                <Link href="/terms" className="text-gold-2 hover:text-gold-1 focus-ring rounded">
                  شروط الاستخدام
                </Link>
              </span>
            }
            checked={acceptedTerms}
            onChange={(e) => onAcceptedTermsChange(e.target.checked)}
          />
          <Button
            type="submit"
            fullWidth
            glow
            className="min-h-12"
            loading={loading}
            disabled={!acceptedTerms}
          >
            تأكيد الاستلام
          </Button>
        </form>
      </SurfaceCard>
    </div>
  );
}
