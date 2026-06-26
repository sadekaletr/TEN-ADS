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
      <Skeleton className="h-8 w-48" />
      <SkeletonKpiGrid />
      <SkeletonCard className="min-h-[180px]" />
      <div className="grid gap-4 lg:grid-cols-2">
        <SkeletonCard className="min-h-[200px]" />
        <SkeletonCard className="min-h-[200px]" />
      </div>
      <SkeletonTable />
    </div>
  );
}
