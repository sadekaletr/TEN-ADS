"use client";

import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { TOKENS } from "@/styles/tokens";

export function LuxuryThemePreviewPanel() {
  const swatches = [
    { name: "bg-base", var: "--bg-base" },
    { name: "bg-surface", var: "--bg-surface" },
    { name: "bg-elevated", var: "--bg-elevated" },
    { name: "gold-accent", var: "--gold-accent" },
    { name: "gold-rich", var: "--gold-rich" },
    { name: "text-primary", var: "--text-primary" },
    { name: "text-secondary", var: "--text-secondary" },
  ];

  return (
    <section className="space-y-6 rounded-2xl border border-subtle bg-bg-surface p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-brand text-2xl text-text-primary">Luxury Dark / Pure Light</h2>
          <p className="text-sm text-text-secondary">Toggle theme in the nav to preview both modes</p>
        </div>
        <ThemeToggle />
      </div>
      <div className="grid gap-3 sm:grid-cols-4 md:grid-cols-7">
        {swatches.map((s) => (
          <div key={s.name} className="text-center">
            <div
              className="mx-auto h-14 w-full rounded-lg border border-subtle"
              style={{ background: `var(${s.var})` }}
            />
            <p className="mt-1 font-mono text-[10px] text-text-muted">{s.name}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="bento-cell">
          <p className={TOKENS.type.h3 + " text-gold-accent"}>Primary CTA</p>
          <button
            type="button"
            className="mt-4 rounded-xl px-6 py-3 font-semibold text-accent-foreground"
            style={{ background: "var(--btn-primary-bg)", boxShadow: "var(--btn-primary-shadow)" }}
          >
            Start campaign
          </button>
        </div>
        <div className="bento-cell">
          <p className="text-gradient-gold text-2xl font-bold">Gold gradient text</p>
          <p className="mt-2 text-text-secondary">Champagne accent on obsidian or pure white</p>
        </div>
      </div>
    </section>
  );
}
