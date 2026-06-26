import { redirect } from "next/navigation";

export default function CampaignFraudPage({ params }: { params: { id: string } }) {
  redirect(`/dashboard/campaigns/${params.id}/analytics`);
}
