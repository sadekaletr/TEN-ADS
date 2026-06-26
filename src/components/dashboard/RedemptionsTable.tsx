"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { formatDateTime } from "@/lib/format";
import type { Redemption } from "@prisma/client";

interface RedemptionsTableProps {
  redemptions: Redemption[];
}

export function RedemptionsTable({ redemptions }: RedemptionsTableProps) {
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("");

  const cities = useMemo(
    () =>
      Array.from(
        new Set(
          redemptions.map((r) => r.city).filter((c): c is string => !!c)
        )
      ),
    [redemptions]
  );

  const withProof = redemptions.filter((r) => r.verificationPhotoUrl);

  const filtered = redemptions.filter((r) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      r.fullName.toLowerCase().includes(q) ||
      r.phone.includes(q);
    const matchCity = !cityFilter || r.city === cityFilter;
    return matchSearch && matchCity;
  });

  return (
    <div className="space-y-4">
      {withProof.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-medium text-gold-1">إثباتات الاستلام</h3>
          <div className="flex flex-wrap gap-2">
            {withProof.map((r) => (
              <a
                key={r.id}
                href={r.verificationPhotoUrl!}
                target="_blank"
                rel="noopener noreferrer"
                className="block overflow-hidden rounded border border-gold-4/20"
              >
                <Image
                  src={r.verificationPhotoUrl!}
                  alt={r.fullName}
                  width={64}
                  height={64}
                  className="h-16 w-16 object-cover"
                  unoptimized
                />
              </a>
            ))}
          </div>
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        <input
          placeholder="بحث بالاسم أو الهاتف"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded border border-gold-4/30 bg-surface-2 px-3 py-1.5 text-sm"
        />
        <select
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
          className="rounded border border-gold-4/30 bg-surface-2 px-3 py-1.5 text-sm"
        >
          <option value="">كل المدن</option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <div className="overflow-x-auto rounded border border-gold-4/20">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gold-4/20 text-dim">
              <th className="px-3 py-2 text-right">الاسم</th>
              <th className="px-3 py-2 text-right">الهاتف</th>
              <th className="px-3 py-2 text-right">المدينة</th>
              <th className="px-3 py-2 text-right">الكود</th>
              <th className="px-3 py-2 text-right">إثبات</th>
              <th className="px-3 py-2 text-right">الوقت</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-3 py-8 text-center text-dimmer">
                  لا توجد استردادات
                </td>
              </tr>
            ) : (
              filtered.map((r) => (
                <tr key={r.id} className="border-b border-gold-4/10">
                  <td className="px-3 py-2">{r.fullName}</td>
                  <td className="px-3 py-2 font-mono text-xs">{r.phone}</td>
                  <td className="px-3 py-2">{r.city ?? "—"}</td>
                  <td className="px-3 py-2 font-mono text-xs">{r.codeUsed}</td>
                  <td className="px-3 py-2">
                    {r.verificationPhotoUrl ? (
                      <a
                        href={r.verificationPhotoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-gold-2 underline"
                      >
                        عرض
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-3 py-2 text-dim">
                    {formatDateTime(r.createdAt)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
