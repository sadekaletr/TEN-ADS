import { redirect } from "next/navigation";
import { getCreatorSession } from "@/lib/session-auth";

export default async function WalletTopUpAliasPage({
  searchParams,
}: {
  searchParams: { amount?: string; need?: string };
}) {
  const session = await getCreatorSession();
  if (!session) redirect("/login");

  const params = new URLSearchParams();
  if (searchParams.amount) params.set("amount", searchParams.amount);
  if (searchParams.need) params.set("need", searchParams.need);
  const q = params.toString();

  redirect(`/dashboard/wallet/topup${q ? `?${q}` : ""}`);
}
