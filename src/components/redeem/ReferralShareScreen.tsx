"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { getReferralShareUrl } from "@/lib/referral/actions";
import { n } from "@/lib/format";

const GOAL = 3;

interface ReferralShareScreenProps {
  phone: string;
  campaignId: string;
  code: string;
  onSkip: () => void;
}

export function ReferralShareScreen({
  phone,
  campaignId,
  code,
  onSkip,
}: ReferralShareScreenProps) {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  useEffect(() => {
    void getReferralShareUrl(phone, campaignId, code).then(setShareUrl);
  }, [phone, campaignId, code]);

  async function handleCopy() {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleShare() {
    if (!shareUrl) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "ادعُ أصدقاءك",
          text: `انضم للحملة — ادعُ ${n(GOAL)} أصدقاء`,
          url: shareUrl,
        });
        return;
      } catch {
        // cancelled
      }
    }
    await handleCopy();
  }

  return (
    <div className="w-full space-y-4 rounded-xl border border-gold-4/20 bg-surface-2/40 p-5 text-center">
      <h3 className="text-lg font-semibold text-gold-1">ادعُ {n(GOAL)} أصدقاء</h3>
      <p className="text-sm text-text-secondary">
        شارك الرابط — عندما يسترد {n(GOAL)} أصدقاء عبر رابطك تحصل على مكافأة
      </p>
      <Button fullWidth onClick={handleShare}>
        {copied ? "تم نسخ الرابط" : "مشاركة رابط الدعوة"}
      </Button>
      <Button fullWidth variant="ghost" onClick={onSkip}>
        تخطي
      </Button>
    </div>
  );
}
