interface CityBreakdownProps {
  cities: { city: string; count: number }[];
}

export function CityBreakdown({ cities }: CityBreakdownProps) {
  if (cities.length === 0) {
    return <p className="text-sm text-dimmer">لا توجد بيانات مدن بعد</p>;
  }

  const max = Math.max(...cities.map((c) => c.count), 1);

  return (
    <div className="space-y-2">
      {cities.slice(0, 6).map((c) => (
        <div key={c.city} className="flex items-center gap-3">
          <span className="w-20 truncate text-sm text-dim">{c.city}</span>
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-2">
            <div
              className="h-full rounded-full bg-gold-3"
              style={{ width: `${(c.count / max) * 100}%` }}
            />
          </div>
          <span className="font-mono text-xs text-gold-1">{c.count}</span>
        </div>
      ))}
    </div>
  );
}
