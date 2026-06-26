import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { isBlobStorageEnabled } from "@/lib/blob-storage";

const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_BYTES = 5 * 1024 * 1024;

export function validatePublicImage(
  buffer: Buffer,
  mime: string
): { ok: true } | { ok: false; error: string } {
  if (!ALLOWED_MIME.has(mime)) {
    return { ok: false, error: "نوع الملف غير مدعوم — استخدم JPEG أو PNG أو WebP" };
  }
  if (buffer.length > MAX_BYTES) {
    return { ok: false, error: "حجم الملف يتجاوز 5 ميجابايت" };
  }
  const isJpeg = buffer[0] === 0xff && buffer[1] === 0xd8;
  const isPng =
    buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47;
  const isWebp =
    buffer.length > 12 &&
    buffer.slice(0, 4).toString() === "RIFF" &&
    buffer.slice(8, 12).toString() === "WEBP";
  if (!isJpeg && !isPng && !isWebp) {
    return { ok: false, error: "ملف الصورة غير صالح" };
  }
  return { ok: true };
}

function extFromMime(mime: string): string {
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  return "jpg";
}

/**
 * Store a public image (creator cover/avatar). Returns URL path served from /uploads/...
 */
export async function storePublicImage(
  creatorId: string,
  kind: "cover" | "avatar",
  buffer: Buffer,
  mime: string
): Promise<string> {
  const validation = validatePublicImage(buffer, mime);
  if (!validation.ok) throw new Error(validation.error);

  const ext = extFromMime(mime);
  const relativeKey = `creators/${creatorId}/${kind}.${ext}`;

  if (isBlobStorageEnabled()) {
    const endpoint = process.env.STORAGE_ENDPOINT!.replace(/\/$/, "");
    const bucket = process.env.STORAGE_BUCKET!;
    const url = `${endpoint}/${bucket}/public/${relativeKey}`;
    const res = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": mime,
        Authorization: `Bearer ${process.env.STORAGE_ACCESS_KEY}`,
      },
      body: new Uint8Array(buffer),
    });
    if (!res.ok) throw new Error("فشل رفع الصورة إلى التخزين");
    return `/uploads/${relativeKey}`;
  }

  const dir = path.join(process.cwd(), "public", "uploads", "creators", creatorId);
  await mkdir(dir, { recursive: true });
  const full = path.join(dir, `${kind}.${ext}`);
  await writeFile(full, buffer);
  return `/uploads/${relativeKey}`;
}
