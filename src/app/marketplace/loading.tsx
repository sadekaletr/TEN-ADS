import { CreatorCardSkeleton } from "@/components/creators/CreatorCardSkeleton";

export default function MarketplaceLoading() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 md:px-6">
      <div className="h-11 animate-pulse rounded-xl bg-bg-elevated" />
      <div className="sticky top-0 space-y-3 rounded-2xl border border-strong bg-bg-surface p-4">
        <div className="h-12 animate-pulse rounded-xl bg-bg-elevated" />
        <div className="flex gap-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-9 w-16 animate-pulse rounded-full bg-bg-elevated" />
          ))}
        </div>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <CreatorCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
