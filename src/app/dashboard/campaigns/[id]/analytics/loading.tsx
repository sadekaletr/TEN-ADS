import { SkeletonCard, SkeletonKpiGrid } from "@/components/ui/SkeletonCard";

export default function CampaignAnalyticsLoading() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        {[0, 1, 2, 3].map((i) => (
          <SkeletonCard key={i} className="min-h-[160px]" />
        ))}
      </div>
      <SkeletonKpiGrid />
    </div>
  );
}
