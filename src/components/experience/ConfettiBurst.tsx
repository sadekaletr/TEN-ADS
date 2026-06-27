"use client";

import { memo, useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

interface ConfettiBurstProps {
  active: boolean;
  className?: string;
}

/** Controlled success burst — fixed particle count, no random flying objects */
export const ConfettiBurst = memo(function ConfettiBurst({
  active,
  className,
}: ConfettiBurstProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!active || reducedMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const colors = ["#f0c97a", "#e8b84a", "#fff8e7", "#c9a227"];
    const particles = Array.from({ length: 24 }, (_, i) => ({
      x: w / 2,
      y: h / 2,
      vx: Math.cos((i / 24) * Math.PI * 2) * (2 + (i % 3)),
      vy: Math.sin((i / 24) * Math.PI * 2) * (2 + (i % 3)) - 2,
      color: colors[i % colors.length],
      life: 1,
    }));

    let frame = 0;
    let raf = 0;

    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      let alive = false;
      for (const p of particles) {
        if (p.life <= 0) continue;
        alive = true;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.08;
        p.life -= 0.018;
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, 4, 4);
      }
      frame++;
      if (alive && frame < 90) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, reducedMotion]);

  if (!active || reducedMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      width={320}
      height={320}
      className={className}
      aria-hidden
    />
  );
});
