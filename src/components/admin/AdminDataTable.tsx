"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

export type AdminColumn<T> = {
  key: string;
  header: string;
  render: (row: T) => React.ReactNode;
  sortValue?: (row: T) => string | number;
  className?: string;
};

interface AdminDataTableProps<T> {
  data: T[];
  columns: AdminColumn<T>[];
  searchPlaceholder?: string;
  searchFilter?: (row: T, query: string) => boolean;
  rowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  className?: string;
}

export function AdminDataTable<T>({
  data,
  columns,
  searchPlaceholder = "بحث...",
  searchFilter,
  rowKey,
  onRowClick,
  emptyMessage = "لا توجد نتائج",
  className,
}: AdminDataTableProps<T>) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const filtered = useMemo(() => {
    let rows = data;
    if (query.trim() && searchFilter) {
      rows = rows.filter((r) => searchFilter(r, query.trim().toLowerCase()));
    }
    if (sortKey) {
      const col = columns.find((c) => c.key === sortKey);
      if (col?.sortValue) {
        rows = [...rows].sort((a, b) => {
          const av = col.sortValue!(a);
          const bv = col.sortValue!(b);
          const cmp =
            typeof av === "number" && typeof bv === "number"
              ? av - bv
              : String(av).localeCompare(String(bv), "ar");
          return sortDir === "asc" ? cmp : -cmp;
        });
      }
    }
    return rows;
  }, [data, query, searchFilter, sortKey, sortDir, columns]);

  function toggleSort(key: string) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  return (
    <div className={cn("space-y-3", className)}>
      {searchFilter && (
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={searchPlaceholder}
          className="max-w-sm"
        />
      )}
      <div className="overflow-x-auto rounded-xl border border-gold-4/20">
        <table className="w-full min-w-[480px] text-sm">
          <thead>
            <tr className="border-b border-gold-4/20 bg-surface-2/40 text-dim">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "px-3 py-2.5 text-start font-medium",
                    col.sortValue && "cursor-pointer select-none hover:text-gold-2",
                    col.className
                  )}
                  onClick={col.sortValue ? () => toggleSort(col.key) : undefined}
                >
                  {col.header}
                  {sortKey === col.key && (sortDir === "asc" ? " ↑" : " ↓")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-3 py-8 text-center text-dim">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              filtered.map((row) => (
                <tr
                  key={rowKey(row)}
                  className={cn(
                    "border-b border-gold-4/10 transition-colors",
                    onRowClick && "cursor-pointer hover:bg-gold-2/5"
                  )}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                >
                  {columns.map((col) => (
                    <td key={col.key} className={cn("px-3 py-2.5", col.className)}>
                      {col.render(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-dim">
        {filtered.length} / {data.length}
      </p>
    </div>
  );
}
