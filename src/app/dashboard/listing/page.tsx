import { redirect } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { CreatorListingForm } from "@/components/marketplace/CreatorListingForm";
import { getCreatorSession } from "@/lib/session-auth";
import { prisma } from "@/lib/prisma";

export default async function CreatorListingPage() {
  const session = await getCreatorSession();
  if (!session) redirect("/login");

  const listing = await prisma.creatorListing.findUnique({
    where: { creatorId: session.user.id },
  });

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <PageHeader
        title="قائمتي في Marketplace"
        description="تحكّم بظهورك أمام الرعاة"
      />
      <CreatorListingForm initial={listing} />
    </div>
  );
}
