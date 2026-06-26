import { SkeletonCard } from "@/components/ui/SkeletonCard";

export default function MarketplaceLoading() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8">
      <div className="h-10 animate-pulse rounded-xl bg-gold-2/10" />
      <div className="sticky top-0 h-14 animate-pulse rounded-xl bg-surface-elevated/50" />
      <div className="grid gap-4 sm:grid-cols-2">
        {[0, 1, 2, 3].map((i) => (
          <SkeletonCard key={i} className="min-h-[140px]" />
        ))}
      </div>
    </div>
  );
}
