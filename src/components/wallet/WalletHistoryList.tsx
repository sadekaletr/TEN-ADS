import type { WalletTransaction } from "@prisma/client";
import { SparkAmount } from "@/components/ui/SparkAmount";
import { EmptyState } from "@/components/ui/EmptyState";
import { EmptyWalletIllustration } from "@/components/illustrations/EmptyIllustrations";
import { formatWalletTransaction } from "@/lib/wallet/format-transaction";

export function WalletHistoryList({ transactions }: { transactions: WalletTransaction[] }) {
  if (transactions.length === 0) {
    return (
      <EmptyState
        title="لا توجد معاملات بعد"
        description="ستظهر هنا بعد الشحن أو إطلاق حملة."
        illustration={<EmptyWalletIllustration className="h-full w-full" />}
      />
    );
  }

  return (
    <ul className="divide-y divide-gold-4/15">
      {transactions.map((tx) => {
        const formatted = formatWalletTransaction(tx);
        return (
          <li key={tx.id} className="flex items-center justify-between gap-3 py-3">
            <div className="min-w-0">
              <p className="text-sm font-medium text-warm-white">{formatted.title}</p>
              <p className="truncate text-xs text-dim">{formatted.subtitle}</p>
              <p className="text-xs text-dimmer">{formatted.relativeTime}</p>
            </div>
            <SparkAmount
              amount={formatted.positive ? tx.amount : -tx.amount}
              size="sm"
              valueClassName={formatted.positive ? "text-gold-1" : "text-red-300"}
            />
          </li>
        );
      })}
    </ul>
  );
}
