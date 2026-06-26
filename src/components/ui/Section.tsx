import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface SectionProps {
  id?: string;
  children: ReactNode;
  className?: string;
  variant?: "default" | "surface" | "contrast" | "fullBleed" | "void";
  size?: "default" | "lg";
}

const variantStyles = {
  default: "",
  surface: "bg-bg-surface/80 border-y border-subtle",
  contrast: "bg-bg-elevated border-y border-subtle",
  fullBleed: "px-0",
  void: "",
};

export function Section({
  id,
  children,
  className,
  variant = "default",
  size = "default",
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-24 px-6",
        variant !== "fullBleed" && (size === "lg" ? "section-padding-lg" : "section-padding"),
        variantStyles[variant],
        className
      )}
    >
      <div
        className={cn(
          "mx-auto w-full",
          variant === "fullBleed" ? "max-w-none" : "max-w-[var(--content-max)]"
        )}
      >
        {children}
      </div>
    </section>
  );
}
