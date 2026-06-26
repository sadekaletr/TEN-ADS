import { CreatorCardSkeleton } from "@/components/creators/CreatorCardSkeleton";

export default function CreatorsLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
      <div className="mb-10 h-48 animate-pulse rounded-2xl border border-gold-4/15 bg-surface-2" />
      <div className="mb-6 h-10 w-full max-w-md animate-pulse rounded-lg bg-gold-4/10" />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <CreatorCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
