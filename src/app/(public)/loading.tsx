import { CreatorCardSkeleton } from "@/components/creators/CreatorCardSkeleton";
import { Skeleton } from "@/components/ui/SkeletonCard";

export default function PublicLoading() {
  return (
    <main className="mx-auto max-w-6xl space-y-8 px-4 py-10">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-4 w-80 max-w-full" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <CreatorCardSkeleton key={i} />
        ))}
      </div>
    </main>
  );
}
