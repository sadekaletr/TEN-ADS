"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { formatDateTime, n } from "@/lib/format";
import { useLocale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type NotificationItem = {
  id: string;
  type: string;
  title: string;
  body: string;
  href: string | null;
  readAt: string | null;
  createdAt: string;
};

const TYPE_ICONS: Record<string, string> = {
  topup_approved: "wallet",
  topup_rejected: "wallet",
  redemption_milestone: "gift",
  collab_request: "handshake",
  collab_response: "handshake",
  campaign_ending: "megaphone",
};

interface NotificationBellProps {
  href: string;
  unread: number;
  userType: "CREATOR" | "SPONSOR";
  className?: string;
}

export function NotificationBell({
  href,
  unread: initialUnread,
  userType,
  className,
}: NotificationBellProps) {
  const { t } = useLocale();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [unread, setUnread] = useState(initialUnread);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setUnread(initialUnread);
  }, [initialUnread]);

  useEffect(() => {
    if (!open) return;
    fetch(`/api/notifications?userType=${userType}`)
      .then((r) => r.json())
      .then((d) => {
        setItems(d.notifications ?? []);
        setUnread(d.unread ?? 0);
      })
      .catch(() => {});
  }, [open, userType]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gold-4/25 text-dim transition-colors hover:text-gold-1 min-h-11 min-w-11 sm:min-h-9 sm:min-w-9"
        )}
        aria-label={t("notifications.title")}
        aria-expanded={open}
      >
        <Icon name="bell" size={18} />
        {unread > 0 && (
          <span className="absolute -end-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold-2 px-1 text-[10px] font-bold text-surface">
            {unread > 9 ? "9+" : n(unread)}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute end-0 top-full z-50 mt-2 w-[min(100vw-2rem,320px)] rounded-xl border border-gold-4/25 bg-surface-elevated shadow-elevated backdrop-blur">
          <div className="border-b border-gold-4/20 px-4 py-3">
            <p className="text-sm font-medium text-warm-white">{t("notifications.title")}</p>
          </div>
          <ul className="max-h-72 overflow-y-auto">
            {items.length === 0 ? (
              <li className="px-4 py-6 text-center text-sm text-dim">لا توجد إشعارات</li>
            ) : (
              items.map((n) => {
                const iconName = (TYPE_ICONS[n.type] ?? "spark") as "wallet";
                const row = (
                  <div
                    className={cn(
                      "px-4 py-3 transition-colors hover:bg-gold-2/5",
                      !n.readAt && "bg-gold-2/5"
                    )}
                  >
                    <div className="flex gap-2">
                      <Icon name={iconName} size={16} className="mt-0.5 shrink-0 text-gold-2" />
                      <div className="min-w-0">
                        <p className="text-sm text-warm-white">{n.title}</p>
                        <p className="text-xs text-dim line-clamp-2">{n.body}</p>
                        <p className="mt-1 text-[10px] text-dim">{formatDateTime(n.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                );
                return (
                  <li key={n.id}>
                    {n.href ? (
                      <Link href={n.href} onClick={() => setOpen(false)}>
                        {row}
                      </Link>
                    ) : (
                      row
                    )}
                  </li>
                );
              })
            )}
          </ul>
          <div className="border-t border-gold-4/20 p-2">
            <Link
              href={href}
              onClick={() => setOpen(false)}
              className="block rounded-lg py-2 text-center text-sm text-gold-2 hover:bg-gold-2/10"
            >
              {t("notifications.viewAll")}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
