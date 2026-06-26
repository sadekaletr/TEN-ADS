"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import { LandingScrollReveal } from "@/components/landing/LandingScrollReveal";
import { CreatorHero } from "@/components/creators/CreatorHero";
import {
  CreatorFiltersBar,
  type CreatorFilter,
} from "@/components/creators/CreatorFiltersBar";
import { CreatorSpotlightCard } from "@/components/creators/CreatorSpotlightCard";
import { CreatorGrid } from "@/components/creators/CreatorGrid";
import { CreatorCardSkeleton } from "@/components/creators/CreatorCardSkeleton";
import { CreatorEmptyState } from "@/components/creators/CreatorEmptyState";
import { trackCreatorsEvent } from "@/lib/analytics/creators-events";
import { useLandingScrollMilestones } from "@/lib/analytics/landing-events";
import { isCreatorNew } from "@/lib/creators/creator-utils";
import type { CreatorCardData } from "@/lib/creators/getFeaturedCreators";
import { creatorsListPresence } from "@/lib/motion/variants-creators";
import { useLocale } from "@/lib/i18n";
import { Suspense } from "react";

interface CreatorsPageClientProps {
  spotlight: CreatorCardData[];
  grid: CreatorCardData[];
  stats: {
    activeCampaigns: number;
    weeklyRedemptions: number;
  };
}

function matchesQuery(creator: CreatorCardData, q: string): boolean {
  if (!q.trim()) return true;
  const needle = q.trim().toLowerCase();
  const hay = [
    creator.name,
    creator.handle,
    creator.city ?? "",
    creator.showcaseTagline ?? "",
    creator.bio ?? "",
    ...creator.categories,
  ]
    .join(" ")
    .toLowerCase();
  return hay.includes(needle);
}

function applyFilter(
  creators: CreatorCardData[],
  filter: CreatorFilter,
  category: string | null
): CreatorCardData[] {
  let result = creators;
  if (category) {
    result = result.filter((c) => c.categories.includes(category));
  }
  switch (filter) {
    case "verified":
      return result.filter((c) => c.verified);
    case "top_spark":
      return [...result].sort((a, b) => (b.sparkScore ?? 0) - (a.sparkScore ?? 0));
    case "active":
      return result.filter((c) => c.activeCampaigns > 0);
    case "new":
      return result.filter((c) => isCreatorNew(c.listingCreatedAt));
    default:
      return result;
  }
}

function CreatorsPageContent({ spotlight, grid, stats }: CreatorsPageClientProps) {
  const { t } = useLocale();
  const [filter, setFilter] = useState<CreatorFilter>("all");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [isFiltering, setIsFiltering] = useState(false);

  const allCategories = useMemo(() => {
    const set = new Set<string>();
    [...spotlight, ...grid].forEach((c) => c.categories.forEach((cat) => set.add(cat)));
    return Array.from(set).sort();
  }, [spotlight, grid]);

  useLandingScrollMilestones();

  useEffect(() => {
    trackCreatorsEvent("creators_page_view");
  }, []);

  const handleFilterChange = useCallback((f: CreatorFilter, q: string, cat: string | null) => {
    setIsFiltering(true);
    setFilter(f);
    setQuery(q);
    setCategory(cat);
  }, []);

  useEffect(() => {
    if (!isFiltering) return;
    const timer = setTimeout(() => setIsFiltering(false), 280);
    return () => clearTimeout(timer);
  }, [filter, query, category, isFiltering]);

  const filteredSpotlight = useMemo(() => {
    return applyFilter(spotlight, filter, category).filter((c) => matchesQuery(c, query));
  }, [spotlight, filter, query, category]);

  const filteredGrid = useMemo(() => {
    const spotlightIds = new Set(filteredSpotlight.map((c) => c.id));
    const pool = applyFilter(grid, filter, category)
      .filter((c) => matchesQuery(c, query))
      .filter((c) => !spotlightIds.has(c.id));
    if (filter === "top_spark") {
      return [...pool].sort((a, b) => (b.sparkScore ?? 0) - (a.sparkScore ?? 0));
    }
    return pool;
  }, [grid, filteredSpotlight, filter, query, category]);

  const isEmpty = filteredSpotlight.length === 0 && filteredGrid.length === 0;
  const featuredCreator = spotlight[0] ?? null;

  return (
    <>
      <CreatorHero
        activeCampaigns={stats.activeCampaigns}
        weeklyRedemptions={stats.weeklyRedemptions}
        featuredCreator={featuredCreator}
      />

      <LandingScrollReveal>
        <CreatorFiltersBar
          categories={allCategories}
          onFilterChange={handleFilterChange}
        />
      </LandingScrollReveal>

      <AnimatePresence mode="wait">
        {isEmpty ? (
          <motion.div key="empty" {...creatorsListPresence} className="mx-auto max-w-md px-4 py-16 md:px-6">
            <CreatorEmptyState />
          </motion.div>
        ) : isFiltering ? (
          <motion.div key="loading" {...creatorsListPresence} className="mx-auto max-w-6xl px-4 py-10 md:px-6">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <CreatorCardSkeleton key={i} />
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div key="content" {...creatorsListPresence}>
            {filteredSpotlight.length > 0 && (
              <LandingScrollReveal>
                <section className="mx-auto max-w-6xl px-4 py-10 md:px-6">
                  <h2 className="mb-6 text-xl font-semibold text-warm-white">
                    {t("creators.spotlight.title")}
                  </h2>
                  <div className="grid gap-5 md:grid-cols-3">
                    {filteredSpotlight.map((creator) => (
                      <CreatorSpotlightCard
                        key={creator.id}
                        creator={creator}
                        size="spotlight"
                        animate={false}
                      />
                    ))}
                  </div>
                </section>
              </LandingScrollReveal>
            )}
            <CreatorGrid creators={filteredGrid} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function CreatorsPageClient(props: CreatorsPageClientProps) {
  return (
    <Suspense fallback={null}>
      <CreatorsPageContent {...props} />
    </Suspense>
  );
}
