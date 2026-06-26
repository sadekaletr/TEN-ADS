"use client";

import { useCallback, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FilterPill, FilterPillGroup } from "@/components/ui/FilterPill";
import { Input } from "@/components/ui/Input";
import { trackProductEvent } from "@/lib/analytics/product-events";

const CATEGORIES = [
  { value: "", label: "الكل" },
  { value: "food", label: "مطاعم" },
  { value: "fashion", label: "أزياء" },
  { value: "tech", label: "تقنية" },
] as const;

const TRUST_THRESHOLDS = [
  { value: "", label: "أي Trust" },
  { value: "50", label: "50+" },
  { value: "70", label: "70+" },
] as const;

interface MarketplaceFiltersProps {
  initialCity?: string;
  initialCategory?: string;
  initialMinTrust?: string;
}

export function MarketplaceFilters({
  initialCity = "",
  initialCategory = "",
  initialMinTrust = "",
}: MarketplaceFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [city, setCity] = useState(initialCity);

  const apply = useCallback(
    (updates: { city?: string; category?: string; minTrust?: string }) => {
      const params = new URLSearchParams(searchParams.toString());
      const nextCity = updates.city ?? city;
      const nextCategory =
        updates.category ?? searchParams.get("category") ?? "";
      const nextMinTrust =
        updates.minTrust ?? searchParams.get("minTrust") ?? "";

      if (nextCity) params.set("city", nextCity);
      else params.delete("city");
      if (nextCategory) params.set("category", nextCategory);
      else params.delete("category");
      if (nextMinTrust) params.set("minTrust", nextMinTrust);
      else params.delete("minTrust");

      trackProductEvent("marketplace_filter_apply", {
        section: "marketplace_filters",
        metadata: {
          city: nextCity || null,
          category: nextCategory || null,
          minTrust: nextMinTrust || null,
        },
      });

      router.push(`/marketplace?${params.toString()}`);
    },
    [city, router, searchParams]
  );

  const activeCategory = searchParams.get("category") ?? initialCategory;
  const activeMinTrust = searchParams.get("minTrust") ?? initialMinTrust;

  return (
    <div
      className="sticky top-0 z-10 mb-6 space-y-4 rounded-2xl border border-strong bg-bg-surface/95 p-4 shadow-surface backdrop-blur-md"
      role="search"
      aria-label="فلاتر السوق"
    >
      <div className="flex flex-wrap items-end gap-2">
        <label className="w-full text-xs font-medium text-text-tertiary sm:w-auto">
          المدينة
        </label>
        <Input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") apply({ city });
          }}
          placeholder="دمشق، حلب..."
          className="min-h-12 flex-1 sm:min-w-[160px]"
        />
        <FilterPill active={Boolean(city)} onClick={() => apply({ city })}>
          تطبيق
        </FilterPill>
      </div>

      <FilterPillGroup label="الفئة">
        {CATEGORIES.map((cat) => (
          <FilterPill
            key={cat.value || "all"}
            active={activeCategory === cat.value}
            onClick={() => apply({ category: cat.value })}
          >
            {cat.label}
          </FilterPill>
        ))}
      </FilterPillGroup>

      <FilterPillGroup label="Trust Score">
        {TRUST_THRESHOLDS.map((t) => (
          <FilterPill
            key={t.value || "any"}
            active={activeMinTrust === t.value}
            onClick={() => apply({ minTrust: t.value })}
          >
            {t.label}
          </FilterPill>
        ))}
      </FilterPillGroup>
    </div>
  );
}
