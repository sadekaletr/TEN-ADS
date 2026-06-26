import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const agg = await prisma.creator.aggregate({ _sum: { walletBalance: true } });
  const returned = agg._sum.walletBalance ?? 0;

  await prisma.creator.updateMany({ data: { walletBalance: 0 } });
  await prisma.$executeRaw`
    UPDATE "PlatformSettings"
    SET "sparkTreasuryBalance" = 5000
    WHERE id = 'default'
  `;
  await prisma.$executeRaw`
    INSERT INTO "PlatformSettings" (id, "transferMethod", "transferAccount", "sparkTreasuryBalance", "updatedAt")
    SELECT 'default', 'ShamCash', '', 5000, NOW()
    WHERE NOT EXISTS (SELECT 1 FROM "PlatformSettings" WHERE id = 'default')
  `;

  console.log(`Creators zeroed. Previous distributed: ${returned}. Treasury set to 5000.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
