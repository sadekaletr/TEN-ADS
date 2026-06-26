import crypto from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { sendTransactionalEmail } from "@/lib/email";

export type ResetRole = "creator" | "sponsor" | "admin" | "agency_admin";

const RESET_TTL_MS = 60 * 60 * 1000;

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function requestPasswordReset(email: string, role: ResetRole) {
  const normalized = email.trim().toLowerCase();
  if (!normalized.includes("@")) return { ok: true as const };

  let exists = false;
  if (role === "creator") {
    exists = !!(await prisma.creator.findFirst({ where: { email: normalized } }));
  } else if (role === "sponsor") {
    exists = !!(await prisma.sponsor.findFirst({ where: { email: normalized } }));
  } else if (role === "admin") {
    exists = !!(await prisma.admin.findUnique({ where: { email: normalized } }));
  } else if (role === "agency_admin") {
    exists = !!(await prisma.agency.findUnique({ where: { email: normalized } }));
  }

  if (!exists) return { ok: true as const };

  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + RESET_TTL_MS);

  await prisma.passwordResetToken.deleteMany({ where: { email: normalized, role } });
  await prisma.passwordResetToken.create({
    data: { email: normalized, role, tokenHash, expiresAt },
  });

  const base = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  const link = `${base}/reset-password?token=${rawToken}&role=${role}`;

  await sendTransactionalEmail({
    to: normalized,
    subject: "إعادة تعيين كلمة المرور — TENEGTA Spark",
    html: `<p>اضغط الرابط لإعادة تعيين كلمة المرور (صالح ساعة واحدة):</p><p><a href="${link}">${link}</a></p>`,
  });

  return { ok: true as const };
}

export async function resetPasswordWithToken(
  token: string,
  role: ResetRole,
  newPassword: string
) {
  if (newPassword.length < 8) throw new Error("WEAK_PASSWORD");

  const tokenHash = hashToken(token);
  const record = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
  });
  if (!record || record.role !== role || record.usedAt) {
    throw new Error("INVALID_TOKEN");
  }
  if (record.expiresAt < new Date()) throw new Error("EXPIRED_TOKEN");

  const hash = await bcrypt.hash(newPassword, 10);

  if (role === "creator") {
    await prisma.creator.updateMany({ where: { email: record.email }, data: { password: hash } });
  } else if (role === "sponsor") {
    await prisma.sponsor.updateMany({ where: { email: record.email }, data: { password: hash } });
  } else if (role === "admin") {
    await prisma.admin.update({ where: { email: record.email }, data: { password: hash } });
  } else if (role === "agency_admin") {
    await prisma.agency.update({ where: { email: record.email }, data: { password: hash } });
  }

  await prisma.passwordResetToken.update({
    where: { id: record.id },
    data: { usedAt: new Date() },
  });

  return { ok: true as const };
}
