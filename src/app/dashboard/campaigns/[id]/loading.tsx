import { Skeleton, SkeletonCard, SkeletonKpiGrid } from "@/components/ui/SkeletonCard";

export default function CampaignDetailLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-56" />
      <Skeleton className="h-4 w-72 max-w-full" />
      <SkeletonKpiGrid />
      <div className="grid gap-4 lg:grid-cols-2">
        <SkeletonCard className="min-h-[200px]" />
        <SkeletonCard className="min-h-[200px]" />
      </div>
      <SkeletonCard className="min-h-[160px]" />
    </div>
  );
}
