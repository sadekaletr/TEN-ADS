import type { Redemption, Campaign, Sponsor } from "@prisma/client";

export function toCsv(
  campaign: Campaign & { sponsor: Sponsor },
  redemptions: Redemption[]
): string {
  const header = "الاسم,الهاتف,العنوان,المدينة,الكود,التاريخ";
  const rows = redemptions.map((r) =>
    [
      r.fullName,
      r.phone,
      r.address ?? "",
      r.city ?? "",
      r.codeUsed,
      r.createdAt.toISOString(),
    ]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(",")
  );
  return [header, ...rows].join("\n");
}

export function toWhatsAppText(
  campaign: Campaign & { sponsor: Sponsor },
  redemptions: Redemption[]
): string {
  const lines = [
    `قائمة فائزين — ${campaign.title}`,
    `الراعي: ${campaign.sponsor.name}`,
    "",
    ...redemptions.map(
      (r, i) =>
        `${i + 1}. ${r.fullName} — ${r.phone}${r.city ? ` — ${r.city}` : ""}`
    ),
  ];
  return lines.join("\n");
}
