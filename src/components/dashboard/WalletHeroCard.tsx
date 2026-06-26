"use client";

import { motion } from "framer-motion";
import { SparkIcon } from "@/components/ui/SparkIcon";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { formatNumber } from "@/lib/format";
import { sparkToSyp, formatSyp } from "@/lib/spark";

interface WalletHeroCardProps {
  balance: number;
  sparkUnit: number;
  sparkScore: number;
}

export function WalletHeroCard({ balance, sparkUnit, sparkScore }: WalletHeroCardProps) {
  const syp = sparkToSyp(balance, sparkUnit);

  return (
    <GlassCard className="relative overflow-hidden">
      <motion.div
        className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-gold-2/10 blur-3xl"
        animate={{ opacity: [0.4, 0.6, 0.4], scale: [1, 1.03, 1] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
      />
      <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-dim">رصيد Spark</p>
          <div className="mt-2 flex items-center gap-4">
            <SparkIcon size={56} />
            <AnimatedNumber
              value={balance}
              className="font-brand text-5xl text-gold-1"
            />
          </div>
          <p className="mt-2 font-mono text-sm text-dim">{formatSyp(syp)}</p>
          <p className="mt-1 text-xs text-dimmer">Spark Score: {formatNumber(sparkScore)}</p>
        </div>
        <Button
          href="/dashboard/wallet/topup"
          icon={<Icon name="wallet" size={18} />}
        >
          شحن المحفظة
        </Button>
      </div>
    </GlassCard>
  );
}
