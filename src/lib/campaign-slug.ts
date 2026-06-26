import { prisma } from "@/lib/prisma";

function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\u0600-\u06FF\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60)
    .replace(/^-|-$/g, "");
}

export async function generateCampaignSlug(title: string): Promise<string> {
  const base = slugify(title) || "campaign";
  let slug = base;
  let i = 1;
  while (await prisma.campaign.findFirst({ where: { slug } })) {
    slug = `${base}-${i}`;
    i += 1;
  }
  return slug;
}
