"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { DataDepthCard } from "@/components/ui/DataDepthCard";
import { SectionCinematicDivider } from "@/components/ui/SectionCinematicDivider";
import { useMotion } from "@/components/motion/MotionProvider";
import { emitSparkFlow } from "@/lib/spark-flow-events";
import { playRevealChime } from "@/lib/sound/sfx";
import { ScratchCardReveal } from "@/components/redeem/reveals/ScratchCardReveal";
import { SpinWheelReveal } from "@/components/redeem/reveals/SpinWheelReveal";
import { WinCardDownload } from "@/components/redeem/WinCardDownload";
import { fadeUp } from "@/lib/motion/variants";
import { transition } from "@/lib/motion/tokens";
import type { Campaign, Sponsor, RevealStyle } from "@prisma/client";

interface RewardRevealProps {
  campaign: Campaign & { sponsor: Sponsor };
  prizeName: string;
  reference: string;
  qrCode?: string;
  revealStyle?: RevealStyle;
}

type RevealPhase = "dim" | "portal" | "burst" | "done";

export function RewardReveal({
  campaign,
  prizeName,
  reference,
  qrCode,
  revealStyle = "CLASSIC_GOLD",
}: RewardRevealProps) {
  const { reducedMotion, soundEnabled } = useMotion();
  const [altDone, setAltDone] = useState(false);
  const [phase, setPhase] = useState<RevealPhase>(reducedMotion ? "done" : "dim");
  const [copied, setCopied] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const useAlt =
    !altDone &&
    !reducedMotion &&
    (revealStyle === "SCRATCH_CARD" || revealStyle === "SPIN_WHEEL");

  useEffect(() => {
    if (useAlt || reducedMotion) {
      if (reducedMotion && !useAlt) {
        emitSparkFlow({ id: `redeem-${Date.now()}`, path: "wallet" });
      }
      return;
    }

    const t1 = setTimeout(() => setPhase("portal"), 600);
    const t2 = setTimeout(() => {
      setPhase("burst");
      if (soundEnabled && !reducedMotion) {
        playRevealChime();
      }
      emitSparkFlow({ id: `redeem-${Date.now()}`, path: "full" });
      emitSparkFlow({ id: `redeem-burst-${Date.now()}`, path: "full" });
    }, 1800);
    const t3 = setTimeout(() => setPhase("done"), 2800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [reducedMotion, soundEnabled, useAlt]);

  if (!altDone && revealStyle === "SCRATCH_CARD" && !reducedMotion) {
    return (
      <ScratchCardReveal
        campaign={campaign}
        prizeName={prizeName}
        reference={reference}
        qrCode={qrCode}
        reducedMotion={reducedMotion}
        onDone={() => setAltDone(true)}
      />
    );
  }

  if (!altDone && revealStyle === "SPIN_WHEEL" && !reducedMotion) {
    return (
      <SpinWheelReveal
        campaign={campaign}
        prizeName={prizeName}
        reference={reference}
        qrCode={qrCode}
        reducedMotion={reducedMotion}
        onDone={() => setAltDone(true)}
      />
    );
  }

  async function handleShare() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: campaign.title,
          text: `حصلت على ${prizeName}!`,
          url,
        });
        return;
      } catch {
        // cancelled
      }
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function recordRevealVideo() {
    const canvas = canvasRef.current;
    if (!canvas || recording) return;
    setRecording(true);

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setRecording(false);
      return;
    }

    const w = 360;
    const h = 640;
    canvas.width = w;
    canvas.height = h;

    const stream = canvas.captureStream(30);
    const recorder = new MediaRecorder(stream, {
      mimeType: MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
        ? "video/webm;codecs=vp9"
        : "video/webm",
    });
    const chunks: Blob[] = [];
    recorder.ondataavailable = (e) => {
      if (e.data.size) chunks.push(e.data);
    };

    const drawFrame = (progress: number) => {
      ctx.fillStyle = "#050406";
      ctx.fillRect(0, 0, w, h);
      const pulse = Math.sin(progress * Math.PI * 4) * 0.5 + 0.5;
      const r = 20 + pulse * 60;
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(240, 201, 122, ${0.15 + pulse * 0.25})`;
      ctx.fill();
      if (progress > 0.4) {
        const scale = Math.min(1, (progress - 0.4) / 0.3);
        ctx.font = "bold 28px Syne, sans-serif";
        ctx.fillStyle = "#f0c97a";
        ctx.textAlign = "center";
        ctx.save();
        ctx.translate(w / 2, h / 2);
        ctx.scale(scale, scale);
        ctx.fillText(prizeName.slice(0, 24), 0, 0);
        ctx.restore();
      }
      ctx.font = "12px monospace";
      ctx.fillStyle = "#9a9180";
      ctx.fillText("TENEGTA Spark", w / 2, h - 40);
      ctx.fillText(reference, w / 2, h - 20);
    };

    recorder.start();
    const start = performance.now();
    const duration = 3000;

    await new Promise<void>((resolve) => {
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / duration);
        drawFrame(p);
        if (p < 1) requestAnimationFrame(tick);
        else resolve();
      };
      requestAnimationFrame(tick);
    });

    recorder.stop();
    await new Promise<void>((r) => {
      recorder.onstop = () => r();
    });

    const blob = new Blob(chunks, { type: "video/webm" });
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    setVideoUrl(URL.createObjectURL(blob));
    setRecording(false);
  }

  if (!reducedMotion && phase !== "done") {
    return (
      <div className="relative flex min-h-[60vh] w-full items-center justify-center overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-void"
          initial={{ opacity: 0 }}
          animate={{ opacity: phase === "dim" ? 0.85 : 1 }}
          transition={{ duration: 0.6 }}
        />
        <AnimatePresence mode="wait">
          {(phase === "dim" || phase === "portal") && (
            <motion.div
              key="pulse"
              className="absolute h-10 w-10 rounded-full bg-gold-1/40"
              initial={{ scale: 0, opacity: 0.8 }}
              animate={
                phase === "portal"
                  ? { scale: 12, opacity: 0, clipPath: "circle(50% at 50% 50%)" }
                  : { scale: 4, opacity: 0 }
              }
              transition={{ duration: phase === "portal" ? 1.2 : 0.6 }}
            />
          )}
          {phase === "portal" && (
            <motion.h2
              key="prize"
              className="relative z-10 px-4 text-center font-brand text-4xl text-gold-1"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {prizeName}
            </motion.h2>
          )}
          {phase === "burst" && (
            <motion.div
              key="burst"
              className="absolute h-40 w-40 rounded-full bg-gold-1/30"
              initial={{ scale: 0 }}
              animate={{ scale: 3, opacity: 0 }}
              transition={{ duration: 1 }}
            />
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="relative w-full text-center">
      <canvas ref={canvasRef} className="hidden" aria-hidden />
      <SectionCinematicDivider variant="gold" />
      <motion.div
        initial={reducedMotion ? { opacity: 0 } : false}
        animate={{ opacity: 1 }}
        transition={{ duration: reducedMotion ? 0.2 : 0.4 }}
      >
        <DataDepthCard
          elevation={4}
          featured
          title="تم الاستلام بنجاح"
          value={prizeName}
          meta={reference}
          className="text-center"
        >
          <motion.p
            initial={fadeUp.initial}
            animate={fadeUp.animate}
            transition={{ ...transition.normal, delay: 0.3 }}
            className="mt-4 text-sm text-text-secondary"
          >
            برعاية {campaign.sponsor.name}
          </motion.p>
          <div className="mt-6 space-y-2">
            <Button fullWidth variant="secondary" onClick={handleShare}>
              {copied ? "تم نسخ الرابط" : "مشاركة"}
            </Button>
            <WinCardDownload
              prizeName={prizeName}
              sponsorName={campaign.sponsor.name}
              campaignTitle={campaign.title}
              campaignSlug={campaign.slug}
              qrCode={qrCode}
              reference={reference}
            />
            <Button
              fullWidth
              variant="ghost"
              onClick={recordRevealVideo}
              disabled={recording}
            >
              {recording ? "جاري التسجيل..." : "حفظ كفيديو"}
            </Button>
            {videoUrl && (
              <p className="text-xs text-gold-2">
                <a href={videoUrl} download="tenegta-reveal.webm" className="underline">
                  تحميل الفيديو — شاركها في ستوري إنستغرام
                </a>
              </p>
            )}
          </div>
        </DataDepthCard>
      </motion.div>
    </div>
  );
}

export function triggerRevealSpark() {
  emitSparkFlow({ id: `redeem-${Date.now()}`, path: "wallet" });
}
