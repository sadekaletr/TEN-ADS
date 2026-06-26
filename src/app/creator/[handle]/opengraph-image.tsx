import { notDeleted } from "@/lib/db";
import { prisma } from "@/lib/prisma";
import { buildOgImage } from "@/lib/og-image";

export const runtime = "nodejs";
export const alt = "TENEGTA Spark Creator";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: { handle: string };
}) {
  const handle = params.handle.replace(/^@/, "");
  const creator = await prisma.creator.findFirst({
    where: {
      OR: [{ handle: `@${handle}` }, { handle }],
      ...notDeleted,
    },
    select: { name: true, handle: true, trustScore: true },
  });
  if (!creator) {
    return buildOgImage("صانع محتوى", "TENEGTA Spark");
  }
  const score = creator.trustScore ?? 0;
  return buildOgImage(
    creator.name,
    `@${creator.handle} · Spark Score ${score}`,
    "صانع محتوى"
  );
}
