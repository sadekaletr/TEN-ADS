import { PageHeader } from "@/components/ui/PageHeader";
import { NotificationInbox } from "@/components/notifications/NotificationInbox";
import { getNotifications } from "@/lib/notifications";
import { getSponsorSession } from "@/lib/session-auth";
import { redirect } from "next/navigation";

export default async function SponsorNotificationsPage() {
  const session = await getSponsorSession();
  if (!session) redirect("/sponsor/login");

  const notifications = await getNotifications(session.user.id, "SPONSOR");

  return (
    <div className="space-y-6">
      <PageHeader title="الإشعارات" description="ردود التعاون وتحديثات الحملات" />
      <NotificationInbox notifications={notifications} userType="SPONSOR" />
    </div>
  );
}
