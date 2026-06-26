"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/session-auth";

export async function updateTransferSettings(data: {
  transferMethod: string;
  transferAccount: string;
  transferInstructions: string;
}) {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");

  await prisma.platformSettings.upsert({
    where: { id: "default" },
    create: {
      id: "default",
      transferMethod: data.transferMethod,
      transferAccount: data.transferAccount,
      transferInstructions: data.transferInstructions,
    },
    update: {
      transferMethod: data.transferMethod,
      transferAccount: data.transferAccount,
      transferInstructions: data.transferInstructions,
    },
  });

  revalidatePath("/admin/settings");
  revalidatePath("/admin/settings/transfer");
  revalidatePath("/dashboard/wallet/topup");
}
