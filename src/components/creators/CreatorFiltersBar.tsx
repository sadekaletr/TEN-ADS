"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLocale } from "@/lib/i18n";
import { trackCreatorsEvent } from "@/lib/analytics/creators-events";
import { FilterPill, FilterPillGroup } from "@/components/ui/FilterPill";
import { Input } from "@/components/ui/Input";

export type CreatorFilter = "all" | "verified" | "top_spark" | "active" | "new";

const FILTERS: CreatorFilter[] = ["all", "verified", "top_spark", "active", "new"];

interface CreatorFiltersBarProps {
  categories?: string[];
  onFilterChange?: (filter: CreatorFilter, query: string, category: string | null) => void;
}

export function CreatorFiltersBar({
  categories = [],
  onFilterChange,
}: CreatorFiltersBarProps) {
  const { t } = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialFilter = (searchParams.get("filter") as CreatorFilter) || "all";
  const initialQuery = searchParams.get("q") ?? "";
  const initialCategory = searchParams.get("category");

  const [filter, setFilter] = useState<CreatorFilter>(
    FILTERS.includes(initialFilter) ? initialFilter : "all"
  );
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [category, setCategory] = useState<string | null>(initialCategory);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 250);
    return () => clearTimeout(timer);
  }, [query]);

  const syncUrl = useCallback(
    (nextFilter: CreatorFilter, nextQuery: string, nextCategory: string | null) => {
      const params = new URLSearchParams();
      if (nextFilter !== "all") params.set("filter", nextFilter);
      if (nextQuery.trim()) params.set("q", nextQuery.trim());
      if (nextCategory) params.set("category", nextCategory);
      const qs = params.toString();
      router.replace(qs ? `/creators?${qs}` : "/creators", { scroll: false });
    },
    [router]
  );

  useEffect(() => {
    syncUrl(filter, debouncedQuery, category);
    onFilterChange?.(filter, debouncedQuery, category);
  }, [filter, debouncedQuery, category, syncUrl, onFilterChange]);

  function handleFilter(next: CreatorFilter) {
    setFilter(next);
    trackCreatorsEvent("creators_filter_change", {
      metadata: { filter: next },
    });
  }

  function handleCategory(cat: string | null) {
    setCategory(cat);
    trackCreatorsEvent("creators_filter_change", {
      metadata: { category: cat },
    });
  }

  function handleSearch(value: string) {
    setQuery(value);
    if (value.trim()) {
      trackCreatorsEvent("creators_search", {
        metadata: { q: value.trim().slice(0, 40) },
      });
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-4 px-4 md:px-6">
      <FilterPillGroup>
        {FILTERS.map((f) => (
          <FilterPill key={f} active={filter === f} onClick={() => handleFilter(f)}>
            {t(`creators.filters.${f}`)}
          </FilterPill>
        ))}
      </FilterPillGroup>
      {categories.length > 0 && (
        <FilterPillGroup label={t("creators.filters.categoriesLabel")}>
          <FilterPill active={!category} onClick={() => handleCategory(null)}>
            {t("creators.filters.allCategories")}
          </FilterPill>
          {categories.map((cat) => (
            <FilterPill key={cat} active={category === cat} onClick={() => handleCategory(cat)}>
              {cat}
            </FilterPill>
          ))}
        </FilterPillGroup>
      )}
      <Input
        type="search"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder={t("creators.filters.searchPlaceholder")}
        className="max-w-md"
        aria-label={t("creators.filters.searchPlaceholder")}
      />
    </div>
  );
}
