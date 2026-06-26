import { CreatorsPageClient } from "@/components/creators/CreatorsPageClient";
import { PublicShell } from "@/components/layout/PublicShell";import {
  getCreatorsPageStats,
  getFeaturedCreators,
} from "@/lib/creators/getFeaturedCreators";

export const metadata = {
  title: "الصناع — TENEGTA Spark",
  description: "اكتشف صناع المحتوى الموثّقين وحملاتهم النشطة على TENEGTA Spark",
};

export default async function CreatorsPage() {
  const [{ spotlight, grid }, stats] = await Promise.all([
    getFeaturedCreators(),
    getCreatorsPageStats(),
  ]);

  return (
    <PublicShell analytics={false}>
      <CreatorsPageClient        spotlight={spotlight}
        grid={grid}
        stats={{
          activeCampaigns: stats.activeCampaigns,
          weeklyRedemptions: stats.weeklyRedemptions,
        }}
      />
    </PublicShell>
  );
}