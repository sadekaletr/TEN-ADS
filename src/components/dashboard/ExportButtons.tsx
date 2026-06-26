"use client";

import { useState } from "react";
import type { Campaign, Redemption, Sponsor } from "@prisma/client";
import type { CampaignTier } from "@prisma/client";
import { allowsPdfExport } from "@/lib/campaign-tiers";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

interface ExportButtonsProps {
  campaign: Campaign & { sponsor: Sponsor };
  redemptions: Redemption[];
}

export function ExportButtons({ campaign, redemptions }: ExportButtonsProps) {
  const [copied, setCopied] = useState(false);
  const tier = (campaign.tier ?? "BASIC") as CampaignTier;
  const pdfAllowed = allowsPdfExport(tier);

  function downloadCsv() {
    const header = "الاسم,الهاتف,العنوان,المدينة,الكود,التاريخ";
    const rows = redemptions.map((r) =>
      [r.fullName, r.phone, r.address ?? "", r.city ?? "", r.codeUsed, r.createdAt]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(",")
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `spark-${campaign.id.slice(0, 8)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function downloadPdf() {
    if (!pdfAllowed) return;
    window.open(`/api/export/pdf?campaignId=${campaign.id}`, "_blank");
  }

  async function copyWhatsApp() {
    const lines = [
      `قائمة فائزين — ${campaign.title}`,
      `الراعي: ${campaign.sponsor.name}`,
      "",
      ...redemptions.map(
        (r, i) =>
          `${i + 1}. ${r.fullName} — ${r.phone}${r.city ? ` — ${r.city}` : ""}`
      ),
    ];
    await navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={downloadPdf}
        disabled={!pdfAllowed}
        icon={!pdfAllowed ? <Icon name="lock" size={14} /> : undefined}
        title={pdfAllowed ? undefined : "متاح من مستوى محترف فما فوق"}
      >
        {pdfAllowed ? "تصدير PDF للطباعة" : "تصدير PDF (محترف+)"}
      </Button>
      <Button type="button" variant="secondary" size="sm" onClick={downloadCsv}>
        تصدير Excel
      </Button>
      <Button type="button" variant="secondary" size="sm" onClick={copyWhatsApp}>
        {copied ? "تم النسخ" : "نسخ كرسالة واتساب"}
      </Button>
    </div>
  );
}
