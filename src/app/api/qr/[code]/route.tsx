import { NextResponse } from "next/server";
import {
  Document,
  Page,
  Text,
  StyleSheet,
  renderToBuffer,
} from "@react-pdf/renderer";
import { prisma } from "@/lib/prisma";
import { generateQrPng, generateQrSvg, getRedeemUrl } from "@/lib/qr";
import { getCreatorSession } from "@/lib/session-auth";

const posterStyles = StyleSheet.create({
  page: { padding: 40, fontFamily: "Helvetica" },
  title: { fontSize: 20, marginBottom: 8 },
  subtitle: { fontSize: 12, marginBottom: 20, color: "#666" },
  code: { fontSize: 14, marginTop: 16 },
  url: { fontSize: 10, marginTop: 8, color: "#888" },
});

export async function GET(
  request: Request,
  { params }: { params: { code: string } }
) {
  const code = decodeURIComponent(params.code).toUpperCase();
  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format") ?? "png";
  const campaignIdParam = searchParams.get("campaignId");

  const campaignCode = await prisma.campaignCode.findFirst({
    where: { code: { equals: code, mode: "insensitive" } },
    include: {
      campaign: { include: { sponsor: true } },
    },
  });

  if (!campaignCode || campaignCode.campaign.deletedAt) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const session = await getCreatorSession();
  const isOwner =
    session?.user.role === "creator" &&
    campaignCode.campaign.creatorId === session.user.id;

  if (!isOwner && format === "poster") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (format === "svg") {
    const svg = await generateQrSvg(code);
    return new NextResponse(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Content-Disposition": `attachment; filename="spark-${code}.svg"`,
      },
    });
  }

  if (format === "poster") {
    const campaign = campaignCode.campaign;
    const doc = (
      <Document>
        <Page size="A4" style={posterStyles.page}>
          <Text style={posterStyles.title}>TENEGTA Spark</Text>
          <Text style={posterStyles.subtitle}>
            {campaign.title} — {campaign.sponsor.name}
          </Text>
          <Text>{campaign.prizeName}</Text>
          <Text style={posterStyles.code}>{code}</Text>
          <Text style={posterStyles.url}>{getRedeemUrl(code)}</Text>
          <Text style={{ marginTop: 20, fontSize: 10 }}>
            امسح الرمز أو أدخل الكود لاستلام جائزتك
          </Text>
        </Page>
      </Document>
    );
    const buffer = await renderToBuffer(doc);
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="spark-poster-${code}.pdf"`,
      },
    });
  }

  const png = await generateQrPng(code);
  return new NextResponse(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Content-Disposition": `attachment; filename="spark-${code}.png"`,
    },
  });
}
