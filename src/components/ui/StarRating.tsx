"use client";

import { Icon } from "@/components/ui/Icon";

export function StarRating({ value }: { value: string }) {
  return (
    <span className="inline-flex items-center gap-1">
      {value}
      <Icon name="star" size={14} weight="fill" className="text-gold-2" />
    </span>
  );
}
