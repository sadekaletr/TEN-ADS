export function CreatorCardSkeleton() {
  return (
    <div
      className="animate-pulse overflow-hidden rounded-2xl border border-strong bg-bg-surface shadow-surface"
      aria-hidden
    >
      <div className="aspect-[4/5] bg-bg-elevated sm:aspect-[16/11]" />
      <div className="space-y-3 p-4 md:p-5">
        <div className="flex items-end gap-3">
          <div className="h-14 w-14 shrink-0 rounded-full border-2 border-strong bg-bg-elevated md:h-16 md:w-16" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-2/3 rounded-lg bg-bg-elevated" />
            <div className="h-3 w-1/3 rounded bg-bg-elevated/80" />
          </div>
          <div className="hidden h-10 w-10 rounded-full bg-bg-elevated sm:block" />
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="h-7 w-[4.5rem] rounded-lg bg-bg-elevated" />
          <div className="h-7 w-[4.5rem] rounded-lg bg-bg-elevated" />
          <div className="h-7 w-[4.5rem] rounded-lg bg-bg-elevated" />
        </div>
        <div className="flex gap-2 pt-1">
          <div className="h-9 w-24 rounded-lg bg-bg-elevated" />
          <div className="h-9 w-20 rounded-lg bg-bg-elevated/80" />
        </div>
      </div>
    </div>
  );
}
