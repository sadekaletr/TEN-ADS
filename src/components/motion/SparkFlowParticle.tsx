"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMotion } from "@/components/motion/MotionProvider";
import { maxConcurrentParticles, transition } from "@/lib/motion";
import {
  onSparkFlow,
  type SparkFlowEventDetail,
} from "@/lib/spark-flow-events";

interface Particle {
  id: string;
  path: "full" | "wallet";
}

function FlowParticle({ path }: { path: "full" | "wallet" }) {
  const isWallet = path === "wallet";
  return (
    <motion.div
      className="pointer-events-none fixed z-[100] h-3 w-3 rounded-full bg-gold-1 shadow-[0_0_12px_rgba(240,201,122,0.9)]"
      initial={
        isWallet
          ? { left: "50%", top: "70%", opacity: 0 }
          : { left: "12%", top: "88%", opacity: 0 }
      }
      animate={
        isWallet
          ? { left: "88%", top: "12%", opacity: [0, 1, 0] }
          : {
              left: ["12%", "50%", "88%"],
              top: ["88%", "50%", "12%"],
              opacity: [0, 1, 0],
            }
      }
      transition={{
        duration: isWallet ? 0.85 : 1.35,
        ease: transition.cinematic.ease,
        times: isWallet ? undefined : [0, 0.45, 1],
      }}
    />
  );
}

export function SparkFlowLayer() {
  const { particlesEnabled } = useMotion();
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!particlesEnabled) return;
    return onSparkFlow((detail: SparkFlowEventDetail) => {
      setParticles((prev) =>
        [{ id: detail.id, path: detail.path ?? "full" }, ...prev].slice(
          0,
          maxConcurrentParticles
        )
      );
      const ms = detail.path === "wallet" ? 950 : 1450;
      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => p.id !== detail.id));
      }, ms);
    });
  }, [particlesEnabled]);

  if (!particlesEnabled) return null;

  return (
    <AnimatePresence>
      {particles.map((p) => (
        <FlowParticle key={p.id} path={p.path} />
      ))}
    </AnimatePresence>
  );
}
