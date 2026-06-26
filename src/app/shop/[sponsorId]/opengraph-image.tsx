import { notDeleted } from "@/lib/db";
import { prisma } from "@/lib/prisma";
import { buildOgImage } from "@/lib/og-image";

export const runtime = "nodejs";
export const alt = "TENEGTA Spark Shop";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: { sponsorId: string };
}) {
  const sponsor = await prisma.sponsor.findFirst({
    where: { id: params.sponsorId, ...notDeleted },
    select: { name: true, city: true },
  });
  if (!sponsor) {
    return buildOgImage("متجر الراعي", "TENEGTA Spark");
  }
  const prizes = await prisma.redemption.count({
    where: { campaign: { sponsorId: params.sponsorId, ...notDeleted } },
  });
  return buildOgImage(
    sponsor.name,
    `${sponsor.city ?? "سوريا"} · ${prizes} جائزة موزّعة`,
    "راعٍ موثّق"
  );
}
