"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SponsorCommandCenter } from "@/components/sponsor/SponsorCommandCenter";
import type { SponsorActivityItem, SponsorCommandCenterData } from "@/lib/sponsor/queries";
import { formatRelative } from "@/lib/format";
import type { ActivityFeedItem } from "@/components/experience/ActivityFeed";

interface SponsorCommandCenterClientProps {
  data: SponsorCommandCenterData;
  activity: SponsorActivityItem[];
  pollMs?: number;
}

function mapActivity(items: SponsorActivityItem[]): ActivityFeedItem[] {
  return items.map((item) => ({
    id: item.id,
    message: item.message,
    time: formatRelative(item.createdAt),
    kind: item.kind,
  }));
}

export function SponsorCommandCenterClient({
  data,
  activity,
  pollMs = 30_000,
}: SponsorCommandCenterClientProps) {
  const router = useRouter();

  useEffect(() => {
    const id = setInterval(() => router.refresh(), pollMs);
    return () => clearInterval(id);
  }, [router, pollMs]);

  return <SponsorCommandCenter data={data} activity={mapActivity(activity)} />;
}
