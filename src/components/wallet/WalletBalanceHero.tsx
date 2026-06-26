import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { SparkAmount } from "@/components/ui/SparkAmount";
import { formatCurrency } from "@/lib/format";
import { sparkToSyp } from "@/lib/spark";

interface WalletBalanceHeroProps {
  balance: number;
  sparkUnit: number;
}

export function WalletBalanceHero({ balance, sparkUnit }: WalletBalanceHeroProps) {
  const sypApprox = sparkToSyp(balance, sparkUnit);

  return (
    <GlassCard className="space-y-4 text-center" featured>
      <p className="text-sm text-dim">رصيد Spark</p>
      <SparkAmount amount={balance} size="xl" className="justify-center" />
      <p className="text-base text-dim">≈ {formatCurrency(sypApprox)}</p>
      <Button href="/dashboard/wallet/topup" fullWidth className="min-h-11">
        شحن المحفظة
      </Button>
    </GlassCard>
  );
}
