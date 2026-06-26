"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/SkeletonCard";

export interface DataTableColumn<T> {
  key: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;
  className?: string;
  mono?: boolean;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  emptyMessage?: string;
  filteredEmptyMessage?: string;
  isFiltered?: boolean;
  loading?: boolean;
  loadingRows?: number;
  stickyHeader?: boolean;
  className?: string;
}

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  emptyMessage = "لا توجد بيانات",
  filteredEmptyMessage = "لا نتائج تطابق الفلتر",
  isFiltered = false,
  loading = false,
  loadingRows = 5,
  stickyHeader = true,
  className,
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className={cn("overflow-hidden rounded-xl border border-strong", className)}>
        <div className="border-b border-subtle bg-bg-elevated px-5 py-3">
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="divide-y divide-subtle">
          {Array.from({ length: loadingRows }).map((_, i) => (
            <div key={i} className="flex gap-4 px-5 py-4">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <EmptyState
        variant="premium"
        title={isFiltered ? filteredEmptyMessage : emptyMessage}
        icon="spark"
        className="py-10"
      />
    );
  }

  return (
    <div className={cn("overflow-x-auto rounded-xl border border-strong shadow-surface", className)}>
      <table className="w-full min-w-[520px] text-sm">
        <thead className={cn(stickyHeader && "sticky top-0 z-10")}>
          <tr className="border-b border-strong bg-bg-elevated/95 text-text-secondary backdrop-blur-sm">
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className={cn(
                  "px-5 py-3 text-start font-semibold",
                  col.mono && "font-mono tabular-nums",
                  col.className
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr
              key={rowKey(row)}
              className={cn(
                "border-b border-subtle last:border-0 transition-colors",
                "hover:bg-gold-rich/5 focus-within:bg-gold-rich/5",
                rowIndex % 2 === 1 && "bg-bg-elevated/30"
              )}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={cn(
                    "px-5 py-3.5 align-middle text-text-primary",
                    col.mono && "font-mono tabular-nums",
                    col.className
                  )}
                >
                  {col.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
