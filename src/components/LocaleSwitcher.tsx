"use client";

import { useLocale } from "@/lib/i18n";
import { useMotion } from "@/components/motion/MotionProvider";
import { Icon } from "@/components/ui/Icon";

export function LocaleSwitcher() {
  const { locale, setLocale, t } = useLocale();
  const { soundEnabled, toggleSound } = useMotion();

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={toggleSound}
        className="rounded border border-gold-4/30 p-1.5 text-dim hover:text-gold-1"
        aria-label={soundEnabled ? t("settings.soundOff") : t("settings.soundOn")}
        title={soundEnabled ? t("settings.soundOff") : t("settings.soundOn")}
      >
        <Icon name={soundEnabled ? "bell" : "bellSlash"} size={16} />
      </button>
      <div className="flex rounded border border-gold-4/30 text-xs">
        <button
          type="button"
          onClick={() => setLocale("ar")}
          className={`px-2 py-1 ${locale === "ar" ? "bg-gold-2/20 text-gold-1" : "text-dim"}`}
        >
          ع
        </button>
        <button
          type="button"
          onClick={() => setLocale("en")}
          className={`px-2 py-1 ${locale === "en" ? "bg-gold-2/20 text-gold-1" : "text-dim"}`}
        >
          EN
        </button>
      </div>
    </div>
  );
}
