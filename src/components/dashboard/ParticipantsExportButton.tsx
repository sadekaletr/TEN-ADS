"use client";

import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

type Row = {
  id: string;
  fullName: string;
  phone: string;
  city: string | null;
  codeUsed: string;
  createdAt: Date;
};

export function ParticipantsExportButton({
  campaignTitle,
  redemptions,
}: {
  campaignTitle: string;
  redemptions: Row[];
}) {
  function download(format: "csv" | "json") {
    const payload = redemptions.map((r) => ({
      name: r.fullName,
      phone: r.phone,
      city: r.city,
      code: r.codeUsed,
      redeemedAt: r.createdAt.toISOString(),
    }));

    const filenameBase = campaignTitle.replace(/\s+/g, "-").slice(0, 40) || "winners";

    if (format === "json") {
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
      triggerDownload(blob, `${filenameBase}-winners.json`);
      return;
    }

    const header = "name,phone,city,code,redeemedAt";
    const lines = payload.map(
      (r) =>
        `"${r.name.replace(/"/g, '""')}","${r.phone}","${r.city ?? ""}","${r.code}","${r.redeemedAt}"`
    );
    const blob = new Blob([[header, ...lines].join("\n")], { type: "text/csv;charset=utf-8" });
    triggerDownload(blob, `${filenameBase}-winners.csv`);
  }

  return (
    <div className="mb-4 flex flex-wrap gap-2">
      <Button type="button" size="sm" variant="secondary" onClick={() => download("csv")}>
        <Icon name="upload" size={16} className="me-1" />
        تصدير CSV
      </Button>
      <Button type="button" size="sm" variant="ghost" onClick={() => download("json")}>
        JSON
      </Button>
    </div>
  );
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
