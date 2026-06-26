import { SkeletonCard } from "@/components/ui/SkeletonCard";

export default function CampaignLoading() {
  return (
    <main className="mx-auto max-w-3xl space-y-4 px-4 py-10">
      <SkeletonCard className="h-48 w-full" />
      <SkeletonCard className="h-32 w-full" />
    </main>
  );
}
