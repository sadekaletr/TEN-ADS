import { prisma } from "@/lib/prisma";
import { notDeleted } from "@/lib/db";

/** Search creators/campaigns — uses Meilisearch when configured, else Prisma fallback. */
export async function searchCreators(query: string, limit = 20) {
  const q = query.trim();
  if (!q) return [];

  const meiliHost = process.env.MEILISEARCH_HOST;
  const meiliKey = process.env.MEILISEARCH_API_KEY;
  if (meiliHost && meiliKey) {
    try {
      const res = await fetch(`${meiliHost}/indexes/creators/search`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${meiliKey}`,
        },
        body: JSON.stringify({ q, limit }),
      });
      if (res.ok) {
        const data = (await res.json()) as { hits?: { id: string }[] };
        const ids = (data.hits ?? []).map((h) => h.id);
        if (ids.length) {
          return prisma.creator.findMany({
            where: { id: { in: ids }, ...notDeleted },
            select: { id: true, name: true, handle: true, avatarUrl: true, verified: true },
          });
        }
      }
    } catch {
      // fall through to Prisma
    }
  }

  return prisma.creator.findMany({
    where: {
      ...notDeleted,
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { handle: { contains: q.replace(/^@/, ""), mode: "insensitive" } },
      ],
    },
    select: { id: true, name: true, handle: true, avatarUrl: true, verified: true },
    take: limit,
  });
}
