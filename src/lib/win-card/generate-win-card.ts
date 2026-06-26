export type WinCardOptions = {
  prizeName: string;
  sponsorName: string;
  campaignTitle: string;
  campaignSlug?: string | null;
  qrCode?: string | null;
  reference: string;
  winnerLabel?: string;
  format?: "story" | "og";
};

export async function generateWinCardBlob(options: WinCardOptions): Promise<Blob> {
  const format = options.format ?? "story";
  const w = format === "story" ? 1080 : 1200;
  const h = format === "story" ? 1920 : 630;

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unsupported");

  const grad = ctx.createRadialGradient(w / 2, h * 0.2, 0, w / 2, h / 2, w);
  grad.addColorStop(0, "#16140f");
  grad.addColorStop(1, "#030304");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = "rgba(212, 168, 85, 0.35)";
  ctx.lineWidth = 4;
  ctx.strokeRect(48, 48, w - 96, h - 96);

  ctx.font = "bold 42px Syne, sans-serif";
  ctx.fillStyle = "#9a6e20";
  ctx.textAlign = "center";
  ctx.fillText("TENEGTA SPARK", w / 2, format === "story" ? 160 : 100);

  ctx.font = "bold 64px Syne, sans-serif";
  ctx.fillStyle = "#f0c97a";
  const winner = options.winnerLabel ?? "فائز جديد!";
  ctx.fillText(winner, w / 2, format === "story" ? 280 : 200);

  ctx.font = "36px Syne, sans-serif";
  ctx.fillStyle = "#f0c97a";
  wrapText(ctx, options.prizeName, w / 2, format === "story" ? 400 : 300, w - 160, 44);

  ctx.font = "28px sans-serif";
  ctx.fillStyle = "#b8aea0";
  ctx.fillText(`برعاية ${options.sponsorName}`, w / 2, format === "story" ? 560 : 420);

  ctx.font = "22px monospace";
  ctx.fillStyle = "#9a9180";
  ctx.fillText(options.reference, w / 2, format === "story" ? h - 280 : h - 80);

  if (options.qrCode) {
    try {
      const qrRes = await fetch(
        `/api/qr/${encodeURIComponent(options.qrCode)}`
      );
      if (qrRes.ok) {
        const qrBlob = await qrRes.blob();
        const qrImg = await loadImage(URL.createObjectURL(qrBlob));
        const qrSize = format === "story" ? 140 : 100;
        ctx.drawImage(qrImg, w / 2 - qrSize / 2, h - (format === "story" ? 240 : 180), qrSize, qrSize);
        URL.revokeObjectURL(qrImg.src);
      }
    } catch {
      // QR optional
    }
  }

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Failed to export PNG"));
    }, "image/png");
  });
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(/\s+/);
  let line = "";
  let cy = y;
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, cy);
      line = word;
      cy += lineHeight;
    } else {
      line = test;
    }
  }
  if (line) ctx.fillText(line, x, cy);
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
