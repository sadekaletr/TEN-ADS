import { mkdir, writeFile } from "fs/promises";
import path from "path";
import QRCode from "qrcode";

const GOLD = "#d4a855";

export function getRedeemUrl(code: string): string {
  const base = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  return `${base}/c/${encodeURIComponent(code)}`;
}

export async function generateQrSvg(code: string): Promise<string> {
  const url = getRedeemUrl(code);
  const qrSvg = await QRCode.toString(url, {
    type: "svg",
    margin: 2,
    color: { dark: GOLD, light: "#05040600" },
    width: 280,
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 360">
  <rect x="4" y="4" width="312" height="352" rx="12" fill="#0d0c09" stroke="${GOLD}" stroke-width="2"/>
  <foreignObject x="20" y="20" width="280" height="280">${qrSvg}</foreignObject>
  <text x="160" y="330" text-anchor="middle" font-family="monospace" font-size="12" fill="${GOLD}">${code}</text>
</svg>`;
}

export async function generateQrPng(code: string): Promise<Buffer> {
  const url = getRedeemUrl(code);
  return QRCode.toBuffer(url, {
    type: "png",
    margin: 2,
    color: { dark: GOLD, light: "#0d0c09" },
    width: 400,
  });
}

export async function saveCampaignQrFiles(
  campaignId: string,
  code: string
): Promise<string> {
  const dir = path.join(process.cwd(), "public", "qr", campaignId);
  await mkdir(dir, { recursive: true });

  const safeName = code.replace(/[^A-Z0-9-]/gi, "_");
  const pngPath = path.join(dir, `${safeName}.png`);
  const svgPath = path.join(dir, `${safeName}.svg`);

  const [png, svg] = await Promise.all([
    generateQrPng(code),
    generateQrSvg(code),
  ]);

  await Promise.all([
    writeFile(pngPath, png),
    writeFile(svgPath, svg, "utf-8"),
  ]);

  return `/qr/${campaignId}/${safeName}.png`;
}
