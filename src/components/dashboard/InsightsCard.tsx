interface InsightsProps {
  bestHour: number | null;
  bestCity: string | null;
  bestDevice: string | null;
  bestDeviceConversion: number;
}

export function InsightsCard({ insights }: { insights: InsightsProps }) {
  const items = [
    {
      label: "أفضل ساعة نشر",
      value:
        insights.bestHour !== null
          ? `${insights.bestHour}:00`
          : "—",
    },
    {
      label: "أفضل مدينة تحويل",
      value: insights.bestCity ?? "—",
    },
    {
      label: "أفضل جهاز",
      value: insights.bestDevice
        ? `${insights.bestDevice} (${Math.round(insights.bestDeviceConversion * 100)}%)`
        : "—",
    },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded border border-gold-4/20 bg-surface-2/50 px-3 py-2"
        >
          <p className="text-xs text-dim">{item.label}</p>
          <p className="mt-1 font-mono text-sm text-gold-1">{item.value}</p>
        </div>
      ))}
    </div>
  );
}
