import { storePrivateFile } from "@/lib/blob-storage";

const EXT_MIME: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
};

export async function saveTopUpProof(
  requestId: string,
  buffer: Buffer,
  ext: string
): Promise<string> {
  const safeExt = ext.replace(/[^a-z0-9]/gi, "").toLowerCase() || "jpg";
  const key = `topup-proofs/${requestId}/proof.${safeExt}`;
  const contentType = EXT_MIME[safeExt] ?? "image/jpeg";
  return storePrivateFile(key, buffer, contentType);
}
