import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const creator = await prisma.creator.findFirst({
    where: { email: "creator@tenegta.com" },
  });
  console.log(
    "creator",
    creator
      ? {
          id: creator.id,
          email: creator.email,
          phone: creator.phone,
          hasPassword: Boolean(creator.password),
          deletedAt: creator.deletedAt,
        }
      : null
  );
  if (creator?.password) {
    console.log("demo1234 match", await bcrypt.compare("demo1234", creator.password));
  }

  const admin = await prisma.admin.findUnique({ where: { email: "admin@tenegta.com" } });
  console.log("admin", admin ? { email: admin.email, hasPassword: Boolean(admin.password) } : null);
  if (admin?.password) {
    console.log("admin1234 match", await bcrypt.compare("admin1234", admin.password));
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
