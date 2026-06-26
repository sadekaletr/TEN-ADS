interface CollaboratorRow {
  id: string;
  sharePercentage: number;
  trackingCode: string;
  redemptionsCount: number;
  creator: { name: string; handle: string };
}

export function CollaboratorComparison({
  collaborators,
  ownerName,
  ownerShare,
}: {
  collaborators: CollaboratorRow[];
  ownerName: string;
  ownerShare: number;
}) {
  if (collaborators.length === 0) return null;

  const rows = [
    {
      name: ownerName,
      handle: "المالك",
      share: ownerShare,
      redemptions: 0,
      code: "—",
    },
    ...collaborators.map((c) => ({
      name: c.creator.name,
      handle: c.creator.handle,
      share: c.sharePercentage,
      redemptions: c.redemptionsCount,
      code: c.trackingCode,
    })),
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gold-4/20 text-dim">
            <th className="px-3 py-2 text-right">الشريك</th>
            <th className="px-3 py-2 text-right">النسبة</th>
            <th className="px-3 py-2 text-right">الاستردادات</th>
            <th className="px-3 py-2 text-right">كود التتبع</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.handle + r.code} className="border-b border-gold-4/10">
              <td className="px-3 py-2">
                {r.name}
                <span className="mr-1 text-xs text-dim">@{r.handle}</span>
              </td>
              <td className="px-3 py-2 font-mono">{r.share}%</td>
              <td className="px-3 py-2 font-mono text-gold-1">
                {r.redemptions}
              </td>
              <td className="px-3 py-2 font-mono text-xs text-dim">{r.code}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
