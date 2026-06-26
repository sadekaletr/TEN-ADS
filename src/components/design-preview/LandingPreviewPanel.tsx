"use client";

import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { Display, Lead } from "@/components/ui/Typography";
import { TOKENS } from "@/styles/tokens";
import { LANDING_EVENT_NAMES } from "@/lib/analytics/landing-event-names";

const HERO_VARIANTS = [
  {
    id: "control",
    title: "Control",
    headline: "حوّل متابعينك إلى عملاء حقيقيين",
    primary: "ابدأ كصانع محتوى → /login",
    secondary: "أنا تاجر → /sponsor/login",
    tertiary: "شاهد كيف يعمل → /#product-film",
  },
  {
    id: "variant_a",
    title: "Variant A — proof-oriented",
    headline: "حوّل متابعينك إلى زيارات للمتجر",
    primary: "ابدأ حملتك الآن",
    secondary: "أطلق كراعٍ",
    tertiary: "شاهد تجربة الاسترداد",
  },
  {
    id: "variant_b",
    title: "Variant B — demo-forward",
    headline: "اختبر رحلة الاسترداد الحية",
    primary: "ابدأ كصانع محتوى",
    secondary: "أنا تاجر",
    tertiary: "جرّب الكود التجريبي (secondary style)",
  },
] as const;

const EVENT_TRIGGERS: { event: string; trigger: string }[] = [
  { event: "landing_view", trigger: "Page mount (LandingAnalyticsProvider)" },
  { event: "landing_scroll_25|50|75|100", trigger: "Scroll milestones (once each)" },
  { event: "landing_cta_creator_click", trigger: "Hero / nav / final CTA — creator" },
  { event: "landing_cta_sponsor_click", trigger: "Hero / nav — sponsor" },
  { event: "landing_demo_click", trigger: "Hero demo CTA / demo section link" },
  { event: "landing_final_cta_click", trigger: "Final CTA block" },
  { event: "landing_faq_expand", trigger: "FAQ accordion open" },
  { event: "landing_nav_login_click", trigger: "Nav primary login" },
];

export function LandingPreviewPanel() {
  return (
    <section className="space-y-10">
      <div>
        <h2 className={`${TOKENS.type.cardTitle} text-warm-white`}>Hero variants</h2>
        <p className="mt-1 text-sm text-dim">
          Set NEXT_PUBLIC_LANDING_EXPERIMENT=control|variant_a|variant_b
        </p>
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          {HERO_VARIANTS.map((v) => (
            <GlassCard key={v.id} innerClassName="p-4 space-y-3">
              <p className="text-xs font-mono text-gold-2">{v.id}</p>
              <p className="text-sm font-semibold text-warm-white">{v.title}</p>
              <Display className="text-lg text-gold-1">{v.headline}</Display>
              <div className="space-y-2 text-xs text-dim">
                <p>
                  <span className="text-gold-2">Primary:</span> {v.primary}
                </p>
                <p>
                  <span className="text-info">Secondary:</span> {v.secondary}
                </p>
                <p>
                  <span className="text-dim">Tertiary:</span> {v.tertiary}
                </p>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      <div>
        <h2 className={`${TOKENS.type.cardTitle} text-warm-white`}>CTA hierarchy legend</h2>
        <div className="mt-3 flex flex-wrap gap-3">
          <Button size="sm">Primary — creator</Button>
          <Button size="sm" variant="secondary">
            Secondary — sponsor
          </Button>
          <Button size="sm" variant="ghost">
            Tertiary — demo
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <GlassCard innerClassName="p-4">
          <p className="font-semibold text-gold-1">Trust — loaded</p>
          <p className="mt-2 font-mono text-2xl text-warm-white">12</p>
          <p className="text-xs text-dimmer">آخر تحديث: 2026-06-24</p>
        </GlassCard>
        <GlassCard innerClassName="p-4">
          <p className="font-semibold text-dim">Trust — empty sponsors</p>
          <Lead className="mt-2 text-sm text-dimmer">Logo strip hidden when no sponsors</Lead>
        </GlassCard>
      </div>

      <div>
        <h2 className={`${TOKENS.type.cardTitle} text-warm-white`}>FAQ states</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <GlassCard innerClassName="p-4">
            <p className="font-medium text-warm-white">Open</p>
            <p className="mt-2 text-sm text-dim">Answer visible · aria-expanded=true</p>
          </GlassCard>
          <GlassCard innerClassName="p-4">
            <p className="font-medium text-dim">Closed</p>
            <p className="mt-2 text-sm text-dimmer">Answer hidden · aria-expanded=false</p>
          </GlassCard>
        </div>
      </div>

      <div>
        <h2 className={`${TOKENS.type.cardTitle} text-warm-white`}>Event → trigger mapping</h2>
        <div className="mt-3 overflow-x-auto rounded-xl border border-gold-4/20">
          <table className="w-full text-start text-sm">
            <thead>
              <tr className="border-b border-gold-4/15 text-dim">
                <th className="p-3">Event</th>
                <th className="p-3">Trigger</th>
              </tr>
            </thead>
            <tbody>
              {EVENT_TRIGGERS.map((row) => (
                <tr key={row.event} className="border-b border-gold-4/10">
                  <td className="p-3 font-mono text-xs text-gold-2">{row.event}</td>
                  <td className="p-3 text-dim">{row.trigger}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-dimmer">
          Registered events: {LANDING_EVENT_NAMES.join(", ")}
        </p>
      </div>
    </section>
  );
}
