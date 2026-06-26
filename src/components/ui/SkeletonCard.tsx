import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-gold-2/10", className)}
      aria-hidden
    />
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={cn("rounded-2xl p-6 animate-pulse", className)}
      style={{
        background:
          "linear-gradient(135deg, rgba(212,168,85,0.04), rgba(13,12,9,0.95))",
        border: "1px solid rgba(212,168,85,0.1)",
      }}
      aria-hidden
    >
      <Skeleton className="mb-3 h-4 w-24" />
      <Skeleton className="mb-2 h-8 w-40" />
      <Skeleton className="h-3 w-32" />
    </div>
  );
}

export function SkeletonKpiGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {[0, 1, 2].map((i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonTable({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-3 rounded-2xl border border-gold-4/15 p-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex justify-between gap-4">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-16" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonHeatmap() {
  return (
    <div
      className="mt-8 aspect-[4/3] w-full animate-pulse rounded-2xl border border-gold-4/20"
      style={{
        background:
          "radial-gradient(ellipse at center, rgba(212,168,85,0.08), rgba(3,3,4,0.95))",
      }}
      aria-label="جاري التحميل"
    />
  );
}

export function DashboardLoadingSkeleton() {
  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8">
      <Skeleton className="h-8 w-56" />
      <div className="space-y-4">
        <SkeletonCard className="min-h-[160px]" />
        <div className="grid gap-3 sm:grid-cols-2">
          <SkeletonCard className="min-h-[88px]" />
          <SkeletonCard className="min-h-[88px]" />
        </div>
      </div>
      <Skeleton className="h-10 w-full max-w-xl rounded-xl" />
      <Skeleton className="h-12 w-full rounded-xl" />
      <div className="grid gap-6 lg:grid-cols-2">
        <SkeletonCard className="min-h-[220px]" />
        <SkeletonCard className="min-h-[280px]" />
      </div>
      <SkeletonTable rows={4} />
    </div>
  );
}

export function TopUpLoadingSkeleton() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Skeleton className="h-8 w-40" />
      <Skeleton className="h-12 w-full rounded-xl" />
      <div className="grid gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <SkeletonCard key={i} className="min-h-[280px]" />
        ))}
      </div>
      <SkeletonCard className="min-h-[120px]" />
    </div>
  );
}

export function SponsorRoiLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-56" />
      <SkeletonCard className="min-h-[100px]" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <SkeletonCard key={i} className="min-h-[120px]" />
        ))}
      </div>
      <SkeletonCard className="min-h-[140px]" />
      <SkeletonCard className="min-h-[200px]" />
    </div>
  );
}
