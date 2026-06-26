import { cssTransition } from "@/lib/motion";

interface PeakHoursProps {
  peakHours: { hour: number; count: number }[];
}

export function PeakHours({ peakHours }: PeakHoursProps) {
  if (peakHours.length === 0) {
    return <p className="text-sm text-dimmer">لا توجد بيانات زمنية بعد</p>;
  }

  const max = Math.max(...peakHours.map((h) => h.count), 1);

  return (
    <div className="flex h-24 items-end gap-1">
      {Array.from({ length: 24 }, (_, hour) => {
        const data = peakHours.find((h) => h.hour === hour);
        const count = data?.count ?? 0;
        return (
          <div
            key={hour}
            className="flex-1 rounded-t bg-gold-2/60"
            style={{
              height: `${Math.max((count / max) * 100, 4)}%`,
              transition: cssTransition.bar,
            }}
            title={`${hour}:00 — ${count}`}
          />
        );
      })}
    </div>
  );
}
