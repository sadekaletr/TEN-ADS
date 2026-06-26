import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";

export function isBlobStorageEnabled(): boolean {
  if (process.env.STORAGE_PROVIDER === "s3") return true;
  return Boolean(process.env.STORAGE_ENDPOINT && process.env.STORAGE_BUCKET);
}

/** When STORAGE_* is set, reads still use local disk unless STORAGE_READ_CANARY=1 */
export function isBlobReadCanaryEnabled(): boolean {
  if (!isBlobStorageEnabled()) return false;
  return process.env.STORAGE_READ_CANARY === "1";
}

function blobUrl(key: string): string {
  const endpoint = process.env.STORAGE_ENDPOINT!.replace(/\/$/, "");
  const bucket = process.env.STORAGE_BUCKET!;
  return `${endpoint}/${bucket}/${key}`;
}

/**
 * Store a private file. Returns a URL path or signed URL.
 * Local dev: writes under storage/ (not public/).
 * Production: set STORAGE_* env for S3-compatible upload.
 */
export async function storePrivateFile(
  key: string,
  buffer: Buffer,
  contentType: string
): Promise<string> {
  if (isBlobStorageEnabled()) {
    const url = blobUrl(key);
    await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": contentType,
        Authorization: `Bearer ${process.env.STORAGE_ACCESS_KEY}`,
      },
      body: new Uint8Array(buffer),
    });
    return `/api/storage/${encodeURIComponent(key)}`;
  }

  const dir = path.join(process.cwd(), "storage", path.dirname(key));
  await mkdir(dir, { recursive: true });
  const full = path.join(process.cwd(), "storage", key);
  await writeFile(full, buffer);
  return `/api/storage/${encodeURIComponent(key)}`;
}

/** Read a private file from S3-compatible storage or local disk. */
export async function getPrivateFile(key: string): Promise<Buffer> {
  if (isBlobReadCanaryEnabled()) {
    const url = blobUrl(key);
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.STORAGE_ACCESS_KEY}`,
      },
    });
    if (!res.ok) {
      throw new Error(`Blob read failed: ${res.status}`);
    }
    const ab = await res.arrayBuffer();
    return Buffer.from(ab);
  }

  const full = path.join(process.cwd(), "storage", key);
  return readFile(full);
}
