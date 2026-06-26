import { Skeleton, SkeletonCard, SkeletonKpiGrid } from "@/components/ui/SkeletonCard";

export default function AgencyDashboardLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-56" />
      <SkeletonKpiGrid />
      <div className="grid gap-4 sm:grid-cols-2">
        {[0, 1, 2, 3].map((i) => (
          <SkeletonCard key={i} className="min-h-[100px]" />
        ))}
      </div>
    </div>
  );
}
