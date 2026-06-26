"use client";

import Link from "next/link";
import type { LinkProps } from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";
import { useMotion } from "@/components/motion/MotionProvider";
import { playTapClick } from "@/lib/sound/sfx";
import { TOKENS } from "@/styles/tokens";
import type { ButtonHTMLAttributes, CSSProperties, MouseEventHandler, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive";
type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  href?: LinkProps["href"];
  loading?: boolean;
  glow?: boolean;
  icon?: ReactNode;
  iconPosition?: "start" | "end";
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "border-transparent text-accent-foreground font-semibold shadow-[var(--btn-primary-shadow)] [background:var(--btn-primary-bg)] hover:brightness-110",
  secondary:
    "border-strong bg-transparent text-gold-rich hover:border-spotlight hover:bg-gold-rich/10",
  ghost: "border-transparent bg-transparent text-text-secondary hover:text-text-primary",
  destructive:
    "border-destructive/50 bg-destructive/20 text-text-primary hover:bg-destructive/30",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "rounded-lg px-3 py-1.5 text-xs min-h-11",
  md: "rounded-xl px-4 py-2.5 text-sm min-h-12",
  lg: "rounded-xl px-6 py-3 text-base min-h-12",
};

function ButtonContent({
  children,
  loading,
  icon,
  iconPosition = "start",
}: {
  children: ReactNode;
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: "start" | "end";
}) {
  return (
    <span className="inline-flex items-center justify-center gap-2">
      {loading && (
        <Icon name="spinner" size={16} className="animate-spin" aria-hidden />
      )}
      {!loading && icon && iconPosition === "start" && icon}
      {children}
      {!loading && icon && iconPosition === "end" && icon}
    </span>
  );
}

const motionProps = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
  transition: { type: "spring" as const, stiffness: 400, damping: 17 },
};

const baseClass =
  "inline-flex items-center justify-center border font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)] disabled:cursor-not-allowed disabled:opacity-50";

export function Button({
  className,
  variant = "primary",
  size = "md",
  fullWidth,
  href,
  loading,
  disabled,
  glow,
  icon,
  iconPosition,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  const classes = cn(
    baseClass,
    variantStyles[variant],
    sizeStyles[size],
    fullWidth && "w-full",
    className
  );
  const isDisabled = disabled || loading;
  const { soundEnabled } = useMotion();

  const glowStyle: CSSProperties | undefined =
    glow && variant === "primary"
      ? {
          background: TOKENS.gradient.buttonPrimary,
          boxShadow: `${TOKENS.shadow.button}, ${TOKENS.shadow.ctaGlow}`,
        }
      : undefined;

  function handleTapSound() {
    if (variant === "primary" && soundEnabled) playTapClick();
  }

  const content = (
    <ButtonContent loading={loading} icon={icon} iconPosition={iconPosition}>
      {children}
    </ButtonContent>
  );

  if (href) {
    const { onClick } = props;
    const linkOnClick = onClick as MouseEventHandler<HTMLAnchorElement> | undefined;
    return (
      <motion.span
        {...(isDisabled ? {} : motionProps)}
        className={cn("inline-block", fullWidth && "block w-full")}
      >
        <Link
          href={href}
          className={classes}
          style={glowStyle}
          aria-disabled={isDisabled || undefined}
          tabIndex={isDisabled ? -1 : undefined}
          onClick={(e) => {
            handleTapSound();
            linkOnClick?.(e);
          }}
        >
          {content}
        </Link>
      </motion.span>
    );
  }

  const { onPointerDown, onClick, ...restProps } = props;

  return (
    <motion.span
      {...(isDisabled ? {} : motionProps)}
      className={cn("inline-block", fullWidth && "block w-full")}
    >
      <button
        type={type}
        disabled={isDisabled}
        className={classes}
        style={glowStyle}
        aria-busy={loading || undefined}
        onClick={onClick}
        onPointerDown={(e) => {
          handleTapSound();
          onPointerDown?.(e);
        }}
        {...restProps}
      >
        {content}
      </button>
    </motion.span>
  );
}
