"use client";

import { useState } from "react";
import { archiveCampaign } from "@/app/dashboard/actions";
import { useRouter } from "next/navigation";

interface ArchiveCampaignButtonProps {
  campaignId: string;
  title: string;
}

export function ArchiveCampaignButton({
  campaignId,
  title,
}: ArchiveCampaignButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleArchive() {
    if (
      !confirm(`هل تريد أرشفة الحملة "${title}"؟ لن تظهر في قائمتك بعد ذلك.`)
    ) {
      return;
    }
    setLoading(true);
    await archiveCampaign(campaignId);
    setLoading(false);
    router.push("/dashboard/campaigns");
    router.refresh();
  }

  return (
    <button
      onClick={handleArchive}
      disabled={loading}
      className="rounded border border-gold-4/30 px-3 py-1.5 text-sm text-dim hover:text-warm-white disabled:opacity-50"
    >
      {loading ? "جاري الأرشفة..." : "أرشفة الحملة"}
    </button>
  );
}
