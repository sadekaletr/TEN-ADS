import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/** Production seed: admin account + platform defaults only */
export async function seedMinimal() {
  const adminHash = await bcrypt.hash("admin1234", 10);
  await prisma.admin.upsert({
    where: { email: "admin@tenegta.com" },
    create: {
      email: "admin@tenegta.com",
      password: adminHash,
      name: "TENEGTA Admin",
    },
    update: {},
  });

  await prisma.exchangeRate.upsert({
    where: { currency: "SYP" },
    create: { currency: "SYP", sparkUnit: 50_000 },
    update: {},
  });

  await prisma.platformSettings.upsert({
    where: { id: "default" },
    create: { id: "default" },
    update: {},
  });

  console.log("Minimal seed complete (admin + rates + settings)");
}

if (require.main === module) {
  seedMinimal()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
}
