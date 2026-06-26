"use client";

import { useEffect } from "react";

/** One-time unregister of stale cache-first SW that pinned the old homepage. */
export function ServiceWorkerMigration() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
    const flag = "tenegta-sw-v3-migrated";
    if (localStorage.getItem(flag)) return;

    void navigator.serviceWorker.getRegistrations().then(async (regs) => {
      if (regs.length === 0) {
        localStorage.setItem(flag, "1");
        return;
      }
      await Promise.all(regs.map((r) => r.unregister()));
      localStorage.setItem(flag, "1");
      window.location.reload();
    });
  }, []);

  return null;
}
