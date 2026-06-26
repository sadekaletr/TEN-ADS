export function CreatorCardSkeleton() {
  return (
    <div
      className="animate-pulse overflow-hidden rounded-2xl border border-gold-4/15 bg-surface-2"
      aria-hidden
    >
      <div className="aspect-[16/11] bg-gold-4/10" />
      <div className="space-y-3 p-4">
        <div className="flex gap-3">
          <div className="h-14 w-14 rounded-full bg-gold-4/15" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-2/3 rounded bg-gold-4/15" />
            <div className="h-3 w-1/3 rounded bg-gold-4/10" />
          </div>
        </div>
        <div className="flex gap-2">
          <div className="h-6 w-16 rounded bg-gold-4/10" />
          <div className="h-6 w-16 rounded bg-gold-4/10" />
          <div className="h-6 w-16 rounded bg-gold-4/10" />
        </div>
      </div>
    </div>
  );
}
