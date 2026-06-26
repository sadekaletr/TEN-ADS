import { redirect } from "next/navigation";
import { getSponsorSession } from "@/lib/session-auth";
import { prisma } from "@/lib/prisma";
import { CircuitCard } from "@/components/ui/CircuitCard";

export default async function SponsorMessagesPage() {
  const session = await getSponsorSession();
  if (!session) redirect("/sponsor/login");

  const threads = await prisma.dealThread.findMany({
    where: { sponsorId: session.user.id },
    include: {
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
    },
    orderBy: { updatedAt: "desc" },
  });

  const creatorIds = Array.from(new Set(threads.map((t) => t.creatorId)));
  const creators = await prisma.creator.findMany({
    where: { id: { in: creatorIds } },
    select: { id: true, name: true, handle: true },
  });
  const creatorMap = new Map(creators.map((c) => [c.id, c]));

  return (
    <main className="space-y-4">
      <h1 className="font-brand text-2xl text-warm-white">الرسائل</h1>
      {threads.length === 0 ? (
        <CircuitCard>
          <p className="text-dim">لا محادثات بعد — ابدأ من السوق أو صفحة الصانع.</p>
        </CircuitCard>
      ) : (
        threads.map((t) => {
          const creator = creatorMap.get(t.creatorId);
          return (
          <CircuitCard key={t.id}>
            <p className="font-medium text-warm-white">{t.subject}</p>
            <p className="text-sm text-dim">{creator?.name ?? "—"}</p>
            {t.messages[0] && (
              <p className="mt-2 truncate text-sm text-dim">{t.messages[0].body}</p>
            )}
          </CircuitCard>
          );
        })
      )}
    </main>
  );
}
