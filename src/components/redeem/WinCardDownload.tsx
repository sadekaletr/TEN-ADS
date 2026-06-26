"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { generateWinCardBlob } from "@/lib/win-card/generate-win-card";

interface WinCardDownloadProps {
  prizeName: string;
  sponsorName: string;
  campaignTitle: string;
  campaignSlug?: string | null;
  qrCode?: string | null;
  reference: string;
}

export function WinCardDownload({
  prizeName,
  sponsorName,
  campaignTitle,
  campaignSlug,
  qrCode,
  reference,
}: WinCardDownloadProps) {
  const [loading, setLoading] = useState(false);

  async function handleDownload() {
    setLoading(true);
    try {
      const blob = await generateWinCardBlob({
        prizeName,
        sponsorName,
        campaignTitle,
        campaignSlug,
        qrCode,
        reference,
        format: "story",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `tenegta-win-${reference}.png`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button fullWidth variant="ghost" onClick={handleDownload} disabled={loading}>
      {loading ? "جاري التحضير..." : "حفظ بطاقة الفوز"}
    </Button>
  );
}
