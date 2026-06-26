import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export async function dispatchWebhook(
  event: string,
  payload: Record<string, unknown>,
  creatorId?: string
) {
  const endpoints = await prisma.webhookEndpoint.findMany({
    where: {
      active: true,
      ...(creatorId ? { creatorId } : {}),
      events: { has: event },
    },
  });

  await Promise.all(
    endpoints.map(async (ep) => {
      const body = JSON.stringify({ event, payload, ts: Date.now() });
      const sig = crypto.createHmac("sha256", ep.secret).update(body).digest("hex");
      try {
        await fetch(ep.url, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "x-tenegta-signature": sig,
          },
          body,
        });
      } catch (e) {
        console.error("[webhook] dispatch failed", ep.url, e);
      }
    })
  );
}
