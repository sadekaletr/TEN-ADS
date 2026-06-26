import type { LinkProps } from "next/link";

/** Hash links as UrlObject so SSR and client href match (avoids # vs /# hydration mismatch). */
export function homeHash(h: string): LinkProps["href"] {
  return { pathname: "/", hash: h };
}

export type NavLinkItem = {
  id: string;
  href: LinkProps["href"];
  label: string;
  highlight?: boolean;
};
