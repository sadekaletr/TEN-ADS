/**
 * Smoke checks for beta readiness — run: npm run test:smoke
 */
import { existsSync } from "fs";
import path from "path";

const required = [
  "src/lib/beta-metrics.ts",
  "src/lib/storage-access.ts",
  "src/lib/landing/sponsors.ts",
  "docs/ops-playbooks.md",
  "docs/beta-cohort-runbook.md",
  "docs/security-permissions-matrix.md",
  "prisma/seed.beta-volume.ts",
];

let failed = 0;

for (const file of required) {
  const full = path.join(process.cwd(), file);
  if (!existsSync(full)) {
    console.error(`MISSING: ${file}`);
    failed++;
  }
}

if (failed > 0) {
  console.error(`Smoke failed: ${failed} missing file(s)`);
  process.exit(1);
}

console.log("Smoke OK:", required.length, "beta artifacts present");
