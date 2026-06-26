import { redirect } from "next/navigation";
import { getCreatorSession } from "@/lib/session-auth";
import { getWalletSummary } from "@/lib/wallet/queries";
import { WalletPageClient } from "@/components/wallet/WalletPageClient";

export default async function WalletPage() {
  const session = await getCreatorSession();
  if (!session) redirect("/login");

  const summary = await getWalletSummary(session.user.id);

  return (
    <WalletPageClient
      balance={summary.balance}
      sparkUnit={summary.sparkUnit}
      transactions={summary.transactions}
      topUpRequests={summary.topUpRequests}
    />
  );
}
