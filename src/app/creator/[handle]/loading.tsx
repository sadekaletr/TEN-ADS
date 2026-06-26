import { CreatorCardSkeleton } from "@/components/creators/CreatorCardSkeleton";

export default function CreatorPublicLoading() {
  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-12">
      <div className="overflow-hidden rounded-2xl border border-strong">
        <div className="aspect-[16/9] animate-pulse bg-bg-elevated" />
        <div className="space-y-3 p-5">
          <div className="mx-auto h-20 w-20 animate-pulse rounded-full bg-bg-elevated" />
          <div className="mx-auto h-5 w-40 animate-pulse rounded bg-bg-elevated" />
          <div className="mx-auto h-4 w-24 animate-pulse rounded bg-bg-elevated/80" />
        </div>
      </div>
      <div className="h-12 animate-pulse rounded-xl bg-bg-elevated" />
      <CreatorCardSkeleton />
    </div>
  );
}
