/**
 * Post-deploy verification — run after production deploy.
 * Usage: npx tsx scripts/post-deploy.ts
 */
import { prisma } from "../src/lib/prisma";

const REQUIRED_ENV = [
  "DATABASE_URL",
  "NEXTAUTH_URL",
  "NEXTAUTH_SECRET",
  "RATE_LIMIT_INTERNAL_SECRET",
] as const;

const RECOMMENDED_ENV = ["REDIS_URL", "RESEND_API_KEY", "EMAIL_FROM"] as const;

function checkEnv() {
  const missing: string[] = [];
  const warnings: string[] = [];

  for (const key of REQUIRED_ENV) {
    if (!process.env[key]?.trim()) missing.push(key);
  }
  for (const key of RECOMMENDED_ENV) {
    if (!process.env[key]?.trim()) warnings.push(key);
  }

  if (process.env.NODE_ENV === "production" && process.env.ENABLE_DESIGN_PREVIEW === "1") {
    warnings.push("ENABLE_DESIGN_PREVIEW=1 (design preview exposed in production)");
  }

  return { missing, warnings };
}

async function checkTreasury() {
  const settings = await prisma.platformSettings.findUnique({ where: { id: "default" } });
  const balance = settings?.sparkTreasuryBalance ?? 0;
  if (balance <= 0) {
    return { ok: false, message: `Treasury balance is ${balance} — set sparkTreasuryBalance before launch` };
  }
  return { ok: true, message: `Treasury balance: ${balance} Spark` };
}

async function checkTransferAccount() {
  const settings = await prisma.platformSettings.findUnique({ where: { id: "default" } });
  const account = settings?.transferAccount?.trim() ?? "";
  if (!account) {
    return { ok: false, message: "transferAccount is empty — configure ShamCash in admin wallet" };
  }
  return { ok: true, message: `Transfer account configured (${settings?.transferMethod ?? "ShamCash"})` };
}

async function main() {
  console.log("=== TENEGTA Spark post-deploy checks ===\n");

  const { missing, warnings } = checkEnv();
  if (missing.length) {
    console.error("FAIL — missing required env:");
    missing.forEach((k) => console.error(`  - ${k}`));
    process.exit(1);
  }
  console.log("OK — required env present");
  if (warnings.length) {
    console.warn("WARN — recommended env missing:");
    warnings.forEach((k) => console.warn(`  - ${k}`));
  }

  const treasury = await checkTreasury();
  console.log(treasury.ok ? `OK — ${treasury.message}` : `WARN — ${treasury.message}`);

  const transfer = await checkTransferAccount();
  console.log(transfer.ok ? `OK — ${transfer.message}` : `WARN — ${transfer.message}`);

  const ledgerCount = await prisma.treasuryLedger.count();
  console.log(`INFO — TreasuryLedger entries: ${ledgerCount}`);

  console.log("\n=== Done ===");
  if (!treasury.ok || !transfer.ok) process.exit(2);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
