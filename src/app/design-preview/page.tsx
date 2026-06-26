"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { SparkPulseCard } from "@/components/ui/SparkPulseCard";
import { EnergyRing } from "@/components/ui/EnergyRing";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { CopyableField } from "@/components/ui/CopyableField";
import { ProofConfidencePanel } from "@/components/wallet/ProofConfidencePanel";
import { AdminPreviewPanel } from "@/components/design-preview/AdminPreviewPanel";
import { BlackGoldPreviewPanel } from "@/components/design-preview/BlackGoldPreviewPanel";
import { CreatorsPreviewPanel } from "@/components/design-preview/CreatorsPreviewPanel";
import { DesignPreviewShell } from "@/components/design-preview/DesignPreviewShell";
import { LandingPreviewPanel } from "@/components/design-preview/LandingPreviewPanel";
import { useMotionSafe } from "@/lib/motion/useMotionSafe";
import { duration, easeGold } from "@/lib/motion/tokens";
import { n, spark } from "@/lib/format";
import { TOKENS } from "@/styles/tokens";

const DEMO_TRANSFER = {
  transferMethod: "ShamCash",
  transferAccount: "+963900000000",
  transferInstructions: "تعليمات تجريبية للمعاينة",
};

function TokensPanel() {
  const swatches = [
    { name: "gold-1", color: TOKENS.color.gold1 },
    { name: "success", color: TOKENS.color.success },
    { name: "warning", color: TOKENS.color.warning },
    { name: "danger", color: TOKENS.color.danger },
    { name: "info", color: TOKENS.color.info },
  ];

  return (
    <section className="space-y-6">
      <h2 className={TOKENS.type.cardTitle + " text-warm-white"}>Color scales</h2>
      <div className="flex flex-wrap gap-3">
        {swatches.map((s) => (
          <div key={s.name} className="text-center">
            <div
              className="h-12 w-12 rounded-lg border border-gold-4/20"
              style={{ background: s.color }}
            />
            <p className="mt-1 text-xs text-dim">{s.name}</p>
          </div>
        ))}
      </div>
      <h2 className={TOKENS.type.cardTitle + " text-warm-white"}>Typography</h2>
      <p className={TOKENS.type.h1 + " text-warm-white"}>عنوان H1</p>
      <p className={TOKENS.type.body + " text-dim"}>نص عربي — line-height 1.65</p>
      <p className={TOKENS.type.mono + " text-gold-1 text-2xl"}>{n(1234)}</p>
    </section>
  );
}

function ComponentsPanel() {
  return (
    <section className="space-y-8">
      <div>
        <h2 className="mb-3 text-warm-white">Buttons</h2>
        <div className="flex flex-wrap gap-3">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
      </div>
      <div>
        <h2 className="mb-3 text-warm-white">Cards</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <GlassCard elevation={1}>
            <p className="text-warm-white">Glass L1</p>
          </GlassCard>
          <GlassCard elevation={2}>
            <p className="text-gold-1">Glass L2 featured</p>
          </GlassCard>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <SparkPulseCard label="KPI" value={spark(5000)} pulse />
        <EnergyRing value={7} max={10} />
      </div>
      <div className="flex flex-wrap gap-2">
        <StatusBadge status="pending" />
        <StatusBadge status="approved" />
        <StatusBadge status="rejected" />
        <StatusBadge status="live" />
      </div>
      <CopyableField label="حساب تجريبي" value="+963900000000" />
      <ProofConfidencePanel settings={DEMO_TRANSFER} />
    </section>
  );
}

function MotionPanel() {
  const motionOk = useMotionSafe();
  return (
    <section className="space-y-4">
      <p className="text-sm text-dim">
        Durations: instant {duration.instant}s · fast {duration.fast}s · normal{" "}
        {duration.normal}s
      </p>
      <motion.div
        className="rounded-xl border border-gold-4/30 bg-surface-2 p-6 text-center text-gold-1"
        initial={motionOk ? { opacity: 0, y: 16 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: duration.normal, ease: easeGold }}
      >
        fadeUp sample
      </motion.div>
      <p className="text-xs text-dim">
        Do: transform + opacity only. Don&apos;t: animate width/height on lists.
      </p>
    </section>
  );
}

function RolesPanel() {
  const roles = [
    { name: "Creator", accent: "Gold CTAs — momentum" },
    { name: "Sponsor", accent: "Gold + info charts — ROI" },
    { name: "Admin", accent: "Status colors — control" },
    { name: "Redeem", accent: "Single column — speed" },
  ];
  return (
    <section className="grid gap-4 sm:grid-cols-2">
      {roles.map((r) => (
        <GlassCard key={r.name} innerClassName="p-4">
          <p className="font-semibold text-gold-1">{r.name}</p>
          <p className="mt-1 text-sm text-dim">{r.accent}</p>
        </GlassCard>
      ))}
    </section>
  );
}

function A11yPanel() {
  return (
    <section className="space-y-4 text-sm text-dim">
      <ul className="list-inside list-disc space-y-2">
        <li>RTL-first: use ps/pe/ms/me logical properties</li>
        <li>Finance: Latin digits via n() / spark() — example: {spark(9999)}</li>
        <li>Focus: .focus-ring on interactive elements</li>
        <li>Contrast: warm-white on void ~15:1</li>
        <li>Errors: what happened + what to do</li>
      </ul>
      <Button className="focus-ring">Focus me (Tab)</Button>
    </section>
  );
}

export default function DesignPreviewPage() {
  return (
    <DesignPreviewShell
      tokens={<TokensPanel />}
      components={<ComponentsPanel />}
      motion={<MotionPanel />}
      roles={<RolesPanel />}
      a11y={<A11yPanel />}
      landing={<LandingPreviewPanel />}
      blackgold={<BlackGoldPreviewPanel />}
      creators={<CreatorsPreviewPanel />}
      admin={<AdminPreviewPanel />}
    />
  );
}
