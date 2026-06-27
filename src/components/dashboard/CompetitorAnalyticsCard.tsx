import { CircuitCard } from "@/components/ui/CircuitCard";
import { Button } from "@/components/ui/Button";
import { getSectorBenchmarks } from "@/lib/intelligence/sector-benchmarks";

export async function CompetitorAnalyticsCard({ creatorId }: { creatorId: string }) {
  const benchmarks = await getSectorBenchmarks(creatorId);

  if (!benchmarks.length) {
    return (
      <CircuitCard className="mt-6">
        <h2 className="font-brand text-lg text-gold-1">تحليلات المنافسين (مجهولة)</h2>
        <p className="mt-2 text-sm text-dim">لا توجد بيانات كافية بعد — أطلق حملات أكثر لرؤية المعايير.</p>
      </CircuitCard>
    );
  }

  return (
    <CircuitCard className="mt-6 space-y-4">
      <div>
        <h2 className="font-brand text-lg text-gold-1">تحليلات المنافسين (مجهولة)</h2>
        <p className="mt-1 text-xs text-dim">متوسطات قطاعية مجمّعة — لا تُكشف هويات أخرى</p>
      </div>
      <ul className="space-y-3">
        {benchmarks.map((b) => (
          <li
            key={b.sector}
            className="flex items-center justify-between rounded-lg border border-gold-4/20 px-3 py-2 text-sm"
          >
            <span className="text-dim">{b.sectorLabel}</span>
            <span className="font-mono text-gold-2">{(b.avgConversion * 100).toFixed(1)}% تحويل</span>
          </li>
        ))}
      </ul>
      <Button href="/intelligence/heatmap" variant="secondary" size="sm">
        خريطة حرارية تفصيلية
      </Button>
    </CircuitCard>
  );
}
