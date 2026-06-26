interface DeviceItem {
  device: string;
  count: number;
}

export function DeviceBreakdown({ devices }: { devices: DeviceItem[] }) {
  if (devices.length === 0) {
    return <p className="text-sm text-dim">لا توجد بيانات أجهزة بعد</p>;
  }

  const max = Math.max(...devices.map((d) => d.count), 1);
  const labels: Record<string, string> = {
    mobile: "موبايل",
    desktop: "كمبيوتر",
    tablet: "تابلت",
    unknown: "غير معروف",
  };

  return (
    <div className="space-y-2">
      {devices.map((d) => (
        <div key={d.device}>
          <div className="mb-1 flex justify-between text-xs">
            <span className="text-dim">{labels[d.device] ?? d.device}</span>
            <span className="font-mono text-gold-2">{d.count}</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded bg-surface-2">
            <div
              className="h-full rounded bg-gold-2/70 transition-all"
              style={{ width: `${(d.count / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
