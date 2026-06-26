"use client";

interface QrDownloadsProps {
  campaignId: string;
  codes: { code: string; qrUrl: string | null }[];
  campaignTitle: string;
}

export function QrDownloads({
  campaignId,
  codes,
  campaignTitle,
}: QrDownloadsProps) {
  const primaryCode = codes[0]?.code;

  if (!primaryCode) return null;

  return (
    <div className="space-y-3">
      <p className="text-sm text-dim">تحميل رموز QR للطباعة</p>
      <div className="flex flex-wrap gap-2">
        <a
          href={`/api/qr/${encodeURIComponent(primaryCode)}?format=png`}
          className="rounded border border-gold-2/50 px-3 py-1.5 text-sm text-gold-1 hover:bg-gold-2/10"
          download
        >
          تحميل PNG
        </a>
        <a
          href={`/api/qr/${encodeURIComponent(primaryCode)}?format=svg`}
          className="rounded border border-gold-2/50 px-3 py-1.5 text-sm text-gold-1 hover:bg-gold-2/10"
          download
        >
          تحميل SVG
        </a>
        <a
          href={`/api/qr/${encodeURIComponent(primaryCode)}?format=poster&campaignId=${campaignId}`}
          className="rounded border border-gold-2/50 px-3 py-1.5 text-sm text-gold-1 hover:bg-gold-2/10"
          target="_blank"
          rel="noreferrer"
        >
          ملصق PDF
        </a>
      </div>
      {codes.length > 1 && (
        <p className="text-xs text-dimmer">
          {codes.length} أكواد — يُعرض QR الكود الأول ({primaryCode}). باقي
          الأكواد متاحة في مجلد الحملة.
        </p>
      )}
      <p className="text-xs text-dimmer">{campaignTitle}</p>
    </div>
  );
}
