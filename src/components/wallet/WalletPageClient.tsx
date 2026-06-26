"use client";

import { useState } from "react";
import type { TopUpRequest, WalletTransaction } from "@prisma/client";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { WalletBalanceHero } from "@/components/wallet/WalletBalanceHero";
import { WalletHistoryList } from "@/components/wallet/WalletHistoryList";
import { PendingTopUpsList } from "@/components/wallet/PendingTopUpsList";
import { Tabs } from "@/components/ui/Tabs";

interface WalletPageClientProps {
  balance: number;
  sparkUnit: number;
  transactions: WalletTransaction[];
  topUpRequests: TopUpRequest[];
}

type Tab = "transactions" | "topups";

export function WalletPageClient({
  balance,
  sparkUnit,
  transactions,
  topUpRequests,
}: WalletPageClientProps) {
  const [tab, setTab] = useState<Tab>("transactions");

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-safe">
      <PageHeader
        title="محفظة Spark"
        description="رصيدك، معاملاتك، وطلبات الشحن"
        action={
          <Button href="/dashboard/wallet/topup" size="sm" className="min-h-11">
            شحن
          </Button>
        }
      />

      <WalletBalanceHero balance={balance} sparkUnit={sparkUnit} />

      <Tabs
        tabs={[
          { id: "transactions" as const, label: "المعاملات" },
          { id: "topups" as const, label: "طلبات الشحن" },
        ]}
        active={tab}
        onChange={setTab}
      />

      <GlassCard>
        {tab === "transactions" ? (
          <WalletHistoryList transactions={transactions} />
        ) : (
          <PendingTopUpsList requests={topUpRequests} />
        )}
      </GlassCard>
    </div>
  );
}
