import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getPrivateFile } from "@/lib/blob-storage";
import { canAccessStorageKey } from "@/lib/storage-access";

const EXT_MIME: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
};

function contentTypeForKey(key: string): string {
  const ext = key.split(".").pop()?.toLowerCase() ?? "jpg";
  return EXT_MIME[ext] ?? "application/octet-stream";
}

export async function GET(
  _req: Request,
  { params }: { params: { key: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const key = decodeURIComponent(params.key);
  if (key.includes("..")) {
    return NextResponse.json({ error: "Invalid key" }, { status: 400 });
  }

  const allowed = await canAccessStorageKey(key, {
    id: session.user.id,
    role: session.user.role ?? "creator",
  });
  if (!allowed) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const buf = await getPrivateFile(key);
    return new NextResponse(new Uint8Array(buf), {
      headers: {
        "Content-Type": contentTypeForKey(key),
        "Cache-Control": "private, no-store",
      },
    });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
