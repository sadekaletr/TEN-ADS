"use client";

import { CommandKPICluster } from "@/components/ui/CommandKPICluster";
import { ConversionRail } from "@/components/ui/ConversionRail";
import { DataDepthCard } from "@/components/ui/DataDepthCard";
import { DataTable } from "@/components/ui/DataTable";
import { EnergyRingV2 } from "@/components/ui/EnergyRingV2";
import { HeroSpotlightPanel } from "@/components/ui/HeroSpotlightPanel";
import { LiveSignalTicker } from "@/components/ui/LiveSignalTicker";
import { MagneticPrimaryCTA } from "@/components/ui/MagneticPrimaryCTA";
import { SectionCinematicDivider } from "@/components/ui/SectionCinematicDivider";
import { SmartFileDropzone } from "@/components/ui/SmartFileDropzone";
import { StatusPillPro } from "@/components/ui/StatusPillPro";
import { TrustProofUploader } from "@/components/ui/TrustProofUploader";
import { FunnelKpiStrip } from "@/components/ui/FunnelKpiStrip";
import { StepProgressRail } from "@/components/ui/StepProgressRail";
import { RoiNarrativeBlock } from "@/components/sponsor/RoiNarrativeBlock";
import { WalletConfidenceStrip } from "@/components/ui/WalletConfidenceStrip";
import { Icon } from "@/components/ui/Icon";
import { TOKENS } from "@/styles/tokens";

export function BlackGoldPreviewPanel() {
  return (
    <section className="space-y-10">
      <div>
        <h2 className={`${TOKENS.type.cardTitle} text-gold-1`}>Black Gold 2.0 — Surfaces</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "L0 void", bg: TOKENS.color.surfaceL0 },
            { label: "L1 surface", bg: TOKENS.color.surfaceL1 },
            { label: "L2 surface-2", bg: TOKENS.color.surfaceL2 },
            { label: "text-secondary", bg: TOKENS.color.textSecondary },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-lg border border-default p-3 text-center text-xs text-text-tertiary"
            >
              <div className="mb-2 h-10 rounded" style={{ background: s.bg }} />
              {s.label}
            </div>
          ))}
        </div>
      </div>

      <HeroSpotlightPanel
        title={
          <>
            عنوان <span className="text-gradient-gold">Spotlight</span>
          </>
        }
        subtitle="معاينة HeroSpotlightPanel"
      >
        <MagneticPrimaryCTA href="#" label="CTA بطولي" icon={<Icon name="rocket" size={18} />} />
      </HeroSpotlightPanel>

      <div className="grid gap-4 md:grid-cols-3">
        <DataDepthCard elevation={2} title="L2 data" value="1,234" />
        <DataDepthCard elevation={3} title="L3 glass" value="5,678" />
        <DataDepthCard elevation={4} featured title="L4 featured" value="9,012" />
      </div>

      <CommandKPICluster
        primary={{ label: "الرصيد", value: "12,500 Spark" }}
        secondary={[
          { label: "حملات", value: "3" },
          { label: "تحويل", value: "18%" },
        ]}
        primaryAction={{ href: "#", label: "حملة جديدة" }}
      />

      <FunnelKpiStrip views={1200} clicks={340} redemptions={89} />
      <StepProgressRail
        steps={[
          { id: "details", label: "بيانات" },
          { id: "proof", label: "إثبات" },
          { id: "confirm", label: "تأكيد" },
        ]}
        current="proof"
      />
      <RoiNarrativeBlock
        totalRedemptions={89}
        totalSparkCost={4450}
        costPerRedemption={50}
      />

      <WalletConfidenceStrip balance={12500} />
      <LiveSignalTicker items={[{ id: "1", label: "استرداد جديد — حملة Ramadan" }]} />
      <ConversionRail
        steps={[
          { id: "welcome", label: "ترحيب" },
          { id: "verify", label: "تحقق" },
          { id: "claim", label: "استلام" },
          { id: "reveal", label: "جائزة" },
        ]}
        current="verify"
      />

      <div className="grid gap-4 md:grid-cols-2">
        <SmartFileDropzone label="رفع ملف" onSelect={() => {}} />
        <TrustProofUploader onSelect={() => {}} />
      </div>

      <EnergyRingV2 value={7} max={10} label="ROI" />
      <SectionCinematicDivider title="فاصل سينمائي" />

      <div className="flex flex-wrap gap-2">
        <StatusPillPro status="pending" label="معلّق" />
        <StatusPillPro status="approved" label="معتمد" />
        <StatusPillPro status="urgent" label="عاجل" urgency />
      </div>

      <DataTable
        rows={[{ id: "1", name: "حملة تجريبية" }]}
        rowKey={(r) => r.id}
        columns={[
          { key: "name", header: "الاسم", cell: (r) => r.name },
        ]}
      />
    </section>
  );
}
