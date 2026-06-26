"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { DataDepthCard } from "@/components/ui/DataDepthCard";
import { WinCardDownload } from "@/components/redeem/WinCardDownload";
import type { RevealDoneProps } from "@/components/redeem/reveals/types";

export function ScratchCardReveal({
  campaign,
  prizeName,
  reference,
  qrCode,
  reducedMotion,
  onDone,
}: RevealDoneProps & { onDone: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [revealed, setRevealed] = useState(reducedMotion);
  const [done, setDone] = useState(reducedMotion);

  useEffect(() => {
    if (reducedMotion) {
      onDone();
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;
    ctx.fillStyle = "#9a6e20";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#d4a855";
    ctx.font = "bold 20px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("امسح للكشف", w / 2, h / 2);

    let scratching = false;
    function scratch(x: number, y: number) {
      if (!ctx) return;
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(x, y, 24, 0, Math.PI * 2);
      ctx.fill();
    }
    function getPos(e: PointerEvent) {
      const rect = canvas!.getBoundingClientRect();
      return {
        x: ((e.clientX - rect.left) / rect.width) * w,
        y: ((e.clientY - rect.top) / rect.height) * h,
      };
    }
    function onDown(e: PointerEvent) {
      scratching = true;
      const p = getPos(e);
      scratch(p.x, p.y);
    }
    function onMove(e: PointerEvent) {
      if (!scratching) return;
      const p = getPos(e);
      scratch(p.x, p.y);
    }
    function onUp() {
      scratching = false;
      setRevealed(true);
      setTimeout(() => {
        setDone(true);
        onDone();
      }, 800);
    }
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    return () => {
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
    };
  }, [reducedMotion, onDone]);

  if (!done) {
    return (
      <div className="relative mx-auto w-full max-w-xs text-center">
        <p className="mb-4 text-gold-1">{prizeName}</p>
        <canvas
          ref={canvasRef}
          width={300}
          height={200}
          className="mx-auto touch-none rounded-xl border border-gold-4/30"
        />
        {revealed && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-2xl font-semibold text-gold-1"
          >
            {prizeName}
          </motion.p>
        )}
      </div>
    );
  }

  return (
    <DataDepthCard elevation={4} featured title="تم الاستلام" value={prizeName} meta={reference}>
      <WinCardDownload
        prizeName={prizeName}
        sponsorName={campaign.sponsor.name}
        campaignTitle={campaign.title}
        campaignSlug={campaign.slug}
        qrCode={qrCode}
        reference={reference}
      />
    </DataDepthCard>
  );
}
