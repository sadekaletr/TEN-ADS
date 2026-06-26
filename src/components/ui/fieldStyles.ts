import { cn } from "@/lib/utils";

/** Shared premium field shell for Input, Select, and custom controls. */
export const fieldShellClass = cn(
  "min-h-12 w-full rounded-xl border bg-bg-elevated/80 px-4 py-2.5 text-text-primary",
  "border-default shadow-surface backdrop-blur-sm",
  "placeholder:text-text-tertiary",
  "transition-[border-color,box-shadow,background-color] duration-200",
  "focus-visible:border-spotlight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)]",
  "disabled:cursor-not-allowed disabled:opacity-50"
);

export const fieldShellErrorClass =
  "border-danger/60 focus-visible:border-danger focus-visible:ring-danger/40";
