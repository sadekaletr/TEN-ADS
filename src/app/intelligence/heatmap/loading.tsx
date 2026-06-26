import { SkeletonHeatmap } from "@/components/ui/SkeletonCard";

export default function HeatmapLoading() {
  return (
    <main className="mx-auto min-h-screen max-w-3xl px-4 py-10">
      <div className="h-8 w-48 animate-pulse rounded bg-gold-2/10" />
      <div className="mt-2 h-4 w-64 animate-pulse rounded bg-gold-2/8" />
      <SkeletonHeatmap />
    </main>
  );
}
