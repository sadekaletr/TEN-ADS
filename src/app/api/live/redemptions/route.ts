import { NextResponse } from "next/server";
import { notDeleted } from "@/lib/db";
import {
  getRedemptionChannel,
  getRedisSubscriber,
  type RedemptionLivePayload,
} from "@/lib/events/publish";
import { prisma } from "@/lib/prisma";
import { getCreatorSession } from "@/lib/session-auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const session = await getCreatorSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const poll = searchParams.get("poll");

  if (poll === "1") {
    const campaigns = await prisma.campaign.findMany({
      where: { creatorId: session.user.id, ...notDeleted },
      select: { id: true },
    });
    const ids = campaigns.map((c) => c.id);
    const recent = await prisma.redemption.findMany({
      where: { campaignId: { in: ids } },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { campaign: { select: { prizeName: true, creatorId: true } } },
    });
    const payloads: RedemptionLivePayload[] = recent.map((r) => ({
      id: r.id,
      campaignId: r.campaignId,
      creatorId: r.campaign.creatorId,
      city: r.city,
      prizeName: r.campaign.prizeName,
      createdAt: r.createdAt.toISOString(),
    }));
    return NextResponse.json({ items: payloads });
  }

  const encoder = new TextEncoder();
  const subscriber = await getRedisSubscriber();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: RedemptionLivePayload) => {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
        );
      };

      controller.enqueue(encoder.encode(": connected\n\n"));

      if (!subscriber) {
        const interval = setInterval(async () => {
          try {
            const campaigns = await prisma.campaign.findMany({
              where: { creatorId: session.user.id, ...notDeleted },
              select: { id: true },
            });
            const ids = campaigns.map((c) => c.id);
            const latest = await prisma.redemption.findFirst({
              where: { campaignId: { in: ids } },
              orderBy: { createdAt: "desc" },
              include: {
                campaign: { select: { prizeName: true, creatorId: true } },
              },
            });
            if (latest) {
              send({
                id: latest.id,
                campaignId: latest.campaignId,
                creatorId: latest.campaign.creatorId,
                city: latest.city,
                prizeName: latest.campaign.prizeName,
                createdAt: latest.createdAt.toISOString(),
              });
            }
          } catch {
            // ignore poll errors
          }
        }, 5000);

        req.signal.addEventListener("abort", () => {
          clearInterval(interval);
          controller.close();
        });
        return;
      }

      const channel = getRedemptionChannel();
      await subscriber.subscribe(channel);

      subscriber.on("message", (_ch, message) => {
        try {
          const payload = JSON.parse(message) as RedemptionLivePayload;
          if (payload.creatorId === session.user.id) {
            send(payload);
          }
        } catch {
          // ignore malformed
        }
      });

      req.signal.addEventListener("abort", () => {
        subscriber.unsubscribe(channel).catch(() => {});
        subscriber.disconnect();
        controller.close();
      });
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
