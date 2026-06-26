"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";

export function PwaInstallBanner() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const pushEnabled = process.env.NEXT_PUBLIC_WEB_PUSH === "1";

  useEffect(() => {
    if (!pushEnabled) return;
    if ("serviceWorker" in navigator) {
      void navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
    function onInstall(e: Event) {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    }
    window.addEventListener("beforeinstallprompt", onInstall);
    return () => window.removeEventListener("beforeinstallprompt", onInstall);
  }, [pushEnabled]);

  if (!pushEnabled || !deferred || dismissed) return null;

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gold-4/25 bg-surface-2/60 p-4">
      <p className="text-sm text-warm-white">أضف TENEGTA إلى شاشتك الرئيسية للوصول السريع</p>
      <div className="flex gap-2">
        <Button
          size="sm"
          onClick={async () => {
            await deferred.prompt();
            setDeferred(null);
          }}
        >
          تثبيت
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setDismissed(true)}>
          لاحقاً
        </Button>
      </div>
    </div>
  );
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
}
