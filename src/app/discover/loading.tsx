import { SkeletonCard } from "@/components/ui/SkeletonCard";

export default function DiscoverLoading() {
  return (
    <main className="mx-auto max-w-4xl space-y-4 px-4 py-10">
      <SkeletonCard className="h-12 w-48" />
      <SkeletonCard className="h-64 w-full" />
    </main>
  );
}
