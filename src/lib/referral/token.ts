import { createHmac } from "crypto";
import { hashPhone } from "@/lib/session";

const REF_PREFIX = "ref_";

function sign(payload: string): string {
  const secret = process.env.NEXTAUTH_SECRET ?? "dev-secret";
  return createHmac("sha256", secret).update(payload).digest("base64url").slice(0, 16);
}

export function createReferralToken(phone: string, campaignId: string): string {
  const phoneHash = hashPhone(phone);
  const payload = `${phoneHash}:${campaignId}`;
  const sig = sign(payload);
  return `${REF_PREFIX}${Buffer.from(payload).toString("base64url")}.${sig}`;
}

export function parseReferralToken(
  token: string
): { phoneHash: string; campaignId: string } | null {
  if (!token.startsWith(REF_PREFIX)) return null;
  const body = token.slice(REF_PREFIX.length);
  const [encoded, sig] = body.split(".");
  if (!encoded || !sig) return null;
  try {
    const payload = Buffer.from(encoded, "base64url").toString("utf8");
    if (sign(payload) !== sig) return null;
    const [phoneHash, campaignId] = payload.split(":");
    if (!phoneHash || !campaignId) return null;
    return { phoneHash, campaignId };
  } catch {
    return null;
  }
}

export function isConsumerReferralRef(ref: string | undefined): boolean {
  return Boolean(ref?.startsWith(REF_PREFIX));
}

export function isCollaboratorRef(ref: string | undefined): boolean {
  return Boolean(ref?.toUpperCase().startsWith("TRACK-"));
}
