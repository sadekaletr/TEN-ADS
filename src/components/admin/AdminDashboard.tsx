"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { CircuitCard } from "@/components/ui/CircuitCard";
import { SparkBadge } from "@/components/ui/SparkBadge";
import { signOut } from "next-auth/react";

interface AdminDashboardProps {
  stats: {
    totalSpark: number;
    activeCampaigns: number;
    totalRedemptions: number;
    pendingTopUps: { length: number } | unknown[];
  };
}

export function AdminDashboard({ stats }: AdminDashboardProps) {
  const pendingCount = Array.isArray(stats.pendingTopUps)
    ? stats.pendingTopUps.length
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-warm-white">لوحة الإدارة</h1>
        <Button variant="ghost" size="sm" className="min-h-11" onClick={() => signOut({ callbackUrl: "/admin/login" })}>
          خروج
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <CircuitCard>
          <p className="text-sm text-dim">Spark متداول</p>
          <div className="mt-2">
            <SparkBadge amount={stats.totalSpark} />
          </div>
        </CircuitCard>
        <CircuitCard>
          <p className="text-sm text-dim">حملات نشطة</p>
          <p className="mt-2 font-mono text-3xl text-gold-1">{stats.activeCampaigns}</p>
        </CircuitCard>
        <CircuitCard>
          <p className="text-sm text-dim">إجمالي الاستردادات</p>
          <p className="mt-2 font-mono text-3xl text-gold-1">{stats.totalRedemptions}</p>
        </CircuitCard>
      </div>

      <CircuitCard className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-gold-1">طلبات شحن معلّقة</p>
          <p className="text-sm text-dim">{pendingCount} بانتظار المراجعة</p>
        </div>
        <Button href="/admin/wallet" className="min-h-11">
          مراجعة المحفظة
        </Button>
      </CircuitCard>

      <div className="grid gap-3 sm:grid-cols-2">
        <Button href="/admin/settings" variant="secondary" className="min-h-11">
          إعدادات المنصة
        </Button>
        <Button href="/admin/homepage" variant="secondary" className="min-h-11">
          الصفحة الرئيسية
        </Button>
        <Button href="/admin/trust" variant="secondary" className="min-h-11">
          الثقة والتوثيق
        </Button>
      </div>
    </div>
  );
}
