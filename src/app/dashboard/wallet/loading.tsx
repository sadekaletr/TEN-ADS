import { Skeleton, SkeletonCard, SkeletonKpiGrid, SkeletonTable } from "@/components/ui/SkeletonCard";

export default function WalletLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48" />
      <SkeletonCard className="min-h-[140px]" />
      <SkeletonKpiGrid />
      <SkeletonTable rows={5} />
    </div>
  );
}
