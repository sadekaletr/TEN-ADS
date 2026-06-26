"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/ui/EmptyState";

export interface DataTableColumn<T> {
  key: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  emptyMessage?: string;
  className?: string;
}

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  emptyMessage = "لا توجد بيانات",
  className,
}: DataTableProps<T>) {
  if (rows.length === 0) {
    return (
      <EmptyState
        title={emptyMessage}
        className="py-8"
      />
    );
  }

  return (
    <div className={cn("overflow-x-auto rounded-xl border border-subtle", className)}>
      <table className="w-full min-w-[480px] text-sm">
        <thead>
          <tr className="border-b border-default bg-surface-2/80 text-text-secondary">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn("px-5 py-3 text-right font-medium", col.className)}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={rowKey(row)}
              className="border-b border-subtle last:border-0 transition-colors hover:bg-gold-2/5"
            >
              {columns.map((col) => (
                <td key={col.key} className={cn("px-5 py-3", col.className)}>
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
