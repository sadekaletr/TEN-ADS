"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { TrustScoreRing } from "@/components/trust/TrustScoreRing";
import { Button } from "@/components/ui/Button";
import { n, percent } from "@/lib/format";
import type { CreatorPitchData } from "@/lib/pitch/get-creator-pitch-data";

interface PitchDeckLiveProps {
  data: CreatorPitchData;
}

const SLIDE_COUNT = 5;

export function PitchDeckLive({ data }: PitchDeckLiveProps) {
  const [slide, setSlide] = useState(0);
  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const next = useCallback(() => {
    setSlide((s) => Math.min(SLIDE_COUNT - 1, s + 1));
  }, []);
  const prev = useCallback(() => {
    setSlide((s) => Math.max(0, s - 1));
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") next();
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") prev();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  const qrSrc = `/api/qr/${encodeURIComponent(data.demoCode)}`;

  const slides = [
    <div key="1" className="flex flex-col items-center justify-center gap-6 text-center">
      {data.creator.avatarUrl ? (
        <Image
          src={data.creator.avatarUrl}
          alt=""
          width={120}
          height={120}
          className="rounded-full border-2 border-gold-4/40"
          unoptimized
        />
      ) : (
        <div className="flex h-28 w-28 items-center justify-center rounded-full border border-gold-4/30 bg-surface-2 text-3xl text-gold-1">
          {data.creator.name.slice(0, 1)}
        </div>
      )}
      <h1 className="font-brand text-4xl text-gold-1">{data.creator.name}</h1>
      <p className="font-mono text-dim">@{data.creator.handle}</p>
      <TrustScoreRing
        score={data.trustScore.score}
        campaignsCount={data.trustScore.campaignsCount}
        size="large"
      />
      <p className="text-sm text-gold-2">Spark Score: {n(data.sparkScore)}</p>
      <span className="rounded-full border border-gold-4/30 px-4 py-1 text-xs text-gold-1">
        TENEGTA Spark
      </span>
    </div>,
    <div key="2" className="grid gap-8 text-center sm:grid-cols-3">
      {[
        { label: "حملات", value: n(data.stats.campaigns) },
        { label: "جوائز مُسلّمة", value: n(data.stats.totalRedemptions) },
        { label: "تحويل", value: percent(data.stats.conversionRate) },
      ].map((stat) => (
        <div
          key={stat.label}
          className="rounded-xl border border-gold-4/20 bg-surface-2/50 p-8"
        >
          <p className="font-mono text-4xl text-gold-1">{stat.value}</p>
          <p className="mt-2 text-dim">{stat.label}</p>
        </div>
      ))}
    </div>,
    data.caseStudy ? (
      <div key="3" className="max-w-xl space-y-4 text-center">
        <p className="text-sm text-gold-2">دراسة حالة</p>
        <h2 className="text-2xl text-warm-white">{data.caseStudy.title}</h2>
        <p className="text-dim">{data.caseStudy.sponsorName}</p>
        <p className="text-lg text-gold-1">{data.caseStudy.prizeName}</p>
        <p className="font-mono text-dim">
          {n(data.caseStudy.prizeClaimed)} / {n(data.caseStudy.prizeQuantity)} جائزة —{" "}
          {n(data.caseStudy.funnelViews)} زيارة
        </p>
      </div>
    ) : (
      <div key="3" className="text-center text-dim">لا توجد حملة مميزة بعد</div>
    ),
    <div key="4" className="flex flex-col items-center gap-6 text-center">
      <p className="text-gold-2">معاينة حية</p>
      <Image
        src={qrSrc}
        alt="QR"
        width={200}
        height={200}
        unoptimized
        className="rounded-xl bg-white p-3"
      />
      <p className="font-mono text-sm text-dim">{data.demoCode}</p>
      <p className="text-sm text-dim">امسح من هاتفك لتجربة الاسترداد الحقيقي</p>
    </div>,
    <div key="5" className="flex flex-col items-center gap-6 text-center">
      <h2 className="text-2xl text-gold-1">لنبدأ التعاون</h2>
      <p className="max-w-md text-dim">
        انضم كراعٍ على TENEGTA Spark ووصل لجمهور حقيقي عبر صناع محتوى موثوقين
      </p>
      <Button href="/sponsor/login" className="min-w-[200px]">
        تسجيل راعٍ
      </Button>
      <Button href={`/creator/${data.creator.handle}`} variant="secondary">
        الملف العام
      </Button>
      <p className="text-xs text-dimmer">/{data.creator.handle}/pitch</p>
    </div>,
  ];

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-void text-warm-white">
      <div className="flex items-center justify-between px-6 py-4">
        <span className="text-xs text-dim">
          {slide + 1} / {SLIDE_COUNT}
        </span>
        <Image src="/brand/tenegta-logo.svg" alt="TENEGTA" width={100} height={26} />
      </div>
      <div className="flex flex-1 items-center justify-center px-6 pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide}
            initial={reducedMotion ? false : { opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reducedMotion ? undefined : { opacity: 0, x: -40 }}
            transition={{ duration: reducedMotion ? 0 : 0.35 }}
            className="w-full max-w-3xl"
          >
            {slides[slide]}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex justify-center gap-4 border-t border-gold-4/10 px-6 py-4 pb-safe">
        <Button variant="ghost" onClick={prev} disabled={slide === 0}>
          السابق
        </Button>
        <Button onClick={next} disabled={slide === SLIDE_COUNT - 1}>
          التالي
        </Button>
      </div>
    </div>
  );
}
