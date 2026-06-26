import { PageHeader } from "@/components/ui/PageHeader";
import { NotificationInbox } from "@/components/notifications/NotificationInbox";
import { getNotifications } from "@/lib/notifications";
import { getCreatorSession } from "@/lib/session-auth";
import { redirect } from "next/navigation";

export default async function CreatorNotificationsPage() {
  const session = await getCreatorSession();
  if (!session) redirect("/login");

  const notifications = await getNotifications(session.user.id, "CREATOR");

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader title="الإشعارات" description="تحديثات المحفظة والتعاون والحملات" />
      <NotificationInbox notifications={notifications} userType="CREATOR" />
    </div>
  );
}
