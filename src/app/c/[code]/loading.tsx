import { SkeletonCard } from "@/components/ui/SkeletonCard";

export default function CodeRedeemLoading() {
  return (
    <main className="redeem-safe mx-auto flex min-h-dvh max-w-md flex-col items-center px-4 py-8 pb-safe">
      <div className="mb-8 h-9 w-[140px] animate-pulse rounded bg-gold-4/15" />
      <div className="flex w-full max-w-sm justify-between gap-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-1 flex-col items-center gap-2">
            <div className="h-7 w-7 animate-pulse rounded-full bg-gold-4/15" />
            <div className="h-2 w-10 animate-pulse rounded bg-gold-4/10" />
          </div>
        ))}
      </div>
      <SkeletonCard className="mt-8 w-full min-h-[280px]" />
      <div className="mt-6 h-12 w-full max-w-sm animate-pulse rounded-xl bg-gold-4/15" />
    </main>
  );
}
