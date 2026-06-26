"use client";

import { useLocale } from "@/lib/i18n";

const SAMPLE_EVENTS = [
  { city: "دمشق", action: "استرداد", prize: "خصم 25%" },
  { city: "حلب", action: "حملة جديدة", prize: "هدية مجانية" },
  { city: "حمص", action: "استرداد", prize: "قهوة مجانية" },
  { city: "اللاذقية", action: "استرداد", prize: "جلسة عناية" },
  { city: "طرطوس", action: "حملة جديدة", prize: "توصيل مجاني" },
];

export function LandingActivityMarquee() {
  const { t } = useLocale();
  const items = [...SAMPLE_EVENTS, ...SAMPLE_EVENTS];

  return (
    <div className="overflow-hidden border-b border-gold-4/15 bg-void/60 py-2.5">
      <div className="landing-marquee-track gap-8 px-4 text-xs text-dim">
        {items.map((item, i) => (
          <span key={`${item.city}-${i}`} className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap">
            <span className="h-1 w-1 rounded-full bg-gold-2" />
            <span className="text-gold-1">{item.city}</span>
            <span>—</span>
            <span>{item.action === "استرداد" ? t("landing.marquee.redeemed") : t("landing.marquee.newCampaign")}</span>
            <span className="text-warm-white">{item.prize}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
