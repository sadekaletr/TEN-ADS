import { notDeleted } from "@/lib/db";

import { prisma } from "@/lib/prisma";

import { SponsorLeaderboardList } from "@/components/leaderboard/SponsorLeaderboardList";

import { CircuitPageBackground } from "@/components/ui/CircuitPageBackground";



export default async function SponsorLeaderboardPage({

  params,

}: {

  params: { city: string };

}) {

  const city = decodeURIComponent(params.city);



  const sponsors = await prisma.sponsor.findMany({

    where: { city, deletedAt: null, currentStreak: { gt: 0 } },

    orderBy: { currentStreak: "desc" },

    take: 10,

  });



  return (

    <CircuitPageBackground>

      <main className="mx-auto min-h-screen max-w-lg px-4 py-12">

        <h1 className="font-brand text-2xl font-semibold text-warm-white">

          الأنشط في {city}

        </h1>

        <p className="mb-8 text-sm text-dim">ترتيب حسب Streak الأسبوعي</p>

        <SponsorLeaderboardList sponsors={sponsors} />

      </main>

    </CircuitPageBackground>

  );

}

