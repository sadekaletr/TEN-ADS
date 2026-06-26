import { Skeleton, SkeletonCard, SkeletonKpiGrid, SkeletonTable } from "@/components/ui/SkeletonCard";

export default function SponsorLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48" />
      <SkeletonKpiGrid />
      <div className="grid gap-4 lg:grid-cols-2">
        <SkeletonCard className="min-h-[180px]" />
        <SkeletonCard className="min-h-[180px]" />
      </div>
      <SkeletonTable rows={5} />
    </div>
  );
}
