import { getAgencySession } from "@/lib/session-auth";
import { prisma } from "@/lib/prisma";
import { AgencyLayoutClient } from "@/components/agency/AgencyLayoutClient";

export default async function AgencyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAgencySession();
  let agencyName = "";
  let walletBalance = 0;

  if (session) {
    const agency = await prisma.agency.findUnique({
      where: { id: session.user.id },
      select: { name: true, walletBalance: true },
    });
    if (agency) {
      agencyName = agency.name;
      walletBalance = agency.walletBalance;
    }
  }

  return (
    <AgencyLayoutClient agencyName={agencyName} walletBalance={walletBalance}>
      {children}
    </AgencyLayoutClient>
  );
}
