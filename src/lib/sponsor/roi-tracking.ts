import { logAudit } from "@/lib/audit";
import { prisma } from "@/lib/prisma";

/** Log first ROI page view per sponsor for beta metrics. */
export async function trackSponsorRoiView(sponsorId: string) {
  const existing = await prisma.auditLog.findFirst({
    where: {
      action: "sponsor.roi_viewed",
      entityType: "Sponsor",
      entityId: sponsorId,
    },
    select: { id: true },
  });
  if (existing) return;

  await logAudit({
    actorId: sponsorId,
    actorType: "sponsor",
    action: "sponsor.roi_viewed",
    entityType: "Sponsor",
    entityId: sponsorId,
  });
}
