import { ImageResponse } from "next/og";
import { NextResponse } from "next/server";
import JSZip from "jszip";
import { prisma } from "@/lib/prisma";
import { getCreatorSession } from "@/lib/session-auth";
import { notDeleted } from "@/lib/db";
import { generateQrPng } from "@/lib/qr";

async function assertOwner(campaignId: string) {
  const session = await getCreatorSession();
  if (!session) return null;
  const campaign = await prisma.campaign.findFirst({
    where: { id: campaignId, creatorId: session.user.id, ...notDeleted },
    include: { sponsor: true, codes: { take: 1, orderBy: { id: "asc" } } },
  });
  return campaign;
}

function assetImage(title: string, subtitle: string, size: { width: number; height: number }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#050406",
          color: "#f0c97a",
          fontFamily: "sans-serif",
          padding: 48,
        }}
      >
        <div style={{ fontSize: 36, fontWeight: 700, textAlign: "center" }}>{title}</div>
        <div style={{ fontSize: 20, marginTop: 16, color: "#9a9180" }}>{subtitle}</div>
        <div style={{ fontSize: 14, marginTop: 32, color: "#f0c97a" }}>TENEGTA Spark</div>
      </div>
    ),
    size
  );
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const campaign = await assertOwner(params.id);
  if (!campaign) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format") ?? "post";
  const code = (
    searchParams.get("code") ??
    campaign.codes[0]?.code ??
    "SPARK"
  ).toUpperCase();

  if (format === "zip") {
    const zip = new JSZip();
    const story = await assetImage(campaign.title, campaign.prizeName, {
      width: 1080,
      height: 1920,
    });
    const post = await assetImage(campaign.title, campaign.sponsor.name, {
      width: 1080,
      height: 1080,
    });
    const wa = await assetImage(campaign.prizeName, `كود: ${code}`, {
      width: 800,
      height: 420,
    });
    const qr = await generateQrPng(code);
    zip.file("story.png", Buffer.from(await story.arrayBuffer()));
    zip.file("post.png", Buffer.from(await post.arrayBuffer()));
    zip.file("whatsapp.png", Buffer.from(await wa.arrayBuffer()));
    zip.file(`qr-${code}.png`, Buffer.from(qr));
    const blob = await zip.generateAsync({ type: "nodebuffer" });
    return new NextResponse(new Uint8Array(blob), {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="campaign-${params.id}-assets.zip"`,
      },
    });
  }

  if (format === "story") {
    return assetImage(campaign.title, campaign.prizeName, { width: 1080, height: 1920 });
  }
  if (format === "whatsapp") {
    return assetImage(campaign.prizeName, `كود: ${code}`, { width: 800, height: 420 });
  }
  return assetImage(campaign.title, campaign.sponsor.name, { width: 1080, height: 1080 });
}
