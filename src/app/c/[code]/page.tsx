import { notFound } from "next/navigation";
import { lookupCode } from "@/app/redeem/actions";
import { isCollaboratorRef, isConsumerReferralRef } from "@/lib/referral/token";
import { RedeemFlow } from "@/components/redeem/RedeemFlow";

export default async function CodeRedeemPage({
  params,
  searchParams,
}: {
  params: { code: string };
  searchParams: { ref?: string };
}) {
  const code = decodeURIComponent(params.code).toUpperCase();
  const campaign = await lookupCode(code);
  if (!campaign) notFound();

  const ref = searchParams.ref;
  const trackingRef = isCollaboratorRef(ref) ? ref?.toUpperCase() : undefined;
  const consumerRef = isConsumerReferralRef(ref) ? ref : undefined;

  return (
    <RedeemFlow
      campaign={campaign}
      code={code}
      trackingRef={trackingRef}
      consumerRef={consumerRef}
    />
  );
}
