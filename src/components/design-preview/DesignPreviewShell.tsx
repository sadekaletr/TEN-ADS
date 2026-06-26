"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { TOKENS } from "@/styles/tokens";

const TABS = [
  { id: "ui40", label: "UI 4.0" },
  { id: "tokens", label: "Tokens" },
  { id: "components", label: "Components" },
  { id: "motion", label: "Motion" },
  { id: "roles", label: "Roles" },
  { id: "a11y", label: "A11y" },
  { id: "landing", label: "Landing" },
  { id: "blackgold", label: "BlackGold" },
  { id: "creators", label: "Creators" },
  { id: "admin", label: "Admin" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function DesignPreviewShell({
  ui40,
  tokens,
  components,
  motion,
  roles,
  a11y,
  landing,
  blackgold,
  creators,
  admin,
}: {
  ui40: ReactNode;
  tokens: ReactNode;
  components: ReactNode;
  motion: ReactNode;
  roles: ReactNode;
  a11y: ReactNode;
  landing: ReactNode;
  blackgold: ReactNode;
  creators: ReactNode;
  admin: ReactNode;
}) {
  const [tab, setTab] = useState<TabId>("ui40");

  const panels: Record<TabId, ReactNode> = {
    ui40,
    tokens,
    components,
    motion,
    roles,
    a11y,
    landing,
    blackgold,
    creators,
    admin,
  };

  return (
    <main
      className="mx-auto max-w-4xl space-y-8 px-6 py-16"
      style={{ background: TOKENS.color.void, minHeight: "100vh" }}
    >
      <div>
        <h1 className={`${TOKENS.type.sectionTitle} text-gold-1`}>
          Design System — Governance Center
        </h1>
        <p className={`${TOKENS.type.body} mt-2 text-text-secondary`}>
          Global UI 4.0 + Black Gold 2.0 governance center
        </p>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-gold-4/20 pb-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "rounded-lg px-3 py-2 text-sm transition-colors focus-ring",
              tab === t.id
                ? "bg-gold-2/20 text-gold-1"
                : "text-text-secondary hover:text-warm-white"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div>{panels[tab]}</div>
    </main>
  );
}
