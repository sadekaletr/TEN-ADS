import { Skeleton, SkeletonCard, SkeletonKpiGrid } from "@/components/ui/SkeletonCard";

export default function AgencyLoading() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
      <Skeleton className="h-8 w-52" />
      <SkeletonKpiGrid />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <SkeletonCard key={i} className="min-h-[120px]" />
        ))}
      </div>
    </div>
  );
}
