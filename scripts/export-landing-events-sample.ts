/**
 * Export recent LandingEvent rows for launch evidence.
 * Usage: npx tsx scripts/export-landing-events-sample.ts
 */
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { prisma } from "../src/lib/prisma";

async function main() {
  const events = await prisma.landingEvent.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      name: true,
      locale: true,
      dir: true,
      section: true,
      ctaLabel: true,
      experiment: true,
      createdAt: true,
    },
  });

  const counts = await prisma.landingEvent.groupBy({
    by: ["name"],
    _count: { name: true },
    orderBy: { _count: { name: "desc" } },
  });

  const out = {
    exportedAt: new Date().toISOString(),
    totalSampled: events.length,
    countsByName: Object.fromEntries(counts.map((c) => [c.name, c._count.name])),
    events: events.map((e) => ({
      ...e,
      createdAt: e.createdAt.toISOString(),
    })),
    queryTemplate: {
      demoRate:
        "SELECT COUNT(*) FILTER (WHERE name = 'landing_demo_click')::float / NULLIF(COUNT(*) FILTER (WHERE name = 'landing_view'), 0) FROM \"LandingEvent\" WHERE \"createdAt\" >= NOW() - INTERVAL '7 days'",
    },
  };

  const outDir = path.join(process.cwd(), "docs", "launch-evidence");
  await mkdir(outDir, { recursive: true });
  const outPath = path.join(outDir, "BF-events-sample.json");
  await writeFile(outPath, JSON.stringify(out, null, 2));
  console.log(`Wrote ${outPath} (${events.length} events)`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
