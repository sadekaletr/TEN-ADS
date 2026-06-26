"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

const CONSENT_KEY = "tenegta_cookie_consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!localStorage.getItem(CONSENT_KEY)) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="موافقة ملفات تعريف الارتباط"
      className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-lg rounded-2xl border border-gold-4/30 bg-surface/95 p-4 shadow-2xl backdrop-blur-md"
    >
      <p className="text-sm text-warm-white">
        نستخدم ملفات تعريف الارتباط للتحليل وتحسين التجربة.{" "}
        <Link href="/privacy" className="text-gold-2 underline">
          الخصوصية
        </Link>
      </p>
      <div className="mt-3 flex justify-end gap-2">
        <Button variant="secondary" size="sm" onClick={accept}>
          موافق
        </Button>
      </div>
    </div>
  );
}
