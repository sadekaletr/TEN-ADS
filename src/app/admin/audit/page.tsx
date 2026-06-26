import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/session-auth";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { CircuitCard } from "@/components/ui/CircuitCard";
import { formatDateTime } from "@/lib/format";

export default async function AdminAuditPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="سجل التدقيق"
        description="آخر 100 حدث في المنصة"
        breadcrumbs={[
          { label: "الإدارة", href: "/admin" },
          { label: "التدقيق" },
        ]}
      />
      <CircuitCard className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gold-4/20 text-dim">
              <th className="px-3 py-2 text-start">الوقت</th>
              <th className="px-3 py-2 text-start">الفاعل</th>
              <th className="px-3 py-2 text-start">الإجراء</th>
              <th className="px-3 py-2 text-start">الكيان</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-b border-gold-4/10">
                <td className="px-3 py-2 text-dim whitespace-nowrap">
                  {formatDateTime(log.createdAt)}
                </td>
                <td className="px-3 py-2">{log.actorType ?? "—"}</td>
                <td className="px-3 py-2">{log.action}</td>
                <td className="px-3 py-2 text-dim">
                  {log.entityType}
                  {log.entityId ? ` · ${log.entityId.slice(0, 8)}` : ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CircuitCard>
    </div>
  );
}
