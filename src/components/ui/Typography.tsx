import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export function H1({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1
      className={cn("font-brand text-4xl font-bold leading-tight text-text-primary md:text-5xl", className)}
      {...props}
    />
  );
}

export function H2({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn("font-brand text-3xl font-bold leading-tight text-text-primary", className)}
      {...props}
    />
  );
}

export function H3({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("font-brand text-2xl font-semibold text-text-primary", className)}
      {...props}
    />
  );
}

export function H4({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h4
      className={cn("font-brand text-xl font-semibold text-text-primary", className)}
      {...props}
    />
  );
}

export function Display({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1
      className={cn("font-brand text-5xl font-bold leading-tight text-text-primary md:text-7xl", className)}
      {...props}
    />
  );
}

export function Lead({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-lg text-text-secondary", className)} {...props} />;
}

export function Muted({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-text-secondary", className)} {...props} />;
}

export function Caption({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-xs text-text-muted", className)} {...props} />;
}

export function Eyebrow({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        "text-xs font-medium uppercase tracking-widest text-gold-rich",
        className
      )}
      {...props}
    />
  );
}

export function Stat({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("font-brand text-4xl font-bold text-gold-accent md:text-5xl", className)}
      {...props}
    />
  );
}

export function Mono({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("font-mono", className)} {...props} />;
}
