import { SkeletonCard } from "@/components/ui/SkeletonCard";

export default function ShopLoading() {
  return (
    <main className="mx-auto max-w-4xl space-y-4 px-4 py-10">
      <SkeletonCard className="h-24 w-full" />
      <div className="grid gap-4 sm:grid-cols-2">
        <SkeletonCard className="h-40" />
        <SkeletonCard className="h-40" />
      </div>
    </main>
  );
}
