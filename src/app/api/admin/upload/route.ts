import { NextResponse } from "next/server";
import { storePublicImage } from "@/lib/public-asset-storage";
import { getAdminSession } from "@/lib/session-auth";

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("file");
  const creatorId = formData.get("creatorId");
  const kind = formData.get("kind");

  if (!(file instanceof File) || typeof creatorId !== "string" || !creatorId) {
    return NextResponse.json({ error: "Missing file or creatorId" }, { status: 400 });
  }
  if (kind !== "cover" && kind !== "avatar") {
    return NextResponse.json({ error: "Invalid kind" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const mime = file.type || "image/jpeg";

  try {
    const url = await storePublicImage(creatorId, kind, buffer, mime);
    return NextResponse.json({ ok: true, url });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
