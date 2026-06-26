"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { DataDepthCard } from "@/components/ui/DataDepthCard";
import { WinCardDownload } from "@/components/redeem/WinCardDownload";
import type { RevealDoneProps } from "@/components/redeem/reveals/types";

const SEGMENTS = ["؟", "؟", prizePlaceholder(), "؟", "؟", prizePlaceholder()];

function prizePlaceholder() {
  return "★";
}

export function SpinWheelReveal({
  campaign,
  prizeName,
  reference,
  qrCode,
  reducedMotion,
  onDone,
}: RevealDoneProps & { onDone: () => void }) {
  const [spinning, setSpinning] = useState(!reducedMotion);
  const [done, setDone] = useState(reducedMotion);
  const targetIndex = 2;
  const segmentAngle = 360 / SEGMENTS.length;

  useEffect(() => {
    if (reducedMotion) {
      onDone();
      return;
    }
    const t = setTimeout(() => {
      setSpinning(false);
      setTimeout(() => {
        setDone(true);
        onDone();
      }, 600);
    }, 2800);
    return () => clearTimeout(t);
  }, [reducedMotion, onDone]);

  if (!done) {
    const rotation = spinning ? 1080 + targetIndex * segmentAngle : targetIndex * segmentAngle;
    return (
      <div className="flex flex-col items-center py-8">
        <motion.div
          className="relative h-48 w-48 rounded-full border-4 border-gold-4/40"
          style={{
            background: `conic-gradient(from 0deg, #d4a855, #9a6e20, #f0c97a, #6b5a2a, #d4a855, #9a6e20)`,
          }}
          animate={{ rotate: reducedMotion ? targetIndex * segmentAngle : rotation }}
          transition={{ duration: reducedMotion ? 0 : 2.8, ease: [0.2, 0.8, 0.2, 1] }}
        />
        {!spinning && (
          <motion.p
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 text-2xl font-semibold text-gold-1"
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
