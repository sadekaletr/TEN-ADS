"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { useLocale } from "@/lib/i18n";
import { LandingScrollReveal } from "@/components/landing/LandingScrollReveal";
import { trackLandingEvent } from "@/lib/analytics/landing-events";
import { suggestCampaignFromText, type CopilotSuggestion } from "@/lib/intelligence/copilot-heuristics";
import { LANDING_DEMO_CODE, LANDING_DEMO_QR_URL } from "@/lib/landing/demo-constants";
import { DEMO_CAMPAIGN } from "@/lib/landing/demo-mock";
import { RewardReveal } from "@/components/redeem/RewardReveal";
import { cn } from "@/lib/utils";
import { transition } from "@/lib/motion/tokens";

const TABS = ["create", "share", "reveal"] as const;
type DemoTabId = (typeof TABS)[number];

function DemoTab({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-4 py-2.5 text-sm font-medium transition-colors min-h-11",
        active
          ? "border-strong bg-bg-surface text-text-primary shadow-surface"
          : "border-subtle text-text-secondary hover:border-default hover:text-text-primary"
      )}
    >
      {children}
    </button>
  );
}

function PhoneFrame({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[280px] overflow-hidden rounded-[2rem] border-4 border-bg-elevated bg-bg-base shadow-elevated",
        className
      )}
    >
      <div className="flex items-center justify-center gap-1 border-b border-subtle bg-bg-surface py-2">
        <span className="h-1 w-8 rounded-full bg-text-muted/40" />
      </div>
      <div className="min-h-[320px] bg-bg-surface p-4">{children}</div>
    </div>
  );
}

function DemoCreatePanel() {
  const { t } = useLocale();
  const [input, setInput] = useState("");
  const [result, setResult] = useState<CopilotSuggestion | null>(null);
  const [loading, setLoading] = useState(false);

  function handleSuggest() {
    if (!input.trim()) return;
    setLoading(true);
    trackLandingEvent("landing_demo_tab_create", { section: "interactive-demo" });
    const suggestion = suggestCampaignFromText(input.trim(), { city: "دمشق" });
    setResult(suggestion);
    setLoading(false);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div>
        <label htmlFor="demo-copilot" className="mb-2 block text-sm font-medium text-text-primary">
          {t("landing.demo.create.label")}
        </label>
        <textarea
          id="demo-copilot"
          rows={4}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t("landing.demo.create.placeholder")}
          className="w-full rounded-xl border border-subtle bg-bg-elevated px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:border-strong focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
        />
        <Button
          type="button"
          className="mt-4 min-h-11"
          glow
          disabled={loading || !input.trim()}
          onClick={handleSuggest}
          icon={<Icon name="spark" size={18} />}
        >
          {t("landing.demo.create.cta")}
        </Button>
      </div>
      {result && (
        <div className="rounded-xl border border-strong bg-gold-rich/5 p-5 shadow-surface">
          <p className="text-xs font-medium uppercase tracking-wider text-gold-accent">
            {t("landing.demo.create.resultLabel")}
          </p>
          <h3 className="mt-2 font-brand text-lg text-text-primary">{result.title}</h3>
          <p className="mt-2 whitespace-pre-line text-sm text-text-secondary">{result.storyText}</p>
          <dl className="mt-4 grid grid-cols-2 gap-2 text-xs text-text-secondary">
            <div>
              <dt>{t("landing.demo.create.prize")}</dt>
              <dd className="font-medium text-text-primary">{result.prizeName}</dd>
            </div>
            <div>
              <dt>{t("landing.demo.create.quantity")}</dt>
              <dd className="font-medium text-text-primary">{result.suggestedQuantity}</dd>
            </div>
          </dl>
        </div>
      )}
    </div>
  );
}

