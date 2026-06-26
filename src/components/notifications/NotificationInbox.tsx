"use client";

import Link from "next/link";
import { markAllNotificationsRead, markNotificationRead } from "@/app/notifications/actions";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import type { IconName } from "@/components/ui/Icon";
import { formatDateTime } from "@/lib/format";
import { EmptyState } from "@/components/ui/EmptyState";
import { useLocale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export type NotificationItem = {
  id: string;
  type: string;
  title: string;
  body: string;
  href: string | null;
  readAt: Date | null;
  createdAt: Date;
};

const TYPE_ICONS: Record<string, IconName> = {
  topup_approved: "wallet",
  topup_rejected: "wallet",
  redemption_milestone: "gift",
  collab_request: "handshake",
  collab_response: "handshake",
  campaign_ending: "megaphone",
};

function dayLabel(d: Date): string {
  const today = new Date();
  const y = new Date(today);
  y.setDate(y.getDate() - 1);
  const key = (x: Date) => x.toDateString();
  if (key(d) === key(today)) return "اليوم";
  if (key(d) === key(y)) return "أمس";
  return new Intl.DateTimeFormat("ar-SY", { dateStyle: "medium" }).format(d);
}

function groupByDay(notifications: NotificationItem[]) {
  const groups = new Map<string, NotificationItem[]>();
  for (const n of notifications) {
    const label = dayLabel(new Date(n.createdAt));
    const list = groups.get(label) ?? [];
    list.push(n);
    groups.set(label, list);
  }
  return Array.from(groups.entries());
}

export function NotificationInbox({
  notifications,
  userType,
}: {
  notifications: NotificationItem[];
  userType: "CREATOR" | "SPONSOR";
}) {
  const { t } = useLocale();

  async function handleRead(id: string) {
    await markNotificationRead(id);
  }

  async function handleReadAll() {
    await markAllNotificationsRead(userType);
  }

  if (notifications.length === 0) {
    return <EmptyState title={t("notifications.empty")} />;
  }

  const grouped = groupByDay(notifications);

  return (
    <div className="space-y-6 pb-safe">
      <div className="flex justify-end">
        <Button variant="ghost" size="sm" onClick={handleReadAll} className="min-h-11">
          {t("notifications.markAllRead")}
        </Button>
      </div>
      {grouped.map(([day, items]) => (
        <section key={day}>
          <h2 className="mb-3 text-xs font-medium uppercase tracking-wide text-dim">{day}</h2>
          <ul className="space-y-2">
            {items.map((n) => {
              const icon = TYPE_ICONS[n.type] ?? "spark";
              const content = (
                <GlassCard
                  className={cn(
                    "flex gap-3 transition-colors",
                    !n.readAt && "border-gold-2/30 bg-gold-2/5"
                  )}
                >
                  <Icon name={icon} size={20} className="shrink-0 text-gold-2" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-warm-white">{n.title}</p>
                    <p className="mt-1 text-sm text-dim">{n.body}</p>
                    <p className="mt-2 text-xs text-dim">{formatDateTime(n.createdAt)}</p>
                  </div>
                </GlassCard>
              );

              if (n.href) {
                return (
                  <li key={n.id}>
                    <Link
                      href={n.href}
                      onClick={() => !n.readAt && handleRead(n.id)}
                      className="block"
                    >
                      {content}
                    </Link>
                  </li>
                );
              }

              return (
                <li
                  key={n.id}
                  onClick={() => !n.readAt && handleRead(n.id)}
                  role="button"
                  tabIndex={0}
                >
                  {content}
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
