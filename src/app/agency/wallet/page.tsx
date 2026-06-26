import { redirect } from "next/navigation";
import { getAgencySession } from "@/lib/session-auth";
import { prisma } from "@/lib/prisma";
import { getTransferSettings } from "@/lib/platform-settings";
import { AgencyWalletClient } from "@/components/agency/AgencyWalletClient";

export default async function AgencyWalletPage() {
  const session = await getAgencySession();
  if (!session) redirect("/agency/login");

  const [agency, transferSettings] = await Promise.all([
    prisma.agency.findUnique({
      where: { id: session.user.id },
      include: {
        transactions: { orderBy: { createdAt: "desc" }, take: 50 },
        topUpRequests: { orderBy: { createdAt: "desc" }, take: 20 },
      },
    }),
    getTransferSettings(),
  ]);
  if (!agency) redirect("/agency/login");

  return (
    <AgencyWalletClient
      balance={agency.walletBalance}
      transactions={agency.transactions}
      topUpRequests={agency.topUpRequests}
      transferMethod={transferSettings.transferMethod}
    />
  );
}
