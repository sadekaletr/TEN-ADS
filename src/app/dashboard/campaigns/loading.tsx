import { Skeleton, SkeletonTable } from "@/components/ui/SkeletonCard";

export default function CampaignsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-10 w-36 rounded-xl" />
      </div>
      <SkeletonTable rows={6} />
    </div>
  );
}
