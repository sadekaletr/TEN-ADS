import { redirect } from "next/navigation";
import { getSponsorSession } from "@/lib/session-auth";
import { notDeleted } from "@/lib/db";
import { prisma } from "@/lib/prisma";
import { getUnreadCount } from "@/lib/notifications";
import { SponsorNav } from "@/components/sponsor/SponsorNav";

export default async function SponsorPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSponsorSession();
  if (!session) redirect("/sponsor/login");

  const sponsor = await prisma.sponsor.findFirst({
    where: { id: session.user.id, ...notDeleted },
  });
  if (!sponsor) redirect("/sponsor/login");

  const unread = await getUnreadCount(session.user.id, "SPONSOR");

  return (
    <div className="min-h-screen">
      <SponsorNav sponsorName={sponsor.name} unreadNotifications={unread} />
      <div className="mx-auto max-w-6xl px-4 py-8 pb-safe">{children}</div>
    </div>
  );
}
