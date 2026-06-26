import { NextResponse } from "next/server";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  renderToBuffer,
} from "@react-pdf/renderer";
import { getCreatorSession, getSponsorSession } from "@/lib/session-auth";
import { prisma } from "@/lib/prisma";
import { getCampaignAnalytics } from "@/lib/analytics";

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: "Helvetica" },
  title: { fontSize: 18, marginBottom: 8 },
  subtitle: { fontSize: 12, marginBottom: 20, color: "#666" },
  row: { fontSize: 10, marginBottom: 6 },
  header: { fontSize: 11, marginBottom: 12, fontWeight: "bold" },
  slide: { marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid #ccc" },
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  if (type === "pitch") {
    const session = await getSponsorSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const ids = (searchParams.get("ids") ?? "").split(",").filter(Boolean).slice(0, 4);
    if (ids.length === 0) {
      return NextResponse.json({ error: "Missing ids" }, { status: 400 });
    }

    const campaigns = await prisma.campaign.findMany({
      where: { id: { in: ids }, sponsorId: session.user.id },
      include: { sponsor: true },
    });

    const slideNodes = await Promise.all(
      campaigns.map(async (c) => {
        const analytics = await getCampaignAnalytics(c.id);
        const roi =
          c.prizeClaimed > 0
            ? (
                analytics.funnel.redemptions /
                Math.max(c.prizeClaimed * c.costPerRedemption, 1)
              ).toFixed(1)
            : "0";
        return (
          <View key={c.id} style={styles.slide}>
            <Text style={styles.header}>{c.title}</Text>
            <Text style={styles.row}>Prize: {c.prizeName}</Text>
            <Text style={styles.row}>
              Redemptions: {c.prizeClaimed} / {c.prizeQuantity}
            </Text>
            <Text style={styles.row}>Views: {analytics.funnel.views}</Text>
            <Text style={styles.row}>ROI estimate: {roi}x</Text>
          </View>
        );
      })
    );

    const doc = (
      <Document>
        <Page size="A4" style={styles.page}>
          <Text style={styles.title}>TENEGTA Spark — ROI Pitch</Text>
          <Text style={styles.subtitle}>{campaigns[0]?.sponsor.name ?? "Sponsor"}</Text>
          {slideNodes}
        </Page>
      </Document>
    );

    const buffer = await renderToBuffer(doc);
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="tenegta-pitch-roi.pdf"`,
      },
    });
  }

  const session = await getCreatorSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const campaignId = searchParams.get("campaignId");
  if (!campaignId) {
    return NextResponse.json({ error: "Missing campaignId" }, { status: 400 });
  }

  const campaign = await prisma.campaign.findFirst({
    where: { id: campaignId, creatorId: session.user.id },
    include: { sponsor: true, redemptions: { orderBy: { createdAt: "asc" } } },
  });

  if (!campaign) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const doc = (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>TENEGTA Spark</Text>
        <Text style={styles.subtitle}>
          {campaign.title} — {campaign.sponsor.name}
        </Text>
        <Text style={styles.header}>Winners list</Text>
        {campaign.redemptions.map((r, i) => (
          <Text key={r.id} style={styles.row}>
            {i + 1}. {r.fullName} | {r.phone} | {r.city ?? "—"} | {r.codeUsed}
          </Text>
        ))}
      </Page>
    </Document>
  );

  const buffer = await renderToBuffer(doc);
  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="spark-winners.pdf"`,
    },
  });
}
