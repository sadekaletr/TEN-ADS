import { Skeleton, SkeletonKpiGrid, SkeletonTable } from "@/components/ui/SkeletonCard";

export default function AdminLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-56" />
      <SkeletonKpiGrid />
      <SkeletonTable rows={8} />
    </div>
  );
}
