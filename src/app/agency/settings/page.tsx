import { redirect } from "next/navigation";
import { getAgencySession } from "@/lib/session-auth";
import { prisma } from "@/lib/prisma";
import { AgencySettingsClient } from "@/components/agency/AgencySettingsClient";

export default async function AgencySettingsPage() {
  const session = await getAgencySession();
  if (!session) redirect("/agency/login");

  const agency = await prisma.agency.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true },
  });
  if (!agency) redirect("/agency/login");

  return <AgencySettingsClient initialName={agency.name} email={agency.email} />;
}
