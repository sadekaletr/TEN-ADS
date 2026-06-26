import { prisma } from "@/lib/prisma";

/** Storage key prefixes for private blobs. */
export const STORAGE_PREFIX = {
  topupProof: "topup-proofs/",
  verification: "verifications/",
} as const;

export function storageKeyFromProofUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.startsWith("/api/storage/")) {
    return decodeURIComponent(url.replace("/api/storage/", ""));
  }
  return null;
}

/**
 * Returns true if the user may read a private storage object.
 * Admin: all keys. Creator: own top-up proofs and campaign verification photos.
 */
export async function canAccessStorageKey(
  key: string,
  user: { id: string; role: string }
): Promise<boolean> {
  if (user.role === "admin") return true;
  if (user.role !== "creator") return false;

  if (key.startsWith(STORAGE_PREFIX.topupProof)) {
    const requestId = key.split("/")[1];
    if (!requestId) return false;
    const req = await prisma.topUpRequest.findFirst({
      where: { id: requestId, creatorId: user.id },
      select: { id: true },
    });
    return Boolean(req);
  }

  if (key.startsWith(STORAGE_PREFIX.verification)) {
    const redemptionId = key.split("/")[1];
    if (!redemptionId) return false;
    const redemption = await prisma.redemption.findFirst({
      where: {
        id: redemptionId,
        campaign: { creatorId: user.id },
      },
      select: { id: true },
    });
    return Boolean(redemption);
  }

  return false;
}
