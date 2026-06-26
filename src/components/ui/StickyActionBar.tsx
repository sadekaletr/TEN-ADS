"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export interface StickyActionBarProps {
  primary: ReactNode;
  secondary?: ReactNode;
  className?: string;
}

export function StickyActionBar({ primary, secondary, className }: StickyActionBarProps) {
  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-gold-4/20 bg-void/95 p-4 backdrop-blur-md md:hidden",
        "pb-[max(1rem,env(safe-area-inset-bottom))]",
        className
      )}
    >
      <div className="mx-auto flex max-w-lg flex-col gap-2">{primary}{secondary}</div>
    </div>
  );
}

export interface StickyActionBarButtonProps {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  loading?: boolean;
  disabled?: boolean;
  type?: "button" | "submit";
}

export function StickyActionBarButton({
  children,
  onClick,
  href,
  loading,
  disabled,
  type = "button",
}: StickyActionBarButtonProps) {
  return (
    <Button
      type={type}
      href={href}
      onClick={onClick}
      loading={loading}
      disabled={disabled}
      fullWidth
      className="min-h-12"
    >
      {children}
    </Button>
  );
}