function DemoSharePanel() {
  const { t } = useLocale();
  const reducedMotion = useReducedMotion();
  const [step, setStep] = useState<"creator" | "follower">("creator");

  function showFollower() {
    trackLandingEvent("landing_demo_tab_share", { section: "interactive-demo" });
    setStep("follower");
  }

  return (
    <div className="flex flex-col items-center gap-8 md:flex-row md:justify-center">
      <PhoneFrame>
        <motion.div
          key={step}
          initial={reducedMotion ? false : { opacity: 0, x: step === "follower" ? 24 : -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={transition.fast}
        >
          {step === "creator" ? (
            <>
              <p className="text-xs text-text-tertiary">{t("landing.demo.share.creatorScreen")}</p>
              <p className="mt-3 rounded-lg bg-bg-elevated p-3 text-sm text-text-primary">
                {t("landing.demo.share.storyText")}
              </p>
              <p className="mt-3 font-mono text-lg text-gold-accent">{LANDING_DEMO_CODE}</p>
              <Button type="button" size="sm" className="mt-4 min-h-10 w-full" onClick={showFollower}>
                {t("landing.demo.share.next")}
              </Button>
            </>
          ) : (
            <>
              <p className="text-xs text-text-tertiary">{t("landing.demo.share.followerScreen")}</p>
              <div className="mt-4 flex justify-center rounded-xl border border-subtle bg-white p-3">
                <Image
                  src={LANDING_DEMO_QR_URL}
                  alt="QR"
                  width={160}
                  height={160}
                  unoptimized
                  className="h-40 w-40"
                />
              </div>
              <p className="mt-3 text-center font-mono text-sm text-gold-accent">{LANDING_DEMO_CODE}</p>
            </>
          )}
        </motion.div>
      </PhoneFrame>
      <p className="max-w-xs text-center text-sm text-text-secondary md:text-start">
        {t("landing.demo.share.hint")}
      </p>
    </div>
  );
}

function DemoRevealPanel() {
  const { t } = useLocale();
  const [started, setStarted] = useState(false);

  return (
    <div className="flex flex-col items-center gap-6">
      {!started ? (
        <Button
          type="button"
          size="lg"
          glow
          className="min-h-12"
          icon={<Icon name="gift" size={20} />}
          onClick={() => {
            trackLandingEvent("landing_demo_tab_reveal", { section: "interactive-demo" });
            setStarted(true);
          }}
        >
          {t("landing.demo.reveal.cta")}
        </Button>
      ) : (
        <PhoneFrame className="max-w-md">
          <div className="scale-[0.85] origin-top">
            <RewardReveal
              campaign={DEMO_CAMPAIGN}
              prizeName={DEMO_CAMPAIGN.prizeName}
              reference="DEMO-REF-001"
              qrCode={LANDING_DEMO_CODE}
              revealStyle="CLASSIC_GOLD"
            />
          </div>
        </PhoneFrame>
      )}
    </div>
  );
}

export function LandingInteractiveDemo() {
  const { t } = useLocale();
  const [tab, setTab] = useState<DemoTabId>("create");

  return (
    <Section id="product-film">
      <LandingScrollReveal>
        <SectionHeader
          title={t("landing.demo.title")}
          description={t("landing.demo.subtitle")}
          centered
        />
      </LandingScrollReveal>

      <LandingScrollReveal delay={0.06}>
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {TABS.map((key) => (
            <DemoTab key={key} active={tab === key} onClick={() => setTab(key)}>
              {t(`landing.demo.tabs.${key}`)}
            </DemoTab>
          ))}
        </div>
      </LandingScrollReveal>

      <LandingScrollReveal delay={0.1}>
        <div className="mx-auto mt-8 max-w-4xl overflow-hidden rounded-2xl border border-strong bg-bg-surface p-6 shadow-elevated md:p-8">
          {tab === "create" && <DemoCreatePanel />}
          {tab === "share" && <DemoSharePanel />}
          {tab === "reveal" && <DemoRevealPanel />}
        </div>
      </LandingScrollReveal>
    </Section>
  );
}
