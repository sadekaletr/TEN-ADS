"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useLocale } from "@/lib/i18n";
import type { CreatorCardData } from "@/lib/creators/getFeaturedCreators";
import { creatorsStaggerContainer, creatorsCardReveal } from "@/lib/motion/variants-creators";
import { CreatorSpotlightCard } from "@/components/creators/CreatorSpotlightCard";

interface CreatorGridProps {
  creators: CreatorCardData[];
}

export function CreatorGrid({ creators }: CreatorGridProps) {
  const { t } = useLocale();
  const reducedMotion = useReducedMotion();

  if (creators.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 md:px-6">
      <h2 className="mb-8 text-xl font-semibold tracking-tight text-text-primary md:text-2xl">
        {t("creators.grid.title")}
      </h2>
      <motion.div
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        variants={reducedMotion ? undefined : creatorsStaggerContainer}
        initial={reducedMotion ? false : "hidden"}
        whileInView="show"
        viewport={{ once: true, margin: "-5%" }}
      >
        {creators.map((creator) => (
          <motion.div
            key={creator.id}
            variants={reducedMotion ? undefined : creatorsCardReveal}
          >
            <CreatorSpotlightCard creator={creator} size="default" animate={false} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
