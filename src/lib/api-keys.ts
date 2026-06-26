import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export async function verifyApiKey(rawKey: string) {
  const prefix = rawKey.slice(0, 8);
  const keyHash = crypto.createHash("sha256").update(rawKey).digest("hex");
  const record = await prisma.apiKey.findFirst({
    where: { keyHash, revokedAt: null },
  });
  if (!record || record.prefix !== prefix) return null;
  await prisma.apiKey.update({
    where: { id: record.id },
    data: { lastUsedAt: new Date() },
  });
  return record;
}

export function generateApiKey(): { raw: string; prefix: string; keyHash: string } {
  const raw = `tsk_${crypto.randomBytes(24).toString("hex")}`;
  const prefix = raw.slice(0, 8);
  const keyHash = crypto.createHash("sha256").update(raw).digest("hex");
  return { raw, prefix, keyHash };
}
